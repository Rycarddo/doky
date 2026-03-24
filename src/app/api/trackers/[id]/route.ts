import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapTrackerFromDB, trackerInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  // Unlink processes before deleting (no cascade rule on trackerId)
  await prisma.process.updateMany({ where: { trackerId: id }, data: { trackerId: null } });
  await prisma.ocomProcess.updateMany({ where: { trackerId: id }, data: { trackerId: null } });
  await prisma.tracker.delete({ where: { id } });
  broadcast("trackers");
  broadcast("processes");
  broadcast("ocom");
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { modelId, subject, tasksToAdd, taskIdsToDelete, taskOrder, taskModelUpdates } = await req.json();

  // Delete removed tasks (ProcessTask cascades automatically)
  if (taskIdsToDelete?.length) {
    await prisma.trackerTask.deleteMany({
      where: { id: { in: taskIdsToDelete }, trackerId: id },
    });
  }

  // Update task order for existing tasks
  if (taskOrder?.length) {
    await Promise.all(
      (taskOrder as string[]).map((taskId, index) =>
        prisma.trackerTask.update({
          where: { id: taskId, trackerId: id },
          data: { order: index },
        })
      )
    );
  }

  // Update model for existing tasks
  if (taskModelUpdates && Object.keys(taskModelUpdates).length) {
    await Promise.all(
      Object.entries(taskModelUpdates as Record<string, string | null>).map(([taskId, mId]) =>
        prisma.trackerTask.update({
          where: { id: taskId, trackerId: id },
          data: { documentTemplateId: mId ?? null },
        })
      )
    );
  }

  // Determine next order for new tasks
  let nextOrder = 0;
  if (tasksToAdd?.length) {
    if (taskOrder?.length) {
      nextOrder = taskOrder.length;
    } else {
      const existing = await prisma.trackerTask.findMany({
        where: { trackerId: id },
        select: { order: true },
      });
      nextOrder = existing.reduce((max, t) => Math.max(max, t.order), -1) + 1;
    }
  }

  const data: Record<string, unknown> = {};
  if (subject !== undefined) data.name = subject;
  if (modelId !== undefined) data.documentTemplateId = modelId ?? null;
  if (tasksToAdd?.length) {
    data.tasks = {
      create: (tasksToAdd as { text: string; modelId?: string }[]).map(
        (t, i) => ({
          title: t.text,
          order: nextOrder + i,
          documentTemplateId: t.modelId ?? null,
        })
      ),
    };
  }

  const tracker = await prisma.tracker.update({
    where: { id },
    data,
    include: trackerInclude,
  });

  // Rebuild linked process task rows when tasks change
  if (taskIdsToDelete?.length || tasksToAdd?.length) {
    const currentTasks = await prisma.trackerTask.findMany({
      where: { trackerId: id },
      orderBy: { order: "asc" },
    });

    const linkedProcesses = await prisma.process.findMany({
      where: { trackerId: id },
      select: { id: true },
    });
    for (const process of linkedProcesses) {
      await prisma.processTask.deleteMany({ where: { processId: process.id } });
      if (currentTasks.length) {
        await prisma.processTask.createMany({
          data: currentTasks.map((t) => ({ processId: process.id, trackerTaskId: t.id })),
          skipDuplicates: true,
        });
      }
    }

    const linkedOcoms = await prisma.ocomProcess.findMany({
      where: { trackerId: id },
      select: { id: true },
    });
    for (const ocom of linkedOcoms) {
      await prisma.ocomProcessTask.deleteMany({ where: { ocomProcessId: ocom.id } });
      if (currentTasks.length) {
        await prisma.ocomProcessTask.createMany({
          data: currentTasks.map((t) => ({ ocomProcessId: ocom.id, trackerTaskId: t.id })),
          skipDuplicates: true,
        });
      }
    }
  }

  broadcast("trackers");
  // Broadcast processes/ocom when task structure or task models change
  if (taskIdsToDelete?.length || tasksToAdd?.length || taskOrder?.length || (taskModelUpdates && Object.keys(taskModelUpdates).length)) {
    broadcast("processes");
    broadcast("ocom");
  }
  return NextResponse.json(mapTrackerFromDB(tracker));
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapTrackerFromDB, trackerInclude } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { modelId, subject, tasksToAdd, taskIdsToDelete } = await req.json();

  // Delete removed tasks (ProcessTask cascades automatically)
  if (taskIdsToDelete?.length) {
    await prisma.trackerTask.deleteMany({
      where: { id: { in: taskIdsToDelete }, trackerId: id },
    });
  }

  // Determine next order for new tasks
  let nextOrder = 0;
  if (tasksToAdd?.length) {
    const existing = await prisma.trackerTask.findMany({
      where: { trackerId: id },
      select: { order: true },
    });
    nextOrder = existing.reduce((max, t) => Math.max(max, t.order), -1) + 1;
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

  return NextResponse.json(mapTrackerFromDB(tracker));
}

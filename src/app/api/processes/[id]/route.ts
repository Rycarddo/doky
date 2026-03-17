import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapProcessToAppDocument, parsePtBRDate, processInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.process.delete({ where: { id } });
  broadcast("processes");
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { sigad, priority, subject, deadline, linkedProcess, status, trackerId } = body;

  const data: Record<string, unknown> = {};
  if (sigad !== undefined) data.sigad = sigad;
  if (priority !== undefined) data.priority = priority === "Alta" ? "HIGH" : "NORMAL";
  if (subject !== undefined) data.subject = subject;
  if (deadline !== undefined) data.deadline = parsePtBRDate(deadline);
  if (linkedProcess !== undefined) data.linkedProcess = linkedProcess || null;
  if (status !== undefined) data.status = status === "Finalizado" ? "DONE" : "IN_PROGRESS";
  if (trackerId !== undefined) data.trackerId = trackerId || null;

  // If trackerId is being changed, rebuild ProcessTasks
  if (trackerId !== undefined) {
    await prisma.processTask.deleteMany({ where: { processId: id } });
    if (trackerId) {
      const trackerTasks = await prisma.trackerTask.findMany({
        where: { trackerId },
        orderBy: { order: "asc" },
      });
      await prisma.processTask.createMany({
        data: trackerTasks.map((t) => ({ processId: id, trackerTaskId: t.id })),
        skipDuplicates: true,
      });
    }
  }

  const process = await prisma.process.update({
    where: { id },
    data,
    include: processInclude,
  });

  broadcast("processes");
  return NextResponse.json(mapProcessToAppDocument(process));
}

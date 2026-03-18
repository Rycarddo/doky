import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, logOcomChange, mapOcomFromDB, ocomInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  const { id, taskId } = await params;
  const user = await getCurrentUser();

  const current = await prisma.ocomProcessTask.findUniqueOrThrow({
    where: { id: taskId },
    include: { trackerTask: { select: { title: true } } },
  });

  const updated = await prisma.ocomProcessTask.update({
    where: { id: taskId },
    data: { done: !current.done },
  });

  await logOcomChange({
    ocomProcessId: id,
    userId: user.id,
    action: updated.done ? "Marcou tarefa como concluída" : "Marcou tarefa como pendente",
    field: current.trackerTask.title,
    oldValue: current.done ? "Concluída" : "Pendente",
    newValue: updated.done ? "Concluída" : "Pendente",
  });

  const fresh = await prisma.ocomProcess.findUniqueOrThrow({ where: { id }, include: ocomInclude });
  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(fresh));
}

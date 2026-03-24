import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePtBRDate } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

const taskInclude = {
  responsible: { select: { id: true, name: true } },
  creator: { select: { id: true, name: true } },
  process: { select: { id: true, sigad: true, subject: true } },
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { text, priority, deadline, scheduledAt, processId, done } = body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(text !== undefined && { text: text.trim() }),
      ...(priority !== undefined && { priority: priority === "Alta" ? "HIGH" : "NORMAL" }),
      ...(deadline !== undefined && { deadline: parsePtBRDate(deadline) }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      ...(processId !== undefined && { processId: processId || null }),
      ...(done !== undefined && { done }),
    },
    include: taskInclude,
  });

  broadcast("tasks");
  return NextResponse.json(task);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  broadcast("tasks");
  return NextResponse.json({ ok: true });
}

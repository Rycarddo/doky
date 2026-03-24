import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, parsePtBRDate } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

const taskInclude = {
  responsible: { select: { id: true, name: true } },
  creator: { select: { id: true, name: true } },
  process: { select: { id: true, sigad: true, subject: true } },
};

export async function GET(req: NextRequest) {
  const caixa = req.nextUrl.searchParams.get("caixa");
  const tasks = await prisma.task.findMany({
    where: caixa ? { caixa: caixa as "OCNO" | "OCOM" | "CIVA_AZ" } : undefined,
    include: taskInclude,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const { text, priority, deadline, scheduledAt, processId, caixa } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      text: text.trim(),
      priority: priority === "Alta" ? "HIGH" : "NORMAL",
      deadline: parsePtBRDate(deadline),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      caixa: (caixa as "OCNO" | "OCOM" | "CIVA_AZ") ?? "OCNO",
      responsibleId: user.id,
      creatorId: user.id,
      processId: processId || null,
    },
    include: taskInclude,
  });

  broadcast("tasks");
  return NextResponse.json(task, { status: 201 });
}

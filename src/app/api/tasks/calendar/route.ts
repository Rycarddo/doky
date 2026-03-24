import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

export type CalendarTask = { id: string; text: string; time: string; caixa: string };
export type CalendarData = Record<string, CalendarTask[]>;

const spDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Manaus",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const spTime = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Manaus",
  hour: "2-digit",
  minute: "2-digit",
});

export async function GET() {
  const user = await getCurrentUser();

  // Determine which caixas this user can see
  let caixasFilter: ("OCNO" | "OCOM" | "CIVA_AZ")[] | null = null;
  if (user.role !== "ADMIN") {
    const approved = await prisma.approvedUser.findUnique({
      where: { email: user.email },
      include: { caixas: true },
    });
    caixasFilter = (approved?.caixas.map((c) => c.caixa) ?? []) as (
      | "OCNO"
      | "OCOM"
      | "CIVA_AZ"
    )[];
  }

  const tasks = await prisma.task.findMany({
    where: {
      scheduledAt: { not: null },
      done: false,
      ...(caixasFilter !== null && { caixa: { in: caixasFilter } }),
    },
    select: { id: true, text: true, scheduledAt: true, caixa: true },
    orderBy: { scheduledAt: "asc" },
  });

  const grouped: CalendarData = {};
  for (const task of tasks) {
    // Group by São Paulo local date so a 23:00 BRT task stays on the correct day
    const date = spDate.format(task.scheduledAt!);
    const time = spTime.format(task.scheduledAt!);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push({ id: task.id, text: task.text, time, caixa: task.caixa });
  }

  return NextResponse.json(grouped);
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, mapOcomFromDB, ocomInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

export async function GET() {
  const records = await prisma.ocomProcess.findMany({
    include: ocomInclude,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(records.map(mapOcomFromDB));
}

function parsePrazo(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Expects YYYY-MM-DD from date input
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    processo,
    categoria,
    desigTelegrafica,
    localidade,
    empresa,
    situacao,
    prazo,
    anoInicio,
    trackerId,
  } = body;

  await getCurrentUser();

  const record = await prisma.ocomProcess.create({
    data: {
      processo,
      categoria,
      desigTelegrafica,
      localidade,
      empresa: empresa || null,
      situacao: situacao ?? "EM ANDAMENTO",
      prazo: parsePrazo(prazo),
      anoInicio: Number(anoInicio),
      trackerId: trackerId || null,
    },
    include: ocomInclude,
  });

  // Create OcomProcessTask rows if a tracker was specified
  if (trackerId) {
    const trackerTasks = await prisma.trackerTask.findMany({
      where: { trackerId },
      orderBy: { order: "asc" },
    });
    if (trackerTasks.length > 0) {
      await prisma.ocomProcessTask.createMany({
        data: trackerTasks.map((t) => ({ ocomProcessId: record.id, trackerTaskId: t.id })),
        skipDuplicates: true,
      });
      const withTasks = await prisma.ocomProcess.findUniqueOrThrow({
        where: { id: record.id },
        include: ocomInclude,
      });
      broadcast("ocom");
      return NextResponse.json(mapOcomFromDB(withTasks), { status: 201 });
    }
  }

  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(record), { status: 201 });
}

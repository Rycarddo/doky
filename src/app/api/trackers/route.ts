import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapTrackerFromDB, trackerInclude } from "@/lib/db-helpers";

export async function GET(req: NextRequest) {
  const caixa = req.nextUrl.searchParams.get("caixa");
  const trackers = await prisma.tracker.findMany({
    where: caixa ? { caixa: caixa as "OCNO" | "OCOM" | "CIVA_AZ" } : undefined,
    include: trackerInclude,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(trackers.map(mapTrackerFromDB));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subject, tasks, modelId, caixa } = body as {
    subject: string;
    tasks: { text: string; modelId?: string }[];
    modelId?: string;
    caixa?: string;
  };

  const tracker = await prisma.tracker.create({
    data: {
      name: subject,
      caixa: (caixa as "OCNO" | "OCOM" | "CIVA_AZ") ?? "OCNO",
      documentTemplateId: modelId ?? null,
      tasks: {
        create: tasks.map((t, index) => ({
          title: t.text,
          order: index,
          documentTemplateId: t.modelId ?? null,
        })),
      },
    },
    include: trackerInclude,
  });

  return NextResponse.json(mapTrackerFromDB(tracker), { status: 201 });
}

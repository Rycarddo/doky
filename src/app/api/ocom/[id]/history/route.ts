import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, logOcomChange, mapOcomFromDB, ocomInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { text, estadoDoc } = await req.json();

  const user = await getCurrentUser();

  const entry = await prisma.ocomHistory.create({
    data: { text, estadoDoc: estadoDoc ?? "Minuta", ocomProcessId: id, creatorId: user.id },
    include: { creator: { select: { name: true } } },
  });

  await logOcomChange({
    ocomProcessId: id,
    userId: user.id,
    action: "Adicionou atualização",
    newValue: `[${estadoDoc ?? "Minuta"}] ${text}`,
  });

  const fresh = await prisma.ocomProcess.findUniqueOrThrow({ where: { id }, include: ocomInclude });
  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(fresh), { status: 201 });
}

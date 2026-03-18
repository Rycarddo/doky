import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, logOcomChange, mapOcomFromDB, ocomInclude } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id, entryId } = await params;
  const { text, estadoDoc } = await req.json();

  const user = await getCurrentUser();

  // Fetch current entry before update for comparison
  const current = await prisma.ocomHistory.findUniqueOrThrow({ where: { id: entryId } });

  const data: Record<string, unknown> = { text, creatorId: user.id };
  if (estadoDoc !== undefined) data.estadoDoc = estadoDoc;

  const entry = await prisma.ocomHistory.update({
    where: { id: entryId },
    data,
    include: { creator: { select: { name: true } } },
  });

  // Log each changed field
  if (text !== current.text) {
    await logOcomChange({
      ocomProcessId: id,
      userId: user.id,
      action: "Editou atualização",
      field: "Texto",
      oldValue: current.text,
      newValue: text,
    });
  }
  if (estadoDoc !== undefined && estadoDoc !== current.estadoDoc) {
    await logOcomChange({
      ocomProcessId: id,
      userId: user.id,
      action: "Editou atualização",
      field: "Estado Doc.",
      oldValue: current.estadoDoc,
      newValue: estadoDoc,
    });
  }

  const fresh = await prisma.ocomProcess.findUniqueOrThrow({ where: { id }, include: ocomInclude });
  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(fresh));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id, entryId } = await params;
  const user = await getCurrentUser();

  const entry = await prisma.ocomHistory.findUniqueOrThrow({ where: { id: entryId } });

  await prisma.ocomHistory.delete({ where: { id: entryId } });

  await logOcomChange({
    ocomProcessId: id,
    userId: user.id,
    action: "Excluiu atualização",
    oldValue: `[${entry.estadoDoc}] ${entry.text}`,
  });

  const fresh = await prisma.ocomProcess.findUniqueOrThrow({ where: { id }, include: ocomInclude });
  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(fresh));
}

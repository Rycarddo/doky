import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  const { text } = await req.json();

  const entry = await prisma.processHistory.update({
    where: { id: entryId },
    data: { text },
    include: { creator: { select: { username: true } } },
  });

  return NextResponse.json({
    id: entry.id,
    text: entry.text,
    sigad: entry.sigad,
    date: entry.createdAt.toLocaleString("pt-BR"),
    user: entry.creator.username,
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  await prisma.processHistory.delete({ where: { id: entryId } });
  return new NextResponse(null, { status: 204 });
}

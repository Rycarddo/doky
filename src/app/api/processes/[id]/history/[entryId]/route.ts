import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  const { text } = await req.json();
  const currentUser = await getCurrentUser();

  const entry = await prisma.processHistory.update({
    where: { id: entryId },
    data: { text, creatorId: currentUser.id },
    include: { creator: { select: { name: true } } },
  });

  return NextResponse.json({
    id: entry.id,
    text: entry.text,
    sigad: entry.sigad,
    date: (entry.updatedAt ?? entry.createdAt).toLocaleString("pt-BR"),
    user: entry.creator.name,
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  await prisma.processHistory.delete({ where: { id: entryId } });
  return new NextResponse(null, { status: 204 });
}

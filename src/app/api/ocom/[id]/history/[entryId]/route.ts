import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  const { text } = await req.json();

  const user = await getCurrentUser();

  const entry = await prisma.ocomHistory.update({
    where: { id: entryId },
    data: { text, creatorId: user.id },
    include: { creator: { select: { username: true } } },
  });

  return NextResponse.json({
    id: entry.id,
    text: entry.text,
    date: (entry.updatedAt ?? entry.createdAt).toLocaleString("pt-BR"),
    user: entry.creator.username,
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { entryId } = await params;
  await prisma.ocomHistory.delete({ where: { id: entryId } });
  return new NextResponse(null, { status: 204 });
}

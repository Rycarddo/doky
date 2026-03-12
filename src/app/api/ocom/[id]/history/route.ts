import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { text } = await req.json();

  const user = await getCurrentUser();

  const entry = await prisma.ocomHistory.create({
    data: { text, ocomProcessId: id, creatorId: user.id },
    include: { creator: { select: { name: true } } },
  });

  return NextResponse.json(
    {
      id: entry.id,
      text: entry.text,
      date: entry.createdAt.toLocaleString("pt-BR"),
      user: entry.creator.name,
    },
    { status: 201 }
  );
}

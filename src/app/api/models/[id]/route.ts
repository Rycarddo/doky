import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapModelFromDB } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { content, subject } = await req.json();

  const model = await prisma.documentTemplate.update({
    where: { id },
    data: {
      ...(content !== undefined && { text: content }),
      ...(subject !== undefined && { name: subject }),
    },
  });

  return NextResponse.json(mapModelFromDB(model));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.documentTemplate.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

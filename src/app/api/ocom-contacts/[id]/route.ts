import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { orgaoAts, tf2, tf4 } = await req.json();
  const contact = await prisma.ocomOperationalContact.update({
    where: { id },
    data: {
      ...(orgaoAts !== undefined && { orgaoAts: orgaoAts.trim() }),
      ...(tf2 !== undefined && { tf2: tf2.trim() }),
      ...(tf4 !== undefined && { tf4: tf4.trim() }),
    },
  });
  return NextResponse.json(contact);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.ocomOperationalContact.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

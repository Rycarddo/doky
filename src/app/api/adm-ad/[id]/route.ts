import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { radio, oprOrgao, oprAd, horarioFuncionamento } = await req.json();
  const contact = await prisma.admAdContact.update({
    where: { id },
    data: {
      ...(radio !== undefined && { radio: radio.trim() }),
      ...(oprOrgao !== undefined && { oprOrgao: oprOrgao.trim() }),
      ...(oprAd !== undefined && { oprAd: oprAd.trim() }),
      ...(horarioFuncionamento !== undefined && { horarioFuncionamento: horarioFuncionamento.trim() }),
    },
  });
  return NextResponse.json(contact);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.admAdContact.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

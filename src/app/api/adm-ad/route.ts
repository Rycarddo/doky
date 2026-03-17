import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AdmAdGroup } from "../../../../generated/prisma/enums";

export async function GET(req: NextRequest) {
  const group = req.nextUrl.searchParams.get("group") as AdmAdGroup | null;
  const contacts = await prisma.admAdContact.findMany({
    where: group ? { group } : undefined,
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const { group, radio, oprOrgao, oprAd, horarioFuncionamento } = await req.json();
  if (!group) {
    return NextResponse.json({ error: "Grupo é obrigatório" }, { status: 400 });
  }
  const contact = await prisma.admAdContact.create({
    data: {
      group: group as AdmAdGroup,
      radio: radio?.trim() ?? "",
      oprOrgao: oprOrgao?.trim() ?? "",
      oprAd: oprAd?.trim() ?? "",
      horarioFuncionamento: horarioFuncionamento?.trim() ?? "",
    },
  });
  return NextResponse.json(contact, { status: 201 });
}

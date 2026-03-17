import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.ocomOperationalContact.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const { orgaoAts, tf2, tf4 } = await req.json();
  if (!orgaoAts?.trim()) {
    return NextResponse.json({ error: "Órgão ATS é obrigatório" }, { status: 400 });
  }
  const contact = await prisma.ocomOperationalContact.create({
    data: { orgaoAts: orgaoAts.trim(), tf2: tf2?.trim() ?? "", tf4: tf4?.trim() ?? "" },
  });
  return NextResponse.json(contact, { status: 201 });
}

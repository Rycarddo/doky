import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapModelFromDB } from "@/lib/db-helpers";

export async function GET(req: NextRequest) {
  const caixa = req.nextUrl.searchParams.get("caixa");
  const models = await prisma.documentTemplate.findMany({
    where: caixa ? { caixa: caixa as "OCNO" | "OCOM" | "CIVA_AZ" } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(models.map(mapModelFromDB));
}

export async function POST(req: NextRequest) {
  const { subject, content, caixa } = await req.json();

  const model = await prisma.documentTemplate.create({
    data: { name: subject, text: content, caixa: caixa ?? "OCNO" },
  });

  return NextResponse.json(mapModelFromDB(model), { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapModelFromDB } from "@/lib/db-helpers";

export async function GET() {
  const models = await prisma.documentTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(models.map(mapModelFromDB));
}

export async function POST(req: NextRequest) {
  const { subject, content } = await req.json();

  const model = await prisma.documentTemplate.create({
    data: { name: subject, text: content },
  });

  return NextResponse.json(mapModelFromDB(model), { status: 201 });
}

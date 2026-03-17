import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { OperatorLocation } from "../../../../generated/prisma/enums";

export async function GET() {
  const contacts = await prisma.contact.findMany();
  return NextResponse.json(contacts);
}

export async function PATCH(req: NextRequest) {
  const { location, content } = await req.json();

  const contact = await prisma.contact.upsert({
    where: { location: location as OperatorLocation },
    update: { content },
    create: { location: location as OperatorLocation, content },
  });

  return NextResponse.json(contact);
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapOcomFromDB, ocomInclude } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

function parsePrazo(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};

  const stringFields = ["processo", "categoria", "desigTelegrafica", "localidade", "situacao"] as const;
  for (const field of stringFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  if (body.empresa !== undefined) data.empresa = body.empresa || null;
  if (body.anoInicio !== undefined) data.anoInicio = Number(body.anoInicio);
  if (body.prazo !== undefined) data.prazo = body.prazo ? parsePrazo(body.prazo) : null;

  const record = await prisma.ocomProcess.update({
    where: { id },
    data,
    include: ocomInclude,
  });

  return NextResponse.json(mapOcomFromDB(record));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.ocomProcess.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

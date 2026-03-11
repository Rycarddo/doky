import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapProcessToAppDocument, parsePtBRDate, processInclude } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { sigad, priority, subject, deadline, linkedProcess, status } = body;

  const data: Record<string, unknown> = {};
  if (sigad !== undefined) data.sigad = sigad;
  if (priority !== undefined) data.priority = priority === "Alta" ? "HIGH" : "NORMAL";
  if (subject !== undefined) data.subject = subject;
  if (deadline !== undefined) data.deadline = parsePtBRDate(deadline);
  if (linkedProcess !== undefined) data.linkedProcess = linkedProcess || null;
  if (status !== undefined) data.status = status === "Finalizado" ? "DONE" : "IN_PROGRESS";

  const process = await prisma.process.update({
    where: { id },
    data,
    include: processInclude,
  });

  return NextResponse.json(mapProcessToAppDocument(process));
}

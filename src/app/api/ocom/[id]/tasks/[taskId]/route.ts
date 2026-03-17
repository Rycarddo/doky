import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  const { taskId } = await params;

  const current = await prisma.ocomProcessTask.findUniqueOrThrow({
    where: { id: taskId },
  });

  const updated = await prisma.ocomProcessTask.update({
    where: { id: taskId },
    data: { done: !current.done },
  });

  broadcast("ocom");
  return NextResponse.json({ id: updated.id, done: updated.done });
}

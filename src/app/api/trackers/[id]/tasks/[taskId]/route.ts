import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { taskId } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if ("modelId" in body) data.documentTemplateId = body.modelId ?? null;
  if ("done" in body) data.done = body.done;

  const task = await prisma.trackerTask.update({
    where: { id: taskId },
    data,
    select: {
      id: true,
      title: true,
      order: true,
      documentTemplateId: true,
    },
  });

  broadcast("trackers");
  return NextResponse.json({
    id: task.id,
    text: task.title,
    done: false,
    modelId: task.documentTemplateId ?? undefined,
  });
}

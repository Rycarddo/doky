import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUser,
  mapProcessToAppDocument,
  parsePtBRDate,
  processInclude,
} from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

export async function GET() {
  const processes = await prisma.process.findMany({
    include: processInclude,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(processes.map(mapProcessToAppDocument));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sigad, priority, subject, deadline, linkedProcess, trackerId } = body;

  const user = await getCurrentUser();

  // If a tracker is provided, fetch its tasks to create ProcessTasks
  const trackerTasks = trackerId
    ? await prisma.trackerTask.findMany({ where: { trackerId }, orderBy: { order: "asc" } })
    : [];

  const process = await prisma.process.create({
    data: {
      sigad,
      priority: priority === "Alta" ? "HIGH" : "NORMAL",
      subject,
      deadline: parsePtBRDate(deadline) ?? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      linkedProcess: linkedProcess || null,
      creatorId: user.id,
      trackerId: trackerId || null,
      tasks: {
        create: trackerTasks.map((t) => ({ trackerTaskId: t.id })),
      },
    },
    include: processInclude,
  });

  broadcast("processes");
  return NextResponse.json(mapProcessToAppDocument(process), { status: 201 });
}

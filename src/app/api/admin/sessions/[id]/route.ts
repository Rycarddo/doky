import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

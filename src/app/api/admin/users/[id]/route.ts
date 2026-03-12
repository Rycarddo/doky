import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { name, role, caixas } = await req.json();

  const updated = await prisma.approvedUser.update({
    where: { id },
    data: { name, role },
  });

  // Sync name and role on the User record if they already exist
  await prisma.user.updateMany({
    where: { email: updated.email },
    data: { name: updated.name, role: updated.role },
  });

  // Replace caixas if provided
  if (Array.isArray(caixas)) {
    await prisma.userCaixa.deleteMany({ where: { approvedUserId: id } });
    if (caixas.length > 0) {
      await prisma.userCaixa.createMany({
        data: caixas.map((c: string) => ({ approvedUserId: id, caixa: c })),
      });
    }
  }

  const withCaixas = await prisma.approvedUser.findUnique({
    where: { id },
    include: { caixas: true },
  });

  return NextResponse.json(withCaixas);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.approvedUser.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.approvedUser.findMany({
    orderBy: { createdAt: "asc" },
    include: { caixas: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, name, role, caixas } = await req.json();

  if (!email || !name || !role) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const user = await prisma.approvedUser.create({
    data: {
      email,
      name,
      role,
      ...(caixas?.length
        ? { caixas: { create: caixas.map((c: string) => ({ caixa: c })) } }
        : {}),
    },
    include: { caixas: true },
  });
  return NextResponse.json(user, { status: 201 });
}

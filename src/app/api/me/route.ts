import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const approved = await prisma.approvedUser.findUnique({
    where: { email: session.user.email },
    include: { caixas: true },
  });

  if (!approved) return NextResponse.json({ caixas: [] });

  return NextResponse.json({
    caixas: approved.caixas.map((c) => c.caixa),
  });
}

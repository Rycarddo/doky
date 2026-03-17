import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function resolveDestination(caixas: string[], isAdmin: boolean): string {
  if (isAdmin || caixas.includes("OCNO")) return "/";
  if (caixas.includes("OCOM")) return "/controleOcom";
  if (caixas.includes("CIVA_AZ")) return "/modelos/civa-az";
  return "/";
}

export default async function AuthRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";

  if (isAdmin) redirect("/");

  const approved = await prisma.approvedUser.findUnique({
    where: { email: session.user.email },
    include: { caixas: true },
  });

  const caixas = approved?.caixas.map((c) => c.caixa) ?? [];
  redirect(resolveDestination(caixas, false));
}

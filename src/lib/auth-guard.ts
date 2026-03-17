import { headers } from "next/headers";
import { auth } from "./auth";
import type { UserRole } from "../../generated/prisma/enums";

const roleRank: Record<UserRole, number> = {
  OPERATOR: 1,
  ADMIN: 2,
};

export async function requireAuth(minRole: UserRole = "OPERATOR") {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { authorized: false, error: "Não autenticado" } as const;
    }

    const userRole = (session.user as { role?: UserRole }).role ?? "OPERATOR";

    if (roleRank[userRole] < roleRank[minRole]) {
      return { authorized: false, error: "Acesso não autorizado" } as const;
    }

    return { authorized: true, user: session.user } as const;
  } catch {
    return { authorized: false, error: "Erro de autenticação" } as const;
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/db-helpers";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();

  const [
    totalUsers,
    totalApproved,
    allSessions,
    totalProcesses,
    totalOcomProcesses,
    totalTrackers,
    totalModels,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.approvedUser.count(),
    prisma.session.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.process.count(),
    prisma.ocomProcess.count(),
    prisma.tracker.count(),
    prisma.documentTemplate.count(),
  ]);

  const activeSessions = allSessions.filter((s) => s.expiresAt > now);

  return NextResponse.json({
    stats: {
      totalUsers,
      totalApproved,
      activeSessions: activeSessions.length,
      totalProcesses,
      totalOcomProcesses,
      totalTrackers,
      totalModels,
    },
    activeSessions: activeSessions.map((s) => ({
      id: s.id,
      userName: s.user.name,
      email: s.user.email,
      ipAddress: s.ipAddress ?? null,
      userAgent: s.userAgent ?? null,
      createdAt: s.createdAt.toISOString(),
      expiresAt: s.expiresAt.toISOString(),
    })),
    recentLogins: allSessions.map((s) => ({
      id: s.id,
      userName: s.user.name,
      email: s.user.email,
      ipAddress: s.ipAddress ?? null,
      userAgent: s.userAgent ?? null,
      createdAt: s.createdAt.toISOString(),
      isActive: s.expiresAt > now,
    })),
  });
}

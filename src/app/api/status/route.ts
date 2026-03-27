import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ServiceStatus = "operational" | "degraded" | "outage";

type CheckResult = {
  key: string;
  name: string;
  group: string;
  status: ServiceStatus;
  latency: number | null;
  error: string | null;
};

async function check(
  key: string,
  name: string,
  group: string,
  fn: () => Promise<void>
): Promise<CheckResult> {
  const start = Date.now();
  try {
    await fn();
    const latency = Date.now() - start;
    return {
      key,
      name,
      group,
      status: latency > 2000 ? "degraded" : "operational",
      latency,
      error: null,
    };
  } catch (e) {
    return {
      key,
      name,
      group,
      status: "outage",
      latency: null,
      error: e instanceof Error ? e.message : "Erro desconhecido",
    };
  }
}

export async function GET() {
  const results = await Promise.all([
    check("database", "Banco de Dados", "Infraestrutura", async () => {
      await prisma.$queryRaw`SELECT 1`;
    }),
    check("auth", "Autenticação", "Infraestrutura", async () => {
      await prisma.user.count();
    }),
    check("processes", "Processos OCNO", "OCNO", async () => {
      await prisma.process.count();
    }),
    check("trackers_ocno", "Trackers", "OCNO", async () => {
      await prisma.tracker.count({ where: { caixa: "OCNO" } });
    }),
    check("models_ocno", "Modelos", "OCNO", async () => {
      await prisma.documentTemplate.count({ where: { caixa: "OCNO" } });
    }),
    check("tasks_ocno", "Tarefas", "OCNO", async () => {
      await prisma.task.count({ where: { caixa: "OCNO" } });
    }),
    check("ocom", "Processos OCOM", "OCOM", async () => {
      await prisma.ocomProcess.count();
    }),
    check("trackers_ocom", "Trackers OCOM", "OCOM", async () => {
      await prisma.tracker.count({ where: { caixa: "OCOM" } });
    }),
    check("models_ocom", "Modelos OCOM", "OCOM", async () => {
      await prisma.documentTemplate.count({ where: { caixa: "OCOM" } });
    }),
    check("tasks_ocom", "Tarefas OCOM", "OCOM", async () => {
      await prisma.task.count({ where: { caixa: "OCOM" } });
    }),
    check("contacts", "Contatos", "Outros", async () => {
      await prisma.contact.count();
    }),
    check("adm_ad", "ADM AD", "Outros", async () => {
      await prisma.admAdContact.count();
    }),
  ]);

  const overallStatus: ServiceStatus =
    results.some((r) => r.status === "outage")
      ? "outage"
      : results.some((r) => r.status === "degraded")
        ? "degraded"
        : "operational";

  const groups = Array.from(new Set(results.map((r) => r.group)));

  return NextResponse.json({
    status: overallStatus,
    checkedAt: new Date().toISOString(),
    groups: groups.map((group) => ({
      name: group,
      services: results.filter((r) => r.group === group),
    })),
  });
}

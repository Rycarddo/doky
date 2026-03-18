import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, mapOcomFromDB, ocomInclude, logOcomChange } from "@/lib/db-helpers";
import { broadcast } from "@/lib/sse";

type Params = { params: Promise<{ id: string }> };

function parsePrazo(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

const CONFIG_FIELD_LABELS: Record<string, string> = {
  processo: "Processo",
  categoria: "Categoria",
  desigTelegrafica: "Desig. Telegráfica",
  localidade: "Localidade",
  situacao: "Situação",
  observacoes: "Observações",
};

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const user = await getCurrentUser();

  // Fetch current state before update for comparison
  const current = await prisma.ocomProcess.findUniqueOrThrow({
    where: { id },
    include: { tracker: { select: { id: true, name: true } } },
  });

  const data: Record<string, unknown> = {};

  const stringFields = ["processo", "categoria", "desigTelegrafica", "localidade", "situacao", "observacoes"] as const;
  for (const field of stringFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }

  if (body.empresa !== undefined) data.empresa = body.empresa || null;
  if (body.anoInicio !== undefined) data.anoInicio = Number(body.anoInicio);
  if (body.prazo !== undefined) data.prazo = body.prazo ? parsePrazo(body.prazo) : null;
  if (body.trackerId !== undefined) data.trackerId = body.trackerId || null;

  // If trackerId is being changed, rebuild OcomProcessTasks
  if (body.trackerId !== undefined) {
    await prisma.ocomProcessTask.deleteMany({ where: { ocomProcessId: id } });
    if (body.trackerId) {
      const trackerTasks = await prisma.trackerTask.findMany({
        where: { trackerId: body.trackerId },
        orderBy: { order: "asc" },
      });
      await prisma.ocomProcessTask.createMany({
        data: trackerTasks.map((t) => ({ ocomProcessId: id, trackerTaskId: t.id })),
        skipDuplicates: true,
      });
    }
  }

  const record = await prisma.ocomProcess.update({
    where: { id },
    data,
    include: ocomInclude,
  });

  // --- Log changes ---

  // Tracker change
  if (body.trackerId !== undefined && (body.trackerId || null) !== current.trackerId) {
    const newTrackerId = body.trackerId || null;
    let newTrackerName: string | null = null;
    if (newTrackerId) {
      const t = await prisma.tracker.findUnique({ where: { id: newTrackerId }, select: { name: true } });
      newTrackerName = t?.name ?? null;
    }
    await logOcomChange({
      ocomProcessId: id,
      userId: user.id,
      action: newTrackerId ? "Vinculou tracker" : "Desvinculou tracker",
      oldValue: current.tracker?.name ?? "Sem tracker",
      newValue: newTrackerName ?? "Sem tracker",
    });
  }

  // String config fields
  for (const [field, label] of Object.entries(CONFIG_FIELD_LABELS)) {
    if (body[field] !== undefined && body[field] !== current[field as keyof typeof current]) {
      await logOcomChange({
        ocomProcessId: id,
        userId: user.id,
        action: "Editou configurações",
        field: label,
        oldValue: String(current[field as keyof typeof current] ?? "—"),
        newValue: String(body[field] ?? "—"),
      });
    }
  }

  // Empresa
  if (body.empresa !== undefined) {
    const oldEmpresa = current.empresa ?? "";
    const newEmpresa = body.empresa || "";
    if (oldEmpresa !== newEmpresa) {
      await logOcomChange({
        ocomProcessId: id,
        userId: user.id,
        action: "Editou configurações",
        field: "Empresa",
        oldValue: oldEmpresa || "—",
        newValue: newEmpresa || "—",
      });
    }
  }

  // Ano Início
  if (body.anoInicio !== undefined && Number(body.anoInicio) !== current.anoInicio) {
    await logOcomChange({
      ocomProcessId: id,
      userId: user.id,
      action: "Editou configurações",
      field: "Ano Início",
      oldValue: String(current.anoInicio),
      newValue: String(body.anoInicio),
    });
  }

  // Prazo
  if (body.prazo !== undefined) {
    const newPrazo = body.prazo ? parsePrazo(body.prazo) : null;
    const oldStr = current.prazo ? current.prazo.toLocaleDateString("pt-BR") : null;
    const newStr = newPrazo ? newPrazo.toLocaleDateString("pt-BR") : null;
    if (oldStr !== newStr) {
      await logOcomChange({
        ocomProcessId: id,
        userId: user.id,
        action: "Editou configurações",
        field: "Prazo",
        oldValue: oldStr ?? "—",
        newValue: newStr ?? "—",
      });
    }
  }

  // Re-fetch after logging so response includes new changelog entries
  const fresh = await prisma.ocomProcess.findUniqueOrThrow({ where: { id }, include: ocomInclude });
  broadcast("ocom");
  return NextResponse.json(mapOcomFromDB(fresh));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.ocomProcess.delete({ where: { id } });
  broadcast("ocom");
  return NextResponse.json({ ok: true });
}

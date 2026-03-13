import { headers } from "next/headers";
import { prisma } from "./prisma";
import { auth } from "./auth";
import type { AppDocument, Tracker, Model, HistoryEntry, TrackerTask, OcomProcess, OcomHistoryEntry, OcomSituacao } from "./types";

// Parses "DD/MM/YYYY" format (pt-BR) to Date, returns null for empty strings
export function parsePtBRDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Não autorizado");
  return prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
}

// --- Mappers ---

type ProcessFromDB = {
  id: string;
  sigad: string;
  priority: "NORMAL" | "HIGH";
  subject: string;
  status: "IN_PROGRESS" | "DONE";
  createdAt: Date;
  updatedAt: Date;
  deadline: Date | null;
  linkedProcess: string | null;
  trackerId: string | null;
  creator: { name: string };
  tracker: { documentTemplateId: string | null } | null;
  history: {
    id: string;
    text: string;
    sigad: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    creator: { name: string };
  }[];
  tasks: {
    id: string;
    done: boolean;
    trackerTask: {
      title: string;
      documentTemplateId: string | null;
    };
  }[];
};

export function mapProcessToAppDocument(p: ProcessFromDB): AppDocument {
  return {
    id: p.id,
    sigad: p.sigad,
    priority: p.priority === "HIGH" ? "Alta" : "Normal",
    subject: p.subject,
    beginning: p.createdAt.toLocaleDateString("pt-BR"),
    user: p.creator.name,
    status: p.status === "DONE" ? "Finalizado" : "Em andamento",
    lastUpdate: p.updatedAt.toLocaleDateString("pt-BR"),
    deadline: p.deadline ? p.deadline.toLocaleDateString("pt-BR") : "",
    linkedProcess: p.linkedProcess ?? "",
    trackerId: p.trackerId ?? undefined,
    trackerModelId: p.tracker?.documentTemplateId ?? undefined,
    history: p.history.map(
      (h): HistoryEntry => ({
        id: h.id,
        text: h.text,
        sigad: h.sigad ?? p.sigad,
        date: (h.updatedAt ?? h.createdAt).toLocaleString("pt-BR"),
        user: h.creator.name,
      })
    ),
    trackerTasks: p.tasks.map(
      (t): TrackerTask => ({
        id: t.id,
        text: t.trackerTask.title,
        done: t.done,
        modelId: t.trackerTask.documentTemplateId ?? undefined,
      })
    ),
  };
}

type TrackerFromDB = {
  id: string;
  name: string;
  caixa: string;
  documentTemplateId: string | null;
  createdAt: Date;
  tasks: {
    id: string;
    title: string;
    order: number;
    documentTemplateId: string | null;
  }[];
};

export function mapTrackerFromDB(t: TrackerFromDB): Tracker {
  return {
    id: t.id,
    subject: t.name,
    caixa: t.caixa,
    modelId: t.documentTemplateId ?? undefined,
    updatedAt: t.createdAt.toLocaleDateString("pt-BR"),
    tasks: t.tasks
      .sort((a, b) => a.order - b.order)
      .map((task): TrackerTask => ({
        id: task.id,
        text: task.title,
        done: false,
        modelId: task.documentTemplateId ?? undefined,
      })),
  };
}

type ModelFromDB = {
  id: string;
  name: string;
  text: string;
  caixa: string;
  updatedAt: Date;
};

export function mapModelFromDB(m: ModelFromDB): Model {
  return {
    id: m.id,
    subject: m.name,
    content: m.text,
    caixa: m.caixa,
    updatedAt: m.updatedAt.toLocaleDateString("pt-BR"),
  };
}

// Shared include for Process queries
export const processInclude = {
  creator: { select: { name: true } },
  tracker: { select: { documentTemplateId: true } },
  history: {
    include: { creator: { select: { name: true } } },
    orderBy: { createdAt: "asc" as const },
  },
  tasks: {
    include: {
      trackerTask: { select: { title: true, documentTemplateId: true } },
    },
  },
};

export const trackerInclude = {
  tasks: {
    select: { id: true, title: true, order: true, documentTemplateId: true },
  },
};

// --- OCOM ---

type OcomFromDB = {
  id: string;
  processo: string;
  categoria: string;
  desigTelegrafica: string;
  localidade: string;
  empresa: string | null;
  situacao: string;
  prazo: Date | null;
  anoInicio: number;
  observacoes?: string | null;
  trackerId: string | null;
  tracker: { documentTemplateId: string | null } | null;
  history: {
    id: string;
    text: string;
    createdAt: Date;
    creator: { name: string };
  }[];
  tasks: {
    id: string;
    done: boolean;
    trackerTask: {
      title: string;
      documentTemplateId: string | null;
    };
  }[];
};

export function mapOcomFromDB(o: OcomFromDB): OcomProcess {
  return {
    id: o.id,
    processo: o.processo,
    categoria: o.categoria,
    desigTelegrafica: o.desigTelegrafica,
    localidade: o.localidade,
    empresa: o.empresa ?? "",
    situacao: o.situacao as OcomSituacao,
    prazo: o.prazo ? o.prazo.toLocaleDateString("pt-BR") : "",
    anoInicio: o.anoInicio,
    observacoes: o.observacoes ?? undefined,
    trackerId: o.trackerId ?? undefined,
    trackerModelId: o.tracker?.documentTemplateId ?? undefined,
    history: o.history.map(
      (h): OcomHistoryEntry => ({
        id: h.id,
        text: h.text,
        date: h.createdAt.toLocaleString("pt-BR"),
        user: h.creator.name,
      })
    ),
    trackerTasks: o.tasks.map(
      (t): TrackerTask => ({
        id: t.id,
        text: t.trackerTask.title,
        done: t.done,
        modelId: t.trackerTask.documentTemplateId ?? undefined,
      })
    ),
  };
}

export const ocomInclude = {
  history: {
    include: { creator: { select: { name: true } } },
    orderBy: { createdAt: "asc" as const },
  },
  tracker: { select: { documentTemplateId: true } },
  tasks: {
    include: {
      trackerTask: { select: { title: true, documentTemplateId: true } },
    },
  },
};

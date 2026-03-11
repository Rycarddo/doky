import { prisma } from "./prisma";
import type { AppDocument, Tracker, Model, HistoryEntry, TrackerTask, OcomProcess, OcomHistoryEntry, OcomSituacao } from "./types";

// Parses "DD/MM/YYYY" format (pt-BR) to Date, returns null for empty strings
export function parsePtBRDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

// The hardcoded user for this single-user app
const CURRENT_USER_USERNAME = "rycarddo";
const CURRENT_USER_EMAIL = "rycarddo@doky.local";

export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: CURRENT_USER_EMAIL },
    update: {},
    create: { username: CURRENT_USER_USERNAME, email: CURRENT_USER_EMAIL },
  });
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
  creator: { username: string };
  history: {
    id: string;
    text: string;
    sigad: string | null;
    createdAt: Date;
    creator: { username: string };
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
    user: p.creator.username,
    status: p.status === "DONE" ? "Finalizado" : "Em andamento",
    lastUpdate: p.updatedAt.toLocaleDateString("pt-BR"),
    deadline: p.deadline ? p.deadline.toLocaleDateString("pt-BR") : "",
    linkedProcess: p.linkedProcess ?? "",
    history: p.history.map(
      (h): HistoryEntry => ({
        id: h.id,
        text: h.text,
        sigad: h.sigad ?? p.sigad,
        date: h.createdAt.toLocaleString("pt-BR"),
        user: h.creator.username,
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
  documentTemplateId: string | null;
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
    modelId: t.documentTemplateId ?? undefined,
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
};

export function mapModelFromDB(m: ModelFromDB): Model {
  return {
    id: m.id,
    subject: m.name,
    content: m.text,
  };
}

// Shared include for Process queries
export const processInclude = {
  creator: { select: { username: true } },
  history: {
    include: { creator: { select: { username: true } } },
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
  history: {
    id: string;
    text: string;
    createdAt: Date;
    creator: { username: string };
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
    history: o.history.map(
      (h): OcomHistoryEntry => ({
        id: h.id,
        text: h.text,
        date: h.createdAt.toLocaleString("pt-BR"),
        user: h.creator.username,
      })
    ),
  };
}

export const ocomInclude = {
  history: {
    include: { creator: { select: { username: true } } },
    orderBy: { createdAt: "asc" as const },
  },
};

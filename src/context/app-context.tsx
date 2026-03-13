"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  AppDocument,
  Tracker,
  Model,
  Priority,
  OcomProcess,
  OcomHistoryEntry,
} from "@/lib/types";

type DocumentUpdates = Partial<
  Pick<AppDocument, "sigad" | "priority" | "subject" | "deadline" | "linkedProcess" | "trackerId">
>;

type OcomUpdates = Partial<
  Pick<
    OcomProcess,
    | "processo"
    | "categoria"
    | "desigTelegrafica"
    | "localidade"
    | "empresa"
    | "situacao"
    | "prazo"
    | "anoInicio"
    | "trackerId"
    | "observacoes"
  >
>;

type AppContextType = {
  // Documents (OCNO)
  documents: AppDocument[];
  addDocument: (doc: {
    sigad: string;
    priority: Priority;
    subject: string;
    deadline: string;
    linkedProcess: string;
    trackerId?: string;
  }) => Promise<void>;
  updateDocument: (id: string, updates: DocumentUpdates) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  finalizeDocument: (id: string) => Promise<void>;
  reactivateDocument: (id: string) => Promise<void>;
  addHistoryEntry: (docId: string, sigad: string, text: string) => Promise<void>;
  updateHistoryEntry: (docId: string, entryId: string, text: string) => Promise<void>;
  deleteHistoryEntry: (docId: string, entryId: string) => Promise<void>;
  toggleDocTrackerTask: (docId: string, taskId: string) => Promise<void>;
  // Trackers
  trackers: Tracker[];
  addTracker: (subject: string, tasks: { text: string; modelId?: string }[], modelId?: string, caixa?: string) => Promise<void>;
  updateTrackerModel: (trackerId: string, modelId: string | undefined) => Promise<void>;
  updateTrackerTaskModel: (trackerId: string, taskId: string, modelId: string | undefined) => Promise<void>;
  toggleTrackerTask: (trackerId: string, taskId: string) => Promise<void>;
  editTracker: (trackerId: string, subject: string, tasksToAdd: { text: string; modelId?: string }[], taskIdsToDelete: string[]) => Promise<void>;
  // Models
  models: Model[];
  addModel: (subject: string, content: string, caixa?: string) => Promise<void>;
  updateModel: (id: string, content: string, subject?: string) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  // OCOM
  ocomProcesses: OcomProcess[];
  addOcomProcess: (data: Omit<OcomProcess, "id" | "history" | "trackerTasks" | "trackerModelId"> & { trackerId?: string }) => Promise<void>;
  updateOcomProcess: (id: string, updates: OcomUpdates) => Promise<OcomProcess>;
  deleteOcomProcess: (id: string) => Promise<void>;
  addOcomHistoryEntry: (ocomId: string, text: string) => Promise<void>;
  updateOcomHistoryEntry: (ocomId: string, entryId: string, text: string) => Promise<void>;
  deleteOcomHistoryEntry: (ocomId: string, entryId: string) => Promise<void>;
  toggleOcomTrackerTask: (ocomId: string, taskId: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [ocomProcesses, setOcomProcesses] = useState<OcomProcess[]>([]);

  useEffect(() => {
    async function loadData() {
      const [docs, trks, mdls, ocoms] = await Promise.all([
        fetch("/api/processes").then((r) => r.json()),
        fetch("/api/trackers").then((r) => r.json()),
        fetch("/api/models").then((r) => r.json()),
        fetch("/api/ocom").then((r) => r.json()),
      ]);
      setDocuments(docs);
      setTrackers(trks);
      setModels(mdls);
      setOcomProcesses(ocoms);
    }
    loadData();
  }, []);

  // --- Documents ---

  const addDocument: AppContextType["addDocument"] = async (doc) => {
    const res = await fetch("/api/processes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    const created: AppDocument = await res.json();
    setDocuments((prev) => [created, ...prev]);
  };

  const updateDocument = async (id: string, updates: DocumentUpdates) => {
    const res = await fetch(`/api/processes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated: AppDocument = await res.json();
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const deleteDocument = async (id: string) => {
    await fetch(`/api/processes/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const finalizeDocument = async (id: string) => {
    const res = await fetch(`/api/processes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Finalizado" }),
    });
    const updated: AppDocument = await res.json();
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const reactivateDocument = async (id: string) => {
    const res = await fetch(`/api/processes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Em andamento" }),
    });
    const updated: AppDocument = await res.json();
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const addHistoryEntry = async (docId: string, sigad: string, text: string) => {
    const res = await fetch(`/api/processes/${docId}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sigad, text }),
    });
    const entry = await res.json();
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, history: [...d.history, entry] } : d))
    );
  };

  const updateHistoryEntry = async (docId: string, entryId: string, text: string) => {
    const res = await fetch(`/api/processes/${docId}/history/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const updated = await res.json();
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, history: d.history.map((h) => (h.id === entryId ? updated : h)) }
          : d
      )
    );
  };

  const deleteHistoryEntry = async (docId: string, entryId: string) => {
    await fetch(`/api/processes/${docId}/history/${entryId}`, { method: "DELETE" });
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, history: d.history.filter((h) => h.id !== entryId) } : d
      )
    );
  };

  const toggleDocTrackerTask = async (docId: string, taskId: string) => {
    const res = await fetch(`/api/processes/${docId}/tasks/${taskId}`, { method: "PATCH" });
    const { done } = await res.json();
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, trackerTasks: d.trackerTasks.map((t) => (t.id === taskId ? { ...t, done } : t)) }
          : d
      )
    );
  };

  // --- Trackers ---

  const addTracker = async (subject: string, tasks: { text: string; modelId?: string }[], modelId?: string, caixa?: string) => {
    const res = await fetch("/api/trackers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, tasks, modelId, caixa }),
    });
    const created: Tracker = await res.json();
    setTrackers((prev) => [created, ...prev]);
  };

  const updateTrackerModel = async (trackerId: string, modelId: string | undefined) => {
    const res = await fetch(`/api/trackers/${trackerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelId: modelId ?? null }),
    });
    const updated: Tracker = await res.json();
    setTrackers((prev) => prev.map((t) => (t.id === trackerId ? updated : t)));
  };

  const updateTrackerTaskModel = async (trackerId: string, taskId: string, modelId: string | undefined) => {
    const res = await fetch(`/api/trackers/${trackerId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelId: modelId ?? null }),
    });
    const updatedTask = await res.json();
    setTrackers((prev) =>
      prev.map((t) =>
        t.id === trackerId
          ? { ...t, tasks: t.tasks.map((task) => (task.id === taskId ? { ...task, modelId: updatedTask.modelId } : task)) }
          : t
      )
    );
  };

  const editTracker = async (trackerId: string, subject: string, tasksToAdd: { text: string; modelId?: string }[], taskIdsToDelete: string[]) => {
    const res = await fetch(`/api/trackers/${trackerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, tasksToAdd, taskIdsToDelete }),
    });
    const updated: Tracker = await res.json();
    setTrackers((prev) => prev.map((t) => (t.id === trackerId ? updated : t)));
  };

  const toggleTrackerTask = async (trackerId: string, taskId: string) => {
    setTrackers((prev) =>
      prev.map((t) =>
        t.id === trackerId
          ? { ...t, tasks: t.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)) }
          : t
      )
    );
  };

  // --- Models ---

  const addModel = async (subject: string, content: string, caixa?: string) => {
    const res = await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content, caixa }),
    });
    const created: Model = await res.json();
    setModels((prev) => [created, ...prev]);
  };

  const updateModel = async (id: string, content: string, subject?: string) => {
    const res = await fetch(`/api/models/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, ...(subject !== undefined && { subject }) }),
    });
    const updated: Model = await res.json();
    setModels((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const deleteModel = async (id: string) => {
    await fetch(`/api/models/${id}`, { method: "DELETE" });
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  // --- OCOM ---

  const addOcomProcess = async (data: Omit<OcomProcess, "id" | "history" | "trackerTasks" | "trackerModelId"> & { trackerId?: string }) => {
    const res = await fetch("/api/ocom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const created: OcomProcess = await res.json();
    setOcomProcesses((prev) => [created, ...prev]);
  };

  const updateOcomProcess = async (id: string, updates: OcomUpdates): Promise<OcomProcess> => {
    const res = await fetch(`/api/ocom/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated: OcomProcess = await res.json();
    setOcomProcesses((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const addOcomHistoryEntry = async (ocomId: string, text: string) => {
    const res = await fetch(`/api/ocom/${ocomId}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const entry: OcomHistoryEntry = await res.json();
    setOcomProcesses((prev) =>
      prev.map((o) => (o.id === ocomId ? { ...o, history: [...o.history, entry] } : o))
    );
  };

  const updateOcomHistoryEntry = async (ocomId: string, entryId: string, text: string) => {
    const res = await fetch(`/api/ocom/${ocomId}/history/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const updated: OcomHistoryEntry = await res.json();
    setOcomProcesses((prev) =>
      prev.map((o) =>
        o.id === ocomId
          ? { ...o, history: o.history.map((h) => (h.id === entryId ? updated : h)) }
          : o
      )
    );
  };

  const deleteOcomProcess = async (id: string) => {
    await fetch(`/api/ocom/${id}`, { method: "DELETE" });
    setOcomProcesses((prev) => prev.filter((o) => o.id !== id));
  };

  const deleteOcomHistoryEntry = async (ocomId: string, entryId: string) => {
    await fetch(`/api/ocom/${ocomId}/history/${entryId}`, { method: "DELETE" });
    setOcomProcesses((prev) =>
      prev.map((o) =>
        o.id === ocomId ? { ...o, history: o.history.filter((h) => h.id !== entryId) } : o
      )
    );
  };

  const toggleOcomTrackerTask = async (ocomId: string, taskId: string) => {
    const res = await fetch(`/api/ocom/${ocomId}/tasks/${taskId}`, { method: "PATCH" });
    const { done } = await res.json();
    setOcomProcesses((prev) =>
      prev.map((o) =>
        o.id === ocomId
          ? { ...o, trackerTasks: o.trackerTasks.map((t) => (t.id === taskId ? { ...t, done } : t)) }
          : o
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        finalizeDocument,
        reactivateDocument,
        addHistoryEntry,
        updateHistoryEntry,
        deleteHistoryEntry,
        toggleDocTrackerTask,
        trackers,
        addTracker,
        updateTrackerModel,
        updateTrackerTaskModel,
        toggleTrackerTask,
        editTracker,
        models,
        addModel,
        updateModel,
        deleteModel,
        ocomProcesses,
        addOcomProcess,
        updateOcomProcess,
        deleteOcomProcess,
        addOcomHistoryEntry,
        updateOcomHistoryEntry,
        deleteOcomHistoryEntry,
        toggleOcomTrackerTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

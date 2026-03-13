export type Priority = "Normal" | "Alta";
export type DocumentStatus = "Em andamento" | "Finalizado";

export type HistoryEntry = {
  id: string;
  date: string;
  user: string;
  sigad: string;
  text: string;
};

export type TrackerTask = {
  id: string;
  text: string;
  done: boolean;
  modelId?: string;
};

export type AppDocument = {
  id: string;
  sigad: string;
  priority: Priority;
  subject: string;
  beginning: string;
  user: string;
  status: DocumentStatus;
  lastUpdate: string;
  deadline: string;
  history: HistoryEntry[];
  trackerTasks: TrackerTask[];
  linkedProcess: string;
  trackerId?: string;
  trackerModelId?: string;
};

export type Tracker = {
  id: string;
  subject: string;
  tasks: TrackerTask[];
  modelId?: string;
  updatedAt: string;
  caixa: string;
};

export type Model = {
  id: string;
  subject: string;
  content: string;
  updatedAt: string;
  caixa: string;
};

export type OcomCategoria = "EPTA A" | "EPTA ESPECIAL" | "ETEX" | "EQI" | "OUTROS";
export type OcomSituacao = "ARQUIVADO" | "CONCLUÍDO" | "EM ANDAMENTO" | "OUTROS";

export type OcomHistoryEntry = {
  id: string;
  date: string;
  user: string;
  text: string;
};

export type OcomProcess = {
  id: string;
  processo: string;
  categoria: string;
  desigTelegrafica: string;
  localidade: string;
  empresa: string;
  situacao: OcomSituacao;
  prazo: string; // DD/MM/YYYY or ""
  anoInicio: number;
  history: OcomHistoryEntry[];
  trackerId?: string;
  trackerModelId?: string;
  trackerTasks: TrackerTask[];
  observacoes?: string;
};

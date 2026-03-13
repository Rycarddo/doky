"use client";

import { useState } from "react";
import {
  Expand,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  ClipboardCopy,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CheckboxTracker } from "./CheckboxTracker";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { LinkProcess } from "./LinkProcess";
import { Deadline } from "./Deadline";
import { useAppContext } from "@/context/app-context";
import type { AppDocument, HistoryEntry, Model } from "@/lib/types";

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) return undefined;
  return new Date(year, month - 1, day);
}

// Read-only model viewer dialog (similar to the Modelos page dialog)
function ModelViewDialog({ model }: { model: Model }) {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(model.content);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <FileText className="size-3" />
          Ver modelo: {model.subject}
        </button>
      </DialogTrigger>
      <DialogContent style={{ width: "50vw" }}>
        <DialogTitle>{model.subject}</DialogTitle>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={handleCopy}
            >
              <ClipboardCopy className="size-3.5" />
              Copiar
            </Button>
          </div>
          <Textarea
            className="w-full min-h-80 resize-y bg-muted/30"
            value={model.content}
            readOnly
            style={{ height: "50vh" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type EditProcessProps = {
  document: AppDocument;
};

export const EditProcess = ({ document }: EditProcessProps) => {
  const {
    updateDocument,
    deleteDocument,
    finalizeDocument,
    reactivateDocument,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    toggleDocTrackerTask,
    models,
  } = useAppContext();

  const [open, setOpen] = useState(false);

  // History table state
  const [histText, setHistText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Config. Iniciais state
  const [sigad, setSigad] = useState(document.sigad);
  const [priority, setPriority] = useState(
    document.priority === "Alta" ? "alta" : "normal",
  );
  const [subject, setSubject] = useState(document.subject);
  const [deadline, setDeadline] = useState<Date | undefined>(
    parseDate(document.deadline),
  );
  const [trackerId, setTrackerId] = useState(document.trackerId ?? "");

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setSigad(document.sigad);
      setPriority(document.priority === "Alta" ? "alta" : "normal");
      setSubject(document.subject);
      setDeadline(parseDate(document.deadline));
      setTrackerId(document.trackerId ?? "");
    }
    setOpen(next);
  };

  const handleInsertHistory = () => {
    if (!histText.trim()) return;
    addHistoryEntry(document.id, document.sigad, histText.trim());
    setHistText("");
  };

  const startEdit = (entry: HistoryEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      updateHistoryEntry(document.id, editingId, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveConfig = () => {
    updateDocument(document.id, {
      sigad,
      priority: priority === "alta" ? "Alta" : "Normal",
      subject,
      deadline: deadline
        ? deadline.toLocaleDateString("pt-BR")
        : document.deadline,
      trackerId,
    });
  };

  // Tracker-level model reference
  const trackerModel = document.trackerModelId
    ? models.find((m) => m.id === document.trackerModelId)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Expand className="size-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl"
        style={{
          width: "min(90vw, 56rem)",
          maxHeight: "90vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <DialogTitle className="leading-snug">
          ASSUNTO:{" "}
          <span className="text-base font-semibold">{document.subject}</span>
          <br />
          <span className="block text-xs font-normal text-muted-foreground mt-2 font-mono">
            ORIGINADOR: {document.sigad}
          </span>
        </DialogTitle>

        <Tabs defaultValue="atualizacao">
          <TabsList>
            <TabsTrigger value="atualizacao">Atualização</TabsTrigger>
            <TabsTrigger value="config">Config. Iniciais</TabsTrigger>
          </TabsList>

          {/* Atualização tab */}
          <TabsContent value="atualizacao" className="flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <Label className="flex flex-col w-full">
                Inserir atualização
                <Input
                  placeholder="Ex: Feito o documento para publicação em boletim"
                  value={histText}
                  onChange={(e) => setHistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInsertHistory();
                  }}
                />
              </Label>
              <Button onClick={handleInsertHistory}>Inserir</Button>
            </div>

            <Separator />

            <div className="w-full [&>div]:overflow-x-hidden">
              <Table
                className="[&_th]:px-3 [&_td]:px-3 [&_th]:text-center [&_td]:text-center"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "10rem" }}>Data</TableHead>
                    <TableHead style={{ width: "7rem" }}>Usuário</TableHead>
                    <TableHead>Texto</TableHead>
                    <TableHead style={{ width: "4rem" }}>Editar</TableHead>
                    <TableHead style={{ width: "4rem" }}>Deletar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.history.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum histórico registrado.
                      </TableCell>
                    </TableRow>
                  )}
                  {document.history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {entry.date}
                      </TableCell>
                      <TableCell className="text-sm">{entry.user}</TableCell>
                      <TableCell className="break-all whitespace-normal overflow-hidden text-sm">
                        {editingId === entry.id ? (
                          <textarea
                            className="w-full text-sm border rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit();
                              }
                              if (e.key === "Escape") cancelEdit();
                            }}
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm break-all">
                            {entry.text}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === entry.id ? (
                          <div className="flex gap-1">
                            <Check
                              className="cursor-pointer text-green-600 size-4"
                              onClick={saveEdit}
                            />
                            <X
                              className="cursor-pointer text-red-600 size-4"
                              onClick={cancelEdit}
                            />
                          </div>
                        ) : (
                          <Edit
                            className="cursor-pointer size-4"
                            onClick={() => startEdit(entry)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Trash2 className="cursor-pointer size-4" />
                          </DialogTrigger>
                          <DialogContent
                            style={{ width: "20rem" }}
                            className="max-w-xs"
                          >
                            <DialogTitle>Excluir entrada</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                              Tem certeza que deseja excluir esta entrada do
                              histórico? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex justify-end gap-2 mt-2">
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Cancelar
                                </Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    deleteHistoryEntry(document.id, entry.id)
                                  }
                                >
                                  Excluir
                                </Button>
                              </DialogTrigger>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator />

            <p className="text-sm font-medium">Tracker</p>

            {/* Tracker-level model reference */}
            {trackerModel && (
              <div className="mb-1">
                <ModelViewDialog model={trackerModel} />
              </div>
            )}

            <div className="flex flex-col gap-3">
              {document.trackerTasks.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Nenhuma tarefa cadastrada.
                </p>
              )}
              {document.trackerTasks.map((task) => {
                const model = task.modelId
                  ? models.find((m) => m.id === task.modelId)
                  : null;

                return (
                  <div key={task.id} className="flex flex-col gap-1">
                    <CheckboxTracker
                      id={task.id}
                      text={task.text}
                      checked={task.done}
                      onCheckedChange={() =>
                        toggleDocTrackerTask(document.id, task.id)
                      }
                    />
                    {model && (
                      <div className="ml-4">
                        <ModelViewDialog model={model} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-2">
              {document.status === "Finalizado" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    reactivateDocument(document.id);
                    setOpen(false);
                  }}
                >
                  Reativar processo
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    finalizeDocument(document.id);
                    setOpen(false);
                  }}
                >
                  Finalizar processo
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Config. Iniciais tab */}
          <TabsContent value="config">
            <div className="flex flex-col gap-4 py-1">
              <Label className="w-full">
                SIGAD (originador)*
                <Input
                  required
                  placeholder="Ex: 1113939"
                  value={sigad}
                  onChange={(e) => setSigad(e.target.value)}
                />
              </Label>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecione a prioridade..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Prioridade</SelectLabel>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Label className="flex-1">
                  Assunto*
                  <Input
                    required
                    placeholder="Ex: Modelo Operacional RDO SBHT"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Label>
              </div>

              <Deadline date={deadline} onDateChange={setDeadline} />
              <LinkProcess value={trackerId} onChange={setTrackerId} />

              <div className="flex justify-between items-center mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Excluir processo
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    style={{ width: "22rem" }}
                    className="max-w-sm"
                  >
                    <DialogTitle>Excluir processo</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Tem certeza que deseja excluir este processo? Esta ação
                      não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Cancelar
                        </Button>
                      </DialogTrigger>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          deleteDocument(document.id);
                          setOpen(false);
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={handleSaveConfig}
                  disabled={!sigad.trim() || !subject.trim()}
                >
                  Salvar alterações
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

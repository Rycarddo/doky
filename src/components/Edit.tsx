"use client";

import { useState } from "react";
import { Expand, FileText } from "lucide-react";
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
import { ProcessHistoryTable } from "./ProcessHistoryTable";
import { LinkProcess } from "./LinkProcess";
import { Deadline } from "./Deadline";
import { useAppContext } from "@/context/app-context";
import type { AppDocument } from "@/lib/types";

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) return undefined;
  return new Date(year, month - 1, day);
}

type EditProcessProps = {
  document: AppDocument;
};

export const EditProcess = ({ document }: EditProcessProps) => {
  const {
    updateDocument,
    finalizeDocument,
    reactivateDocument,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    toggleDocTrackerTask,
    models,
  } = useAppContext();

  const [open, setOpen] = useState(false);
  const [expandedTaskModels, setExpandedTaskModels] = useState<Record<string, boolean>>({});

  // Config. Iniciais form state
  const [sigad, setSigad] = useState(document.sigad);
  const [priority, setPriority] = useState(
    document.priority === "Alta" ? "alta" : "normal"
  );
  const [subject, setSubject] = useState(document.subject);
  const [deadline, setDeadline] = useState<Date | undefined>(
    parseDate(document.deadline)
  );
  const [linkedProcess, setLinkedProcess] = useState(document.linkedProcess);

  // Atualização form state
  const [histText, setHistText] = useState("");

  const handleSaveConfig = () => {
    updateDocument(document.id, {
      sigad,
      priority: priority === "alta" ? "Alta" : "Normal",
      subject,
      deadline: deadline ? deadline.toLocaleDateString("pt-BR") : document.deadline,
      linkedProcess,
    });
  };

  const handleInsertHistory = () => {
    if (!histText.trim()) return;
    addHistoryEntry(document.id, document.sigad, histText.trim());
    setHistText("");
  };

  const handleFinalize = () => {
    finalizeDocument(document.id);
    setOpen(false);
  };

  const handleReactivate = () => {
    reactivateDocument(document.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Expand className="size-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <Tabs defaultValue="update">
            <TabsList>
              <TabsTrigger value="update">Atualização</TabsTrigger>
              <TabsTrigger value="initialConfigs">Config. Iniciais</TabsTrigger>
            </TabsList>
            <TabsContent value="update">
              <DialogTitle className="mt-4">Inserir atualização</DialogTitle>
              <div className="flex mt-6 items-end gap-2">
                <Label className="flex flex-col w-full">
                  Texto
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

              <Separator className="my-6" />

              <DialogTitle>Histórico</DialogTitle>
              <ProcessHistoryTable
                history={document.history}
                onEdit={(entryId, text) =>
                  updateHistoryEntry(document.id, entryId, text)
                }
                onDelete={(entryId) =>
                  deleteHistoryEntry(document.id, entryId)
                }
              />

              <Separator className="my-6" />

              <DialogTitle>Tracker</DialogTitle>

              <div className="flex flex-col gap-3 mt-4">
                {document.trackerTasks.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma tarefa cadastrada.
                  </p>
                )}
                {document.trackerTasks.map((task) => {
                  const model = task.modelId
                    ? models.find((m) => m.id === task.modelId)
                    : null;
                  const isExpanded = expandedTaskModels[task.id] ?? false;

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
                        <div className="ml-1">
                          <button
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              setExpandedTaskModels((prev) => ({
                                ...prev,
                                [task.id]: !prev[task.id],
                              }))
                            }
                          >
                            <FileText className="size-3" />
                            {isExpanded ? "Ocultar modelo" : `Ver modelo: ${model.subject}`}
                          </button>
                          {isExpanded && (
                            <Textarea
                              className="mt-1 w-full resize-y bg-muted/30 text-sm"
                              style={{ height: "20vh" }}
                              value={model.content}
                              readOnly
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                {document.status === "Finalizado" ? (
                  <Button variant="outline" onClick={handleReactivate}>
                    Reativar processo
                  </Button>
                ) : (
                  <Button onClick={handleFinalize}>
                    Finalizar processo
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="initialConfigs">
              <DialogTitle className="my-4">Configurações Iniciais</DialogTitle>

              <Separator />
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mt-4">
                  <Label className="w-full">
                    SIGAD(originador)*:
                    <Input
                      required
                      placeholder="Ex: 1113939"
                      value={sigad}
                      onChange={(e) => setSigad(e.target.value)}
                    />
                  </Label>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Label>Prioridade:</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
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
                <div className="flex items-center gap-4 mt-4">
                  <Label className="w-full">
                    Assunto*:
                    <Input
                      required
                      placeholder="Ex: Modelo Operacional RDO SBHT"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </Label>
                </div>

                <Deadline date={deadline} onDateChange={setDeadline} />
                <LinkProcess
                  value={linkedProcess}
                  onChange={setLinkedProcess}
                />

                <div className="flex justify-end mt-6">
                  <Button className="rounded-full" onClick={handleSaveConfig}>
                    Salvar
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

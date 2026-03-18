"use client";

import { useState } from "react";
import { Expand, Edit, Trash2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
import { CheckboxTracker } from "./CheckboxTracker";
import { useAppContext } from "@/context/app-context";
import { LinkProcess } from "./LinkProcess";
import type { OcomProcess, OcomHistoryEntry, OcomSituacao } from "@/lib/types";

const CATEGORIAS = ["EPTA A", "EPTA ESPECIAL", "ETEX", "EQI", "OUTROS"] as const;
const SITUACOES: OcomSituacao[] = ["EM ANDAMENTO", "CONCLUÍDO", "ARQUIVADO", "OUTROS"];
const ESTADOS_DOC = ["Minuta", "Assinado", "Expedido", "Publicado"] as const;

// Convert DD/MM/YYYY to YYYY-MM-DD for <input type="date">
function ptBRToInputDate(ptBR: string): string {
  if (!ptBR) return "";
  const [d, m, y] = ptBR.split("/");
  return `${y}-${m}-${d}`;
}

type OcomDialogProps = {
  ocom: OcomProcess;
};

export const OcomDialog = ({ ocom }: OcomDialogProps) => {
  const {
    addOcomHistoryEntry,
    updateOcomHistoryEntry,
    deleteOcomHistoryEntry,
    updateOcomProcess,
    deleteOcomProcess,
    toggleOcomTrackerTask,
    models,
  } = useAppContext();

  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [histText, setHistText] = useState("");
  const [histEstadoDoc, setHistEstadoDoc] = useState<string>("Minuta");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editEstadoDoc, setEditEstadoDoc] = useState<string>("Minuta");

  // Tracker state
  const [trackerId, setTrackerId] = useState(ocom.trackerId ?? "");
  const [savedTrackerId, setSavedTrackerId] = useState(ocom.trackerId ?? "");
  const [trackerTasks, setTrackerTasks] = useState(ocom.trackerTasks);

  // Config. Iniciais state — synced when dialog opens via key
  const [processo, setProcesso] = useState(ocom.processo);
  const [categoria, setCategoria] = useState(ocom.categoria);
  const [desigTelegrafica, setDesigTelegrafica] = useState(ocom.desigTelegrafica);
  const [localidade, setLocalidade] = useState(ocom.localidade);
  const [empresa, setEmpresa] = useState(ocom.empresa);
  const [situacao, setSituacao] = useState<OcomSituacao>(ocom.situacao);
  const [prazo, setPrazo] = useState(ptBRToInputDate(ocom.prazo));
  const [anoInicio, setAnoInicio] = useState(ocom.anoInicio.toString());

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Sync form state with latest ocom data
      setTrackerId(ocom.trackerId ?? "");
      setSavedTrackerId(ocom.trackerId ?? "");
      setTrackerTasks(ocom.trackerTasks);
      setProcesso(ocom.processo);
      setCategoria(ocom.categoria);
      setDesigTelegrafica(ocom.desigTelegrafica);
      setLocalidade(ocom.localidade);
      setEmpresa(ocom.empresa);
      setSituacao(ocom.situacao);
      setPrazo(ptBRToInputDate(ocom.prazo));
      setAnoInicio(ocom.anoInicio.toString());
    }
    setOpen(next);
  };

  const handleInsertHistory = () => {
    if (!histText.trim()) return;
    addOcomHistoryEntry(ocom.id, histText.trim(), histEstadoDoc);
    setHistText("");
    setHistEstadoDoc("Minuta");
  };

  const startEdit = (entry: OcomHistoryEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
    setEditEstadoDoc(entry.estadoDoc);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      updateOcomHistoryEntry(ocom.id, editingId, editText.trim(), editEstadoDoc);
    }
    setEditingId(null);
    setEditText("");
    setEditEstadoDoc("Minuta");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditEstadoDoc("Minuta");
  };

  const handleChangeTracker = async (newTrackerId: string) => {
    setTrackerId(newTrackerId);
    const updated = await updateOcomProcess(ocom.id, { trackerId: newTrackerId });
    setSavedTrackerId(newTrackerId);
    setTrackerTasks(updated.trackerTasks);
  };

  const handleSaveConfig = () => {
    updateOcomProcess(ocom.id, {
      processo: processo.trim(),
      categoria,
      desigTelegrafica: desigTelegrafica.trim(),
      localidade: localidade.trim(),
      empresa: empresa.trim(),
      situacao,
      prazo, // YYYY-MM-DD, API converts
      anoInicio: Number(anoInicio),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Expand className="size-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl"
        style={{ width: "min(90vw, 56rem)", maxHeight: "90vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <DialogTitle className="text-base font-semibold leading-snug">
          {ocom.processo}
        </DialogTitle>

        <Tabs defaultValue="historico">
          <TabsList>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="config">Config. Iniciais</TabsTrigger>
            <TabsTrigger value="changelog">Histórico Alterações</TabsTrigger>
          </TabsList>

          {/* Histórico tab */}
          <TabsContent value="historico" className="flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <Label className="flex flex-col w-full">
                Inserir atualização
                <Input
                  placeholder="Ex: Processo encaminhado para análise..."
                  value={histText}
                  onChange={(e) => setHistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInsertHistory();
                  }}
                />
              </Label>
              <div className="flex flex-col gap-1">
                <Label>Estado Doc.</Label>
                <Select value={histEstadoDoc} onValueChange={setHistEstadoDoc}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ESTADOS_DOC.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInsertHistory}>Inserir</Button>
            </div>

            <Separator />

            <div className="w-full [&>div]:overflow-x-hidden">
            <Table className="[&_th]:px-3 [&_td]:px-3 [&_th]:text-center [&_td]:text-center" style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "10rem" }}>Data</TableHead>
                    <TableHead style={{ width: "7rem" }}>Usuário</TableHead>
                    <TableHead>Texto</TableHead>
                    <TableHead style={{ width: "8rem" }}>Estado Doc.</TableHead>
                    <TableHead style={{ width: "4rem" }}>Editar</TableHead>
                    <TableHead style={{ width: "4rem" }}>Deletar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ocom.history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum histórico registrado.
                      </TableCell>
                    </TableRow>
                  )}
                  {ocom.history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap text-sm">{entry.date}</TableCell>
                      <TableCell className="text-sm">{entry.user}</TableCell>
                      <TableCell className="break-all whitespace-normal overflow-hidden text-sm">
                        {editingId === entry.id ? (
                          <textarea
                            className="w-full text-sm border rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                              if (e.key === "Escape") cancelEdit();
                            }}
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm break-all">{entry.text}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === entry.id ? (
                          <Select value={editEstadoDoc} onValueChange={setEditEstadoDoc}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {ESTADOS_DOC.map((e) => (
                                  <SelectItem key={e} value={e}>{e}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{entry.estadoDoc}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === entry.id ? (
                          <div className="flex gap-1">
                            <Check className="cursor-pointer text-green-600 size-4" onClick={saveEdit} />
                            <X className="cursor-pointer text-red-600 size-4" onClick={cancelEdit} />
                          </div>
                        ) : (
                          <Edit className="cursor-pointer size-4" onClick={() => startEdit(entry)} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Trash2 className="cursor-pointer size-4" />
                          </DialogTrigger>
                          <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                            <DialogTitle>Excluir entrada</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                              Tem certeza que deseja excluir esta entrada do histórico? Esta ação não pode ser desfeita.
                            </p>
                            <div className="flex justify-end gap-2 mt-2">
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">Cancelar</Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => deleteOcomHistoryEntry(ocom.id, entry.id)}>
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
          </TabsContent>

          {/* Tracker tab */}
          <TabsContent value="tracker" className="flex flex-col gap-4 py-2">
            <LinkProcess value={trackerId} onChange={handleChangeTracker} caixa="OCOM" />

            <Separator />

            {/* Tracker tasks */}
            {trackerTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {savedTrackerId
                  ? "Nenhuma tarefa cadastrada neste tracker."
                  : "Nenhum tracker vinculado."}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {trackerTasks.map((task) => {
                  const model = task.modelId ? models.find((m) => m.id === task.modelId) : null;
                  return (
                    <div key={task.id} className="flex flex-col gap-1">
                      <CheckboxTracker
                        id={task.id}
                        text={task.text}
                        checked={task.done}
                        onCheckedChange={async () => {
                          await toggleOcomTrackerTask(ocom.id, task.id);
                          setTrackerTasks((prev) =>
                            prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
                          );
                        }}
                      />
                      {model && (
                        <span className="ml-4 text-xs text-muted-foreground">{model.subject}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Config. Iniciais tab */}
          <TabsContent value="config">
            <div className="flex flex-col gap-4 py-1">
              <Label className="w-full">
                Processo
                <Input value={processo} onChange={(e) => setProcesso(e.target.value)} />
              </Label>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Categoria</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CATEGORIAS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Label className="flex-1">
                  Desig. Telegráfica
                  <Input value={desigTelegrafica} onChange={(e) => setDesigTelegrafica(e.target.value)} />
                </Label>
              </div>

              <div className="flex gap-3">
                <Label className="flex-1">
                  Localidade
                  <Input value={localidade} onChange={(e) => setLocalidade(e.target.value)} />
                </Label>
                <Label className="flex-1">
                  Empresa
                  <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
                </Label>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Situação</Label>
                  <Select value={situacao} onValueChange={(v) => setSituacao(v as OcomSituacao)}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SITUACOES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Label className="w-36">
                  Prazo
                  <Input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
                </Label>
                <Label className="w-24">
                  Ano Início
                  <Input
                    type="number"
                    value={anoInicio}
                    onChange={(e) => setAnoInicio(e.target.value)}
                    min={2000}
                    max={2100}
                  />
                </Label>
              </div>

              <div className="flex justify-between mt-2">
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tem certeza?</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        deleteOcomProcess(ocom.id);
                        setOpen(false);
                      }}
                    >
                      Confirmar exclusão
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                    Excluir processo
                  </Button>
                )}
                <Button onClick={handleSaveConfig} disabled={!processo.trim() || !categoria}>
                  Salvar alterações
                </Button>
              </div>
            </div>
          </TabsContent>
          {/* Histórico Alterações tab */}
          <TabsContent value="changelog">
            <div className="w-full [&>div]:overflow-x-hidden">
              <Table className="[&_th]:px-3 [&_td]:px-3 [&_th]:text-center [&_td]:text-center" style={{ tableLayout: "fixed", width: "100%" }}>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "10rem" }}>Data/Hora</TableHead>
                    <TableHead style={{ width: "7rem" }}>Usuário</TableHead>
                    <TableHead style={{ width: "10rem" }}>Ação</TableHead>
                    <TableHead style={{ width: "7rem" }}>Campo</TableHead>
                    <TableHead>Valor Anterior</TableHead>
                    <TableHead>Novo Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ocom.changeLog.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhuma alteração registrada.
                      </TableCell>
                    </TableRow>
                  )}
                  {ocom.changeLog.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap text-sm">{entry.date}</TableCell>
                      <TableCell className="text-sm">{entry.user}</TableCell>
                      <TableCell className="text-sm">{entry.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.field ?? "—"}</TableCell>
                      <TableCell className="break-all whitespace-normal text-sm text-muted-foreground">{entry.oldValue ?? "—"}</TableCell>
                      <TableCell className="break-all whitespace-normal text-sm">{entry.newValue ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

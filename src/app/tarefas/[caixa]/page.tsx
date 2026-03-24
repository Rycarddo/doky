"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScheduledAtPicker } from "@/components/ScheduledAtPicker";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CAIXA_ENUM: Record<string, string> = {
  ocno: "OCNO",
  ocom: "OCOM",
  "civa-az": "CIVA_AZ",
};

type TaskUser = { id: string; name: string };
type TaskProcess = { id: string; sigad: string; subject: string } | null;

type Task = {
  id: string;
  text: string;
  done: boolean;
  priority: "HIGH" | "NORMAL";
  deadline: string | null;
  scheduledAt: string | null;
  responsible: TaskUser;
  creator: TaskUser;
  process: TaskProcess;
  createdAt: string;
};

const PRIORITY_LABEL: Record<string, string> = { HIGH: "Alta", NORMAL: "Normal" };

function formatDeadline(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function toInputDate(iso: string | null): string {
  if (!iso) return "";
  return iso.split("T")[0];
}

export default function TarefasCaixaPage() {
  const params = useParams();
  const slug = (params.caixa as string) ?? "";
  const caixaEnum = CAIXA_ENUM[slug] ?? "OCNO";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<TaskUser[]>([]);
  const [processes, setProcesses] = useState<{ id: string; subject: string }[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "done">("pending");
  const [filterPriority, setFilterPriority] = useState<"all" | "HIGH" | "NORMAL">("all");
  const [filterResponsible, setFilterResponsible] = useState<string>("all");

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [newPriority, setNewPriority] = useState<"Alta" | "Normal">("Normal");
  const [newDeadline, setNewDeadline] = useState("");
  const [newScheduledAt, setNewScheduledAt] = useState("");
  const [newProcessId, setNewProcessId] = useState("");

  // Edit dialog
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState<"Alta" | "Normal">("Normal");
  const [editDeadline, setEditDeadline] = useState("");
  const [editScheduledAt, setEditScheduledAt] = useState("");
  const [editProcessId, setEditProcessId] = useState("");

  useEffect(() => {
    fetch(`/api/tasks?caixa=${caixaEnum}`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setTasks(d); });
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setUsers(d); });
    fetch("/api/processes")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d))
          setProcesses(d.map((p: { id: string; subject: string }) => ({ id: p.id, subject: p.subject })));
      });
  }, [caixaEnum]);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newText.trim(),
        priority: newPriority,
        deadline: newDeadline ? new Date(newDeadline).toLocaleDateString("pt-BR") : "",
        scheduledAt: newScheduledAt || null,
        processId: newProcessId || null,
        caixa: caixaEnum,
      }),
    });
    const created = await res.json();
    setTasks((prev) => [created, ...prev]);
    setAddOpen(false);
    setNewText("");
    setNewPriority("Normal");
    setNewDeadline("");
    setNewScheduledAt("");
    setNewProcessId("");
  };

  const handleToggleDone = async (task: Task) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditText(task.text);
    setEditPriority(task.priority === "HIGH" ? "Alta" : "Normal");
    setEditDeadline(toInputDate(task.deadline));
    setEditScheduledAt(task.scheduledAt ? task.scheduledAt.slice(0, 16) : "");
    setEditProcessId(task.process?.id ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editTask || !editText.trim()) return;
    const res = await fetch(`/api/tasks/${editTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: editText.trim(),
        priority: editPriority,
        deadline: editDeadline ? new Date(editDeadline).toLocaleDateString("pt-BR") : "",
        scheduledAt: editScheduledAt || null,
        processId: editProcessId || null,
      }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditTask(null);
  };

  const filtered = tasks.filter((t) => {
    if (filterStatus === "pending" && t.done) return false;
    if (filterStatus === "done" && !t.done) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterResponsible !== "all" && t.responsible.id !== filterResponsible) return false;
    if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Tarefas</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 rounded-full">
              <Plus className="size-4" />
              Nova tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle>Nova tarefa</DialogTitle>
            <div className="flex flex-col gap-4 mt-2">
              <Label>
                Tarefa
                <Input
                  placeholder="Descreva a tarefa..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  autoFocus
                />
              </Label>
              <div>
                <Label className="my-2">Prioridade</Label>
                <Select value={newPriority} onValueChange={(v) => setNewPriority(v as "Alta" | "Normal")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Label>
                Prazo
                <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
              </Label>
              <ScheduledAtPicker value={newScheduledAt} onChange={setNewScheduledAt} />
              <div>
                <Label className="my-2">Processo vinculado (opcional)</Label>
                <Select
                  value={newProcessId || "__none__"}
                  onValueChange={(v) => setNewProcessId(v === "__none__" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="__none__">Nenhum</SelectItem>
                      {processes.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.subject}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Cancelar</Button>
                </DialogTrigger>
                <Button size="sm" onClick={handleAdd} disabled={!newText.trim()}>
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <Input
          className="w-52 h-8 text-sm rounded-full"
          placeholder="Buscar tarefa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          {(["all", "pending", "done"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
              className="h-8 text-xs rounded-full"
              onClick={() => setFilterStatus(s)}
            >
              {s === "all" ? "Todas" : s === "pending" ? "Pendentes" : "Concluídas"}
            </Button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["all", "HIGH", "NORMAL"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={filterPriority === p ? "default" : "outline"}
              className="h-8 text-xs rounded-full"
              onClick={() => setFilterPriority(p)}
            >
              {p === "all" ? "Qualquer prioridade" : p === "HIGH" ? "Alta" : "Normal"}
            </Button>
          ))}
        </div>
        <Select value={filterResponsible} onValueChange={setFilterResponsible}>
          <SelectTrigger className="h-8 w-44 text-xs rounded-full">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2 my-4">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">
            Nenhuma tarefa encontrada.
          </p>
        )}
        {filtered.map((task) => (
          <div key={task.id} className="flex items-start gap-3 rounded-lg border px-4 py-3 bg-card">
            <Checkbox checked={task.done} onCheckedChange={() => handleToggleDone(task)} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-snug ${task.done ? "line-through text-muted-foreground" : ""}`}>
                {task.text}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant={task.priority === "HIGH" ? "destructive" : "secondary"} className="text-xs">
                  {PRIORITY_LABEL[task.priority]}
                </Badge>
                <span className="text-xs text-muted-foreground">{task.responsible.name}</span>
                {task.deadline && (
                  <span className="text-xs text-muted-foreground">
                    Prazo: {formatDeadline(task.deadline)}
                  </span>
                )}
                {task.scheduledAt && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    ⏰ {new Date(task.scheduledAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
                {task.process && (
                  <span className="text-xs text-muted-foreground">
                    Processo: {task.process.subject}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Dialog open={editTask?.id === task.id} onOpenChange={(open) => { if (!open) setEditTask(null); }}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(task)}>
                    <Pencil className="size-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogTitle>Editar tarefa</DialogTitle>
                  <div className="flex flex-col gap-4 mt-2">
                    <Label>
                      Tarefa
                      <Input value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                    </Label>
                    <div>
                      <Label>Prioridade</Label>
                      <Select value={editPriority} onValueChange={(v) => setEditPriority(v as "Alta" | "Normal")}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <Label>
                      Prazo
                      <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                    </Label>
                    <ScheduledAtPicker value={editScheduledAt} onChange={setEditScheduledAt} />
                    <div>
                      <Label>Processo vinculado (opcional)</Label>
                      <Select
                        value={editProcessId || "__none__"}
                        onValueChange={(v) => setEditProcessId(v === "__none__" ? "" : v)}
                      >
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="__none__">Nenhum</SelectItem>
                            {processes.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.subject}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditTask(null)}>
                        <X className="size-3.5 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit} disabled={!editText.trim()}>
                        <Check className="size-3.5 mr-1" /> Salvar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive">
                    <Trash2 className="size-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                  <DialogTitle>Excluir tarefa</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Tem certeza que deseja excluir <strong>&quot;{task.text}&quot;</strong>?
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">Cancelar</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                        Excluir
                      </Button>
                    </DialogTrigger>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

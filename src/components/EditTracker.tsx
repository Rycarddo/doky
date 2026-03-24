"use client";

import { useState } from "react";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { TrackerDialogShell } from "./ui/tracker-dialog-shell";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppContext } from "@/context/app-context";
import type { Tracker } from "@/lib/types";

type EditTrackerProps = {
  tracker: Tracker;
};

export const EditTracker = ({ tracker }: EditTrackerProps) => {
  const { editTracker, models } = useAppContext();
  const [open, setOpen] = useState(false);

  const [subject, setSubject] = useState(tracker.subject);
  const [taskInput, setTaskInput] = useState("");
  const [taskModelId, setTaskModelId] = useState<string | undefined>(undefined);
  const [tasksToAdd, setTasksToAdd] = useState<{ text: string; modelId?: string }[]>([]);
  const [taskIdsToDelete, setTaskIdsToDelete] = useState<string[]>([]);

  // Ordered list of existing task IDs (excluding deleted)
  const [orderedExistingIds, setOrderedExistingIds] = useState<string[]>(
    tracker.tasks.map((t) => t.id)
  );

  // Model overrides for existing tasks
  const [taskModelOverrides, setTaskModelOverrides] = useState<Record<string, string | null>>({});

  const visibleExistingTasks = orderedExistingIds
    .filter((id) => !taskIdsToDelete.includes(id))
    .map((id) => tracker.tasks.find((t) => t.id === id)!)
    .filter(Boolean);

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasksToAdd((prev) => [
      ...prev,
      { text: taskInput.trim(), modelId: taskModelId },
    ]);
    setTaskInput("");
    setTaskModelId(undefined);
  };

  const handleDeleteExisting = (taskId: string) => {
    setTaskIdsToDelete((prev) => [...prev, taskId]);
  };

  const handleDeleteNew = (index: number) => {
    setTasksToAdd((prev) => prev.filter((_, i) => i !== index));
  };

  const moveExisting = (index: number, direction: -1 | 1) => {
    const visibleIds = visibleExistingTasks.map((t) => t.id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= visibleIds.length) return;
    const updated = [...visibleIds];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Re-build orderedExistingIds preserving deleted ones at their positions
    setOrderedExistingIds((prev) => {
      const result = [...prev];
      const fromPos = result.indexOf(visibleIds[index]);
      const toPos = result.indexOf(visibleIds[newIndex]);
      [result[fromPos], result[toPos]] = [result[toPos], result[fromPos]];
      return result;
    });
  };

  const moveNew = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= tasksToAdd.length) return;
    setTasksToAdd((prev) => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  };

  const handleTaskModelOverride = (taskId: string, val: string) => {
    setTaskModelOverrides((prev) => ({
      ...prev,
      [taskId]: val === "none" ? null : val,
    }));
  };

  const handleSubmit = async () => {
    if (!subject.trim()) return;

    const newTaskOrder = visibleExistingTasks.map((t) => t.id);

    await editTracker(
      tracker.id,
      subject.trim(),
      tasksToAdd,
      taskIdsToDelete,
      newTaskOrder,
      taskModelOverrides,
    );
    setTasksToAdd([]);
    setTaskIdsToDelete([]);
    setTaskModelOverrides({});
    setOpen(false);
  };

  return (
    <TrackerDialogShell
      open={open}
      onOpenChange={setOpen}
      trigger={<Pencil className="size-4 cursor-pointer" />}
      title="Editar Tracker"
      width="min(95vw, 52rem)"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm">Assunto do tracker</Label>
          <Input
            className="rounded-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Digite o assunto do tracker"
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label className="text-sm">Adicionar nova tarefa</Label>
          <div className="flex items-center gap-2">
            <Input
              className="rounded-full"
              placeholder="Nome da nova tarefa"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
            />
            <Button className="rounded-full cursor-pointer" onClick={handleAddTask}>
              Adicionar
            </Button>
          </div>
          <Select
            value={taskModelId ?? "none"}
            onValueChange={(val) =>
              setTaskModelId(val === "none" ? undefined : val)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Modelo para esta tarefa (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label className="text-sm">Tarefas</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead className="w-48">Modelo</TableHead>
                <TableHead className="w-16 text-center">Ordem</TableHead>
                <TableHead className="w-4">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleExistingTasks.length === 0 && tasksToAdd.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma tarefa.
                  </TableCell>
                </TableRow>
              )}
              {visibleExistingTasks.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell className="wrap-break-word min-w-0">
                    <span>{task.text}</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={
                        task.id in taskModelOverrides
                          ? (taskModelOverrides[task.id] ?? "none")
                          : (task.modelId ?? "none")
                      }
                      onValueChange={(val) => handleTaskModelOverride(task.id, val)}
                    >
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="Nenhum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {models.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-0.5 hover:text-foreground text-muted-foreground disabled:opacity-30"
                        onClick={() => moveExisting(index, -1)}
                        disabled={index === 0}
                        type="button"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        className="p-0.5 hover:text-foreground text-muted-foreground disabled:opacity-30"
                        onClick={() => moveExisting(index, 1)}
                        disabled={index === visibleExistingTasks.length - 1}
                        type="button"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Trash2
                      className="cursor-pointer size-4 text-red-500"
                      onClick={() => handleDeleteExisting(task.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {tasksToAdd.map((task, index) => (
                <TableRow key={`new-${index}`}>
                  <TableCell className="wrap-break-word min-w-0">
                    <span className="text-muted-foreground italic">{task.text} (nova)</span>
                    {task.modelId && (
                      <span className="block text-xs text-muted-foreground">
                        Modelo: {models.find((m) => m.id === task.modelId)?.subject}
                      </span>
                    )}
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-0.5 hover:text-foreground text-muted-foreground disabled:opacity-30"
                        onClick={() => moveNew(index, -1)}
                        disabled={index === 0}
                        type="button"
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        className="p-0.5 hover:text-foreground text-muted-foreground disabled:opacity-30"
                        onClick={() => moveNew(index, 1)}
                        disabled={index === tasksToAdd.length - 1}
                        type="button"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Trash2
                      className="cursor-pointer size-4"
                      onClick={() => handleDeleteNew(index)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button className="rounded-full cursor-pointer" onClick={handleSubmit}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </TrackerDialogShell>
  );
};

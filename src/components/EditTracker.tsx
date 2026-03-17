"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

  const visibleExistingTasks = tracker.tasks.filter(
    (t) => !taskIdsToDelete.includes(t.id)
  );

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

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    await editTracker(tracker.id, subject.trim(), tasksToAdd, taskIdsToDelete);
    setTasksToAdd([]);
    setTaskIdsToDelete([]);
    setOpen(false);
  };

  return (
    <TrackerDialogShell
      open={open}
      onOpenChange={setOpen}
      trigger={<Pencil className="size-4 cursor-pointer" />}
      title="Editar Tracker"
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
                <TableHead className="w-4">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleExistingTasks.length === 0 && tasksToAdd.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Nenhuma tarefa.
                  </TableCell>
                </TableRow>
              )}
              {visibleExistingTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span>{task.text}</span>
                      {task.modelId && (
                        <span className="text-xs text-muted-foreground">
                          Modelo: {models.find((m) => m.id === task.modelId)?.subject}
                        </span>
                      )}
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
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground italic">{task.text} (nova)</span>
                      {task.modelId && (
                        <span className="text-xs text-muted-foreground">
                          Modelo: {models.find((m) => m.id === task.modelId)?.subject}
                        </span>
                      )}
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

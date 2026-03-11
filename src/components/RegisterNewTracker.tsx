"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppContext } from "@/context/app-context";

export const RegisterNewTracker = () => {
  const { addTracker, models } = useAppContext();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [taskModelId, setTaskModelId] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<{ text: string; modelId?: string }[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks((prev) => [...prev, { text: taskInput.trim(), modelId: taskModelId }]);
    setTaskInput("");
    setTaskModelId(undefined);
  };

  const handleDeleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!subject.trim()) return;
    addTracker(subject.trim(), tasks, selectedModelId);
    setSubject("");
    setTasks([]);
    setTaskInput("");
    setTaskModelId(undefined);
    setSelectedModelId(undefined);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
            Cadastrar novo Tracker
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar novo Tracker</DialogTitle>
          </DialogHeader>

          <Separator />

          <Label className="text-sm">Assunto do tracker</Label>
          <div className="flex items-center gap-2 my-2">
            <Input
              className="w-100 rounded-full"
              placeholder="Digite aqui o assunto do tracker"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <Separator />

          <Label className="text-sm">Modelo referenciado</Label>
          <div className="my-2">
            <Select
              value={selectedModelId ?? "none"}
              onValueChange={(val) =>
                setSelectedModelId(val === "none" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um modelo (opcional)" />
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

          <Label className="text-sm">Inserir tarefa</Label>

          <div className="flex flex-col gap-2 my-2">
            <div className="flex items-center gap-2">
              <Input
                className="w-100 rounded-full"
                placeholder="Digite aqui o nome da tarefa a ser adicionada"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                }}
              />
              <Button
                className="rounded-full cursor-pointer"
                onClick={handleAddTask}
              >
                Adicionar tarefa
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead className="w-4">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    Nenhuma tarefa adicionada.
                  </TableCell>
                </TableRow>
              )}
              {tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
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
                      className="cursor-pointer size-4"
                      onClick={() => handleDeleteTask(index)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Button
              className="w-fit rounded-full cursor-pointer"
              onClick={handleSubmit}
            >
              Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

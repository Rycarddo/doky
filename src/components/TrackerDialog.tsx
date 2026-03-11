"use client";

import { useState } from "react";
import { Expand, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CheckboxTracker } from "./CheckboxTracker";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppContext } from "@/context/app-context";
import type { Tracker } from "@/lib/types";

type TrackerDialogProps = {
  tracker: Tracker;
};

export const TrackerDialog = ({ tracker }: TrackerDialogProps) => {
  const { toggleTrackerTask, updateTrackerModel, updateTrackerTaskModel, models } = useAppContext();
  const [modelExpanded, setModelExpanded] = useState(false);
  const [expandedTaskModels, setExpandedTaskModels] = useState<Record<string, boolean>>({});

  const toggleTaskModel = (taskId: string) =>
    setExpandedTaskModels((prev) => ({ ...prev, [taskId]: !prev[taskId] }));

  const selectedModel = models.find((m) => m.id === tracker.modelId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{tracker.subject}</DialogTitle>
        <Separator />

        <div className="flex flex-col gap-4">
          {/* Modelo referenciado */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Modelo referenciado</Label>
            <Select
              value={tracker.modelId ?? "none"}
              onValueChange={(val) =>
                updateTrackerModel(tracker.id, val === "none" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Nenhum modelo selecionado" />
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

            {selectedModel && (
              <button
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit mt-1"
                onClick={() => setModelExpanded((v) => !v)}
              >
                <FileText className="size-3.5" />
                {modelExpanded ? "Ocultar conteúdo" : "Ver conteúdo do modelo"}
              </button>
            )}

            {selectedModel && modelExpanded && (
              <Textarea
                className="w-full resize-y bg-muted/30 mt-1"
                style={{ height: "30vh" }}
                value={selectedModel.content}
                readOnly
              />
            )}
          </div>

          <Separator />

          {/* Tarefas */}
          <div className="flex flex-col gap-3">
            {tracker.tasks.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma tarefa cadastrada.
              </p>
            )}
            {tracker.tasks.map((task) => {
              const taskModel = models.find((m) => m.id === task.modelId);
              return (
                <div key={task.id} className="flex flex-col gap-1">
                  <CheckboxTracker
                    id={task.id}
                    text={task.text}
                    checked={task.done}
                    onCheckedChange={() => toggleTrackerTask(tracker.id, task.id)}
                  />
                  <div className="ml-1 flex flex-col gap-1">
                    <Select
                      value={task.modelId ?? "none"}
                      onValueChange={(val) =>
                        updateTrackerTaskModel(tracker.id, task.id, val === "none" ? undefined : val)
                      }
                    >
                      <SelectTrigger className="h-7 text-xs w-64">
                        <SelectValue placeholder="Modelo desta tarefa..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum modelo</SelectItem>
                        {models.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {taskModel && (
                      <button
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                        onClick={() => toggleTaskModel(task.id)}
                      >
                        <FileText className="size-3" />
                        {expandedTaskModels[task.id] ? "Ocultar conteúdo" : "Ver conteúdo"}
                      </button>
                    )}

                    {taskModel && expandedTaskModels[task.id] && (
                      <Textarea
                        className="w-full resize-y bg-muted/30 text-sm"
                        style={{ height: "20vh" }}
                        value={taskModel.content}
                        readOnly
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useState } from "react";
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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LinkProcess } from "./LinkProcess";
import { Deadline } from "./Deadline";
import { useAppContext } from "@/context/app-context";
import type { Priority } from "@/lib/types";

export const RegisterNewDocument = () => {
  const { addDocument } = useAppContext();
  const [open, setOpen] = useState(false);
  const [sigad, setSigad] = useState("");
  const [priority, setPriority] = useState<string>("normal");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [trackerId, setTrackerId] = useState("");

  const handleSubmit = () => {
    if (!sigad.trim() || !subject.trim()) return;
    addDocument({
      sigad: sigad.trim(),
      priority: (priority === "alta" ? "Alta" : "Normal") as Priority,
      subject: subject.trim(),
      deadline: deadline ? deadline.toLocaleDateString("pt-BR") : "",
      linkedProcess: "",
      trackerId: trackerId || undefined,
    });
    setSigad("");
    setPriority("normal");
    setSubject("");
    setDeadline(undefined);
    setTrackerId("");
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
            Cadastrar novo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar novo documento</DialogTitle>
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
              <LinkProcess value={trackerId} onChange={setTrackerId} />
              <div className="flex justify-end mt-6">
                <Button className="rounded-full" onClick={handleSubmit}>
                  Cadastrar
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { useAppContext } from "@/context/app-context";

export const RegisterNewModel = ({ caixa }: { caixa?: string }) => {
  const { addModel } = useAppContext();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!subject.trim()) return;
    addModel(subject.trim(), content, caixa);
    setSubject("");
    setContent("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
          Cadastrar modelo
        </Button>
      </DialogTrigger>
      <DialogContent style={{ width: "50vw" }}>
        <DialogTitle>Cadastrar novo modelo</DialogTitle>

        <Separator />

        <div className="flex flex-col gap-5 my-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assunto" className="text-sm font-medium">
              Assunto do modelo
            </Label>
            <Input
              id="assunto"
              placeholder="Ex: Modelo de Ofício"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Texto do documento</Label>
            <Textarea
              className="w-full resize-y"
              style={{ height: "50vh" }}
              placeholder="Digite aqui o texto do documento..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              className="rounded-full w-fit"
              onClick={handleSubmit}
              disabled={!subject.trim()}
            >
              Cadastrar modelo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

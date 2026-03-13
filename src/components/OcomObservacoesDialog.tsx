"use client";

import { useState } from "react";
import { NotebookPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAppContext } from "@/context/app-context";
import type { OcomProcess } from "@/lib/types";

type Props = {
  ocom: OcomProcess;
};

export const OcomObservacoesDialog = ({ ocom }: Props) => {
  const { updateOcomProcess } = useAppContext();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(ocom.observacoes ?? "");

  const handleOpenChange = (next: boolean) => {
    if (next) setText(ocom.observacoes ?? "");
    setOpen(next);
  };

  const handleSave = async () => {
    await updateOcomProcess(ocom.id, { observacoes: text });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <NotebookPen className="size-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent style={{ width: "min(90vw, 40rem)" }}>
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">
            Observações — {ocom.processo}
          </DialogTitle>
        </DialogHeader>
        <Textarea
          className="min-h-48 resize-y"
          placeholder="Digite suas observações aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

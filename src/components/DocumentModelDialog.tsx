"use client";

import { useState } from "react";
import { Expand, ClipboardCopy, Edit, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAppContext } from "@/context/app-context";
import type { Model } from "@/lib/types";

type DocumentModelDialogProps = {
  model: Model;
};

export const DocumentModelDialog = ({ model }: DocumentModelDialogProps) => {
  const { updateModel, deleteModel } = useAppContext();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(model.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleSave = () => {
    updateModel(model.id, content);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setContent(model.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteModel(model.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent style={{ width: "50vw" }}>
        <DialogTitle>{model.subject}</DialogTitle>
        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isEditing ? "Modo de edição" : "Visualizando modelo"}
            </span>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleCancelEdit}
                  >
                    <X className="size-3.5" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-green-700 hover:bg-green-600"
                    onClick={handleSave}
                  >
                    <Check className="size-3.5" />
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={handleCopy}
                  >
                    <ClipboardCopy className="size-3.5" />
                    Copiar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3.5" />
                    Excluir
                  </Button>
                </>
              )}
            </div>
          </div>

          <Textarea
            className={`w-full min-h-80 resize-y transition-colors ${
              isEditing ? "border-primary" : "bg-muted/30"
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            readOnly={!isEditing}
            style={{ height: "50vh" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

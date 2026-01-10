"use client";

import { Expand, ClipboardCopy, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TableHead } from "./ui/table";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export const DocumentModelDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="h-100">
        <DialogTitle>Nome do modelo</DialogTitle>
        <div className="flex items-center gap-4 justify-end">
          <Edit className="cursor-pointer" />
          <ClipboardCopy className="cursor-pointer" />
          <Trash2 className="cursor-pointer" />
        </div>
        <div className="w-100">
          <Textarea
            className="w-full h-full"
            value={`Ao cumprimentá-lo respeitosamente...`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

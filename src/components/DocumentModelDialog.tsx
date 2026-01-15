"use client";

import { Expand, ClipboardCopy, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TableHead } from "./ui/table";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const DocumentModelDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="">
        <DialogTitle>Nome do modelo</DialogTitle>
        <Separator />
        <div className="flex items-center gap-4 justify-end">
          <Edit className="cursor-pointer" />
          <ClipboardCopy className="cursor-pointer" />
          <Trash2 className="cursor-pointer" />
        </div>
        <div>
          <Textarea className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

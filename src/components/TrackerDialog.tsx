"use client";

import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CheckboxTracker } from "./CheckboxTracker";
import { Separator } from "./ui/separator";

export const TrackerDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Tasks do Tracker</DialogTitle>
        <Separator />

        <div className="flex flex-col gap-2">
          <CheckboxTracker text={"Tarefa 1"} />
          <CheckboxTracker text={"Tarefa 2"} />
          <CheckboxTracker text={"Tarefa 3"} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

export const TrackerDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Expand className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Tasks do Tracker</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

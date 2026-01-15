"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { clsx } from "clsx";

export const RegisterNewModel = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
          Cadastrar modelo
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogTitle>Cadastrar novo modelo</DialogTitle>

        <Separator />

        <div className="flex flex-col gap-8 my-2">
          <div className="flex items-center">
            <Label htmlFor="assunto">Assunto do modelo</Label>
            <Input name="assunto" />
          </div>

          <Textarea placeholder="Digite aqui o texto do documento..." />

          <div className="flex justify-end">
            <Button className="rounded-full w-fit">Cadastrar modelo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

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
import React from "react";
import { LinkProcess } from "./LinkProcess";
import { Deadline } from "./Deadline";

export const RegisterNewDocument = () => {
  return (
    <>
      <div>
        <Dialog>
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
                    <Input required placeholder="Ex: 1113939" />
                  </Label>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Label>Prioridade:</Label>
                  <Select defaultValue="normal">
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
                      placeholder="Ex:  Modelo Operacional RDO SBHT"
                    />
                  </Label>
                </div>
                <Deadline />
                <LinkProcess />

                <div className="flex justify-end mt-6">
                  <Button className="rounded-full">Cadastrar</Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

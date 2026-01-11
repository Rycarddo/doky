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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Edit, Trash2 } from "lucide-react";

export const RegisterNewTracker = () => {
  return (
    <>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
              Cadastrar novo Tracker
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Tracker</DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex items-center gap-2 my-2">
              <Input className="w-100 rounded-full" />
              <Button className="rounded-full">Adiciontar tarefa</Button>
            </div>

            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead className="w-4">Editar</TableHead>
                  <TableHead className="w-4">Excluir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableCell>Tarefa 1</TableCell>
                <TableCell>
                  <Edit />
                </TableCell>
                <TableCell>
                  <Trash2 />
                </TableCell>
              </TableBody>
            </Table>

            <Button className="justify-self-end w-fit rounded-full">
              Cadastrar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

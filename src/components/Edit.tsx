"use client";

import { Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CheckboxTracker } from "./CheckboxTracker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ProcessHistoryTable } from "./ProcessHistoryTable";
import { LinkProcess } from "./LinkProcess";
import { Deadline } from "./Deadline";

export const EditProcess = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Expand className="size-5 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <Tabs>
            <TabsList>
              <TabsTrigger value="update">Atualização</TabsTrigger>
              <TabsTrigger value="initialConfigs">Config. Iniciais</TabsTrigger>
            </TabsList>
            <TabsContent value="update">
              <DialogTitle className="mt-4">Inserir atualização</DialogTitle>
              <div className="flex mt-6 items-end gap-2">
                <Label className="flex flex-col">
                  SIGAD <Input placeholder="Ex: 1213939" />
                </Label>
                <Label className="flex flex-col w-100">
                  Texto{" "}
                  <Input placeholder="Ex: Feito o documento para publicação em boletim" />
                </Label>
                <Button>Inserir</Button>
              </div>

              <Separator className="my-6" />

              <DialogTitle>Histórico</DialogTitle>
              <ProcessHistoryTable />

              <Separator className="my-6" />

              <DialogTitle>Tracker</DialogTitle>

              <div className="flex flex-col gap-2 mt-6">
                <CheckboxTracker text="Fazer o documento para publicação em boletim." />
                <CheckboxTracker text="Tarefa 2" />
                <CheckboxTracker text="Tarefa 3" />
              </div>

              <div className="flex justify-end mt-4">
                <Button>Finalizar processo</Button>
              </div>
            </TabsContent>
            <TabsContent value="initialConfigs">
              <DialogTitle className="my-4">Configurações Iniciais</DialogTitle>

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

                {/* Prazo */}
                <Deadline />

                {/* Vincular processo */}
                <LinkProcess />

                <div className="flex justify-end mt-6">
                  <Button className="rounded-full">Cadastrar</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

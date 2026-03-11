"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppContext } from "@/context/app-context";
import type { OcomSituacao } from "@/lib/types";

const CATEGORIAS = ["EPTA A", "EPTA ESPECIAL", "ETEX", "EQI", "OUTROS"] as const;
const SITUACOES: OcomSituacao[] = ["EM ANDAMENTO", "CONCLUÍDO", "ARQUIVADO", "OUTROS"];

export const RegisterNewOcom = () => {
  const { addOcomProcess } = useAppContext();
  const [open, setOpen] = useState(false);

  const [processo, setProcesso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [desigTelegrafica, setDesigTelegrafica] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [situacao, setSituacao] = useState<OcomSituacao>("EM ANDAMENTO");
  const [prazo, setPrazo] = useState("");
  const [anoInicio, setAnoInicio] = useState(new Date().getFullYear().toString());

  const handleSubmit = () => {
    if (!processo.trim() || !categoria || !desigTelegrafica.trim() || !localidade.trim()) return;
    addOcomProcess({
      processo: processo.trim(),
      categoria,
      desigTelegrafica: desigTelegrafica.trim(),
      localidade: localidade.trim(),
      empresa: empresa.trim(),
      situacao,
      prazo, // YYYY-MM-DD from input[type=date], API converts
      anoInicio: Number(anoInicio),
    });
    setProcesso("");
    setCategoria("");
    setDesigTelegrafica("");
    setLocalidade("");
    setEmpresa("");
    setSituacao("EM ANDAMENTO");
    setPrazo("");
    setAnoInicio(new Date().getFullYear().toString());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
          Cadastrar processo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar novo processo OCOM</DialogTitle>
        </DialogHeader>
        <Separator />

        <div className="flex flex-col gap-4">
          <Label className="w-full">
            Processo*
            <Input
              required
              placeholder="Ex: Substituição de Entidade Autorizada EPTA A"
              value={processo}
              onChange={(e) => setProcesso(e.target.value)}
            />
          </Label>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Categoria*</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Label className="flex-1">
              Desig. Telegráfica*
              <Input
                required
                placeholder="Ex: SBGR"
                value={desigTelegrafica}
                onChange={(e) => setDesigTelegrafica(e.target.value)}
              />
            </Label>
          </div>

          <div className="flex gap-3">
            <Label className="flex-1">
              Localidade*
              <Input
                required
                placeholder="Ex: Guarulhos - SP"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
              />
            </Label>
            <Label className="flex-1">
              Empresa
              <Input
                placeholder="Ex: MVS Engenharia"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              />
            </Label>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Situação</Label>
              <Select value={situacao} onValueChange={(v) => setSituacao(v as OcomSituacao)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SITUACOES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Label className="w-32">
              Prazo
              <Input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
              />
            </Label>

            <Label className="w-24">
              Ano Início
              <Input
                type="number"
                value={anoInicio}
                onChange={(e) => setAnoInicio(e.target.value)}
                min={2000}
                max={2100}
              />
            </Label>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              className="rounded-full"
              onClick={handleSubmit}
              disabled={!processo.trim() || !categoria || !desigTelegrafica.trim() || !localidade.trim()}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

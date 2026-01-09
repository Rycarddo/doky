"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import React from "react";

export const LinkProcess = () => {
  const processos = [
    {
      value: "extrato_de_boletim",
      label: "Extrato de boletim",
    },
    {
      value: "manutencao_operacional",
      label: "Manutenção operacional",
    },
    {
      value: "adaptacao_operacional",
      label: "Adaptação operacional",
    },
    {
      value: "publicacao_em_boletim",
      label: "Publicação em boletim",
    },
    {
      value: "retificacao_de_dados",
      label: "Retificação de dados",
    },
    {
      value: "atualizacao_cadastral",
      label: "Atualização cadastral",
    },
    {
      value: "analise_documental",
      label: "Análise documental",
    },
    {
      value: "homologacao_de_processo",
      label: "Homologação de processo",
    },
    {
      value: "arquivamento_administrativo",
      label: "Arquivamento administrativo",
    },
    {
      value: "encaminhamento_setorial",
      label: "Encaminhamento setorial",
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="flex items-center gap-4 mt-4">
      <Label>Vincular processo:</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit"
          >
            {value
              ? processos.find((processo) => processo.value === value)?.label
              : "Selecione um processo..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Selecione o processo..." />
            <CommandList>
              <CommandEmpty>Processo não encontrado.</CommandEmpty>

              <CommandGroup>
                {processos.map((processo) => (
                  <CommandItem
                    key={processo.value}
                    value={processo.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {processo.label}
                    <Check
                      className={`opacity-${
                        value === processo.value ? 100 : 0
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

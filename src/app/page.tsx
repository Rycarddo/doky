"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Expand,
  Search,
  ChevronsUpDown,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Filter from "@/components/filter";
import { FilterType } from "@/components/filter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const Home = () => {
  const documents = [
    {
      sigad: "1211231",
      priority: "Normal",
      subject: "Publicação em boletim",
      beginning: "01/01/2026",
      user: "rycarddo",
      status: "Em andamento",
      lastUpdate: "31/12/2025",
      deadline: "30/01/2026",
    },
    {
      sigad: "1211232",
      priority: "Alta",
      subject: "Publicação em boletim",
      beginning: "01/01/2026",
      user: "rycarddo",
      status: "Finalizado",
      lastUpdate: "31/12/2025",
      deadline: "30/01/2026",
    },
    {
      sigad: "1211233",
      priority: "Alta",
      subject:
        "Publicação em boletim Publicação em boletim Publicação em boletim Publicação em boletim",
      beginning: "01/01/2026",
      user: "rycarddo",
      status: "Em andamento",
      lastUpdate: "31/12/2025",
      deadline: "30/01/2026",
    },
    {
      sigad: "1211234",
      priority: "Normal",
      subject: "Publicação em boletim",
      beginning: "01/01/2026",
      user: "rycarddo",
      status: "Finalizado",
      lastUpdate: "31/12/2025",
      deadline: "30/01/2026",
    },
    {
      sigad: "1211235",
      priority: "Normal",
      subject: "Publicação em boletim",
      beginning: "01/01/2026",
      user: "rycarddo",
      status: "Em andamento",
      lastUpdate: "31/12/2025",
      deadline: "30/01/2026",
    },

    // ⬇️ padrão mantido ⬇️

    ...Array.from({ length: 95 }, (_, i) => {
      const n = 1211236 + i;
      return {
        sigad: String(n),
        priority: n % 2 === 0 ? "Alta" : "Normal",
        subject: "Publicação em boletim",
        beginning: "01/01/2026",
        user: "rycarddo",
        status: n % 3 === 0 ? "Finalizado" : "Em andamento",
        lastUpdate: "31/12/2025",
        deadline: "30/01/2026",
      };
    }),
  ];

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

  function checarStatus(status: string) {
    if (status === "Em andamento")
      return (
        <Badge className="border-blue-500" variant={"outline"}>
          <p className="text-blue-500">Em andamento</p>
        </Badge>
      );

    return (
      <Badge className="border-green-700" variant={"outline"}>
        <p className="text-green-700">Finalizado</p>
      </Badge>
    );
  }

  function checarPrioridade(prioridade: string) {
    if (prioridade === "Normal")
      return (
        <Badge className="border-blue-500" variant={"outline"}>
          <p className="text-blue-500">Normal</p>
        </Badge>
      );

    return (
      <Badge className="border-red-700" variant={"outline"}>
        <p className="text-red-700">Alta</p>
      </Badge>
    );
  }

  type Documents = {
    sigad: string;
    priority: string;
    subject: string;
    beginning: string;
    user: string;
    status: string;
    lastUpdate: string;
    deadline: string;
  };

  // Função para exportar depois
  const [open, setOpen] = React.useState(false);
  const [openDate, setOpenDate] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [value, setValue] = React.useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("inProgress");
  const [filteredDocuments, setFilteredDocuments] =
    useState<Documents[]>(documents);

  useEffect(() => {
    switch (currentFilter) {
      case "all":
        setFilteredDocuments(documents);
        break;
      case "inProgress":
        setFilteredDocuments(
          documents.filter((document) => document.status === "Em andamento")
        );
        break;
      case "done":
        setFilteredDocuments(
          documents.filter((document) => document.status === "Finalizado")
        );
    }
  }, [currentFilter, documents]);

  return (
    <>
      <div className="flex items-center justify-between mx-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-70 my-8 pl-9 rounded-full"
              placeholder="Digite o SIGAD ou assunto..."
            />
          </div>
          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>
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
                  <div className="flex items-center gap-4 mt-4">
                    <Label>Prazo:</Label>
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="data-[empty=true]:text-muted-foreground w-fit justify-start text-left font-normal"
                        >
                          {date
                            ? date.toLocaleDateString()
                            : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date);
                            setOpenDate(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
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
                            ? processos.find(
                                (processo) => processo.value === value
                              )?.label
                            : "Selecione um processo..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput placeholder="Selecione o processo..." />
                          <CommandList>
                            <CommandEmpty>
                              Processo não encontrado.
                            </CommandEmpty>

                            <CommandGroup>
                              {processos.map((processo) => (
                                <CommandItem
                                  key={processo.value}
                                  value={processo.value}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value ? "" : currentValue
                                    );
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

                  <div className="flex justify-end mt-6">
                    <Button className="rounded-full">Cadastrar</Button>
                  </div>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SIGAD</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((document) => (
            <TableRow key={document.sigad}>
              <TableCell className="max-w-4">{document.sigad}</TableCell>
              <TableCell>{checarPrioridade(document.priority)}</TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableCell className="truncate max-w-50">
                    {document.subject}
                  </TableCell>
                </TooltipTrigger>
                <TooltipContent>{document.subject}</TooltipContent>
              </Tooltip>
              <TableCell>{document.beginning}</TableCell>
              <TableCell>{document.user}</TableCell>
              <TableCell>{checarStatus(document.status)}</TableCell>
              <TableCell>{document.lastUpdate}</TableCell>
              <TableCell>{document.deadline}</TableCell>
              <TableCell>
                {/* O DIALOG será aqui*/}
                <Dialog>
                  <DialogTrigger>
                    <Expand className="size-5 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>
                      <Tabs>
                        <TabsList>
                          <TabsTrigger value="update">Atualização</TabsTrigger>
                          <TabsTrigger value="initialConfigs">
                            Config. Iniciais
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="update">
                          <DialogTitle className="mt-4">
                            Inserir atualização
                          </DialogTitle>
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
                          <div className="mt-6">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Usuário</TableHead>
                                  <TableHead>SIGAD</TableHead>
                                  <TableHead>Texto</TableHead>
                                  <TableHead>Edit</TableHead>
                                  <TableHead>Deletar</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>12/12/2026 12:06:42</TableCell>
                                  <TableCell>rycarddo</TableCell>
                                  <TableCell>1213939</TableCell>
                                  <TableCell>
                                    Ofício para publicação em boletim
                                  </TableCell>
                                  <TableCell>
                                    <Edit className="cursor-pointer" />
                                  </TableCell>
                                  <TableCell>
                                    <Trash2 className="cursor-pointer" />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>

                          <Separator className="my-6" />

                          <DialogTitle>Tracker</DialogTitle>

                          <div className="flex flex-col gap-2 mt-6">
                            <div>
                              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 w-fit cursor-pointer">
                                <Checkbox
                                  id="2"
                                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <p>
                                  Fazer o documento para publicação em boletim.
                                </p>
                              </Label>
                            </div>
                            <div>
                              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 w-fit cursor-pointer">
                                <Checkbox
                                  id="2"
                                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <p>Fazer alguma coisa.</p>
                              </Label>
                            </div>
                            <div>
                              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 w-fit cursor-pointer">
                                <Checkbox
                                  id="2"
                                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <p>Fazer alguma coisa 2.</p>
                              </Label>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="initialConfigs">
                          <DialogTitle className="my-4">
                            Configurações Iniciais
                          </DialogTitle>

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
                                    <SelectItem value="normal">
                                      Normal
                                    </SelectItem>
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
                            <div className="flex items-center gap-4 mt-4">
                              <Label>Prazo:</Label>
                              <Popover
                                open={openDate}
                                onOpenChange={setOpenDate}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="data-[empty=true]:text-muted-foreground w-fit justify-start text-left font-normal"
                                  >
                                    {date
                                      ? date.toLocaleDateString()
                                      : "Selecione uma data"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto overflow-hidden p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                      setDate(date);
                                      setOpenDate(false);
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
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
                                      ? processos.find(
                                          (processo) => processo.value === value
                                        )?.label
                                      : "Selecione um processo..."}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <Command>
                                    <CommandInput placeholder="Selecione o processo..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        Processo não encontrado.
                                      </CommandEmpty>

                                      <CommandGroup>
                                        {processos.map((processo) => (
                                          <CommandItem
                                            key={processo.value}
                                            value={processo.value}
                                            onSelect={(currentValue) => {
                                              setValue(
                                                currentValue === value
                                                  ? ""
                                                  : currentValue
                                              );
                                              setOpen(false);
                                            }}
                                          >
                                            {processo.label}
                                            <Check
                                              className={`opacity-${
                                                value === processo.value
                                                  ? 100
                                                  : 0
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

                            <div className="flex justify-end mt-6">
                              <Button className="rounded-full">
                                Cadastrar
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogTitle>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total de documentos:</TableCell>
            <TableCell>{filteredDocuments.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default Home;

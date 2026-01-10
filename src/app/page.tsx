"use client";

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
import React, { useEffect, useState } from "react";
import Filter from "@/components/filter";
import { FilterType } from "@/components/filter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RegisterNewDocument } from "@/components/RegisterNewDocument";
import { SearchProcess } from "@/components/SearchProcess";
import { EditProcess } from "@/components/Edit";

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
          <SearchProcess searchText="Digite o SIGAD ou assunto..." />

          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>

        {/* Botão de Cadastrar novo documento */}
        <RegisterNewDocument />
      </div>
      <Table>
        {/* Deverá virar componente */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit">SIGAD</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-fit">Última atualização</TableHead>
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
                {/* Botão Edit */}
                <EditProcess />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="w-fit">
          <TableRow>
            <TableCell>Documentos:</TableCell>
            <TableCell>{filteredDocuments.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default Home;

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
import React, { useMemo, useState } from "react";
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
import { useAppContext } from "@/context/app-context";
import type { Priority, DocumentStatus } from "@/lib/types";
import { FileText } from "lucide-react";

function checarStatus(status: DocumentStatus) {
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

function checarPrioridade(priority: Priority) {
  if (priority === "Normal")
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

const Home = () => {
  const { documents } = useAppContext();
  const [currentFilter, setCurrentFilter] = useState<FilterType>("inProgress");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const parseDeadline = (d: string) => {
      if (!d) return Infinity;
      const [day, month, year] = d.split("/").map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    return documents
      .filter((doc) => {
        const matchesFilter =
          currentFilter === "all" ||
          (currentFilter === "inProgress" && doc.status === "Em andamento") ||
          (currentFilter === "done" && doc.status === "Finalizado");

        const matchesSearch =
          query === "" ||
          doc.sigad.toLowerCase().includes(query) ||
          doc.subject.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => parseDeadline(a.deadline) - parseDeadline(b.deadline));
  }, [documents, currentFilter, searchQuery]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-3">
          <SearchProcess
            searchText="Digite o SIGAD ou assunto..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
        </div>
        <RegisterNewDocument />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">SIGAD</TableHead>
            <TableHead className="w-28">Prioridade</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead className="w-28">Início</TableHead>
            <TableHead className="w-32">Responsável</TableHead>
            <TableHead className="w-36">Status</TableHead>
            <TableHead className="w-40">Última atualização</TableHead>
            <TableHead className="w-28">Prazo</TableHead>
            <TableHead className="w-12">Abrir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 && (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                  <FileText className="size-10 opacity-30" />
                  <p className="text-sm">
                    {documents.length === 0
                      ? "Nenhum processo cadastrado. Clique em \"Cadastrar novo\" para começar."
                      : "Nenhum processo encontrado para os filtros aplicados."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {filteredDocuments.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-mono text-sm">{document.sigad}</TableCell>
              <TableCell>{checarPrioridade(document.priority)}</TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableCell className="truncate max-w-64">
                    {document.subject}
                  </TableCell>
                </TooltipTrigger>
                <TooltipContent>{document.subject}</TooltipContent>
              </Tooltip>
              <TableCell className="text-muted-foreground text-sm">{document.beginning}</TableCell>
              <TableCell>{document.user}</TableCell>
              <TableCell>{checarStatus(document.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{document.lastUpdate}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{document.deadline}</TableCell>
              <TableCell>
                <EditProcess document={document} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="text-muted-foreground text-sm">
              {filteredDocuments.length} processo{filteredDocuments.length !== 1 ? "s" : ""} encontrado{filteredDocuments.length !== 1 ? "s" : ""}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default Home;

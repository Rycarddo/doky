"use client";

import { useMemo, useState } from "react";
import { DocumentModelDialog } from "@/components/DocumentModelDialog";
import { RegisterNewModel } from "@/components/RegisterNewModel";
import { SearchProcess } from "@/components/SearchProcess";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/app-context";
import { FileStack } from "lucide-react";

const ModelsPage = () => {
  const { models } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return models;
    return models.filter((m) => m.subject.toLowerCase().includes(query));
  }, [models, searchQuery]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4">
        <SearchProcess
          searchText="Digite o assunto do modelo buscado..."
          width={"full"}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <RegisterNewModel />
      </div>

      <Table style={{ tableLayout: "fixed", width: "100%" }}>
        <TableHeader>
          <TableRow>
            <TableHead>Assunto</TableHead>
            <TableHead style={{ width: "10rem" }}>Última atualização</TableHead>
            <TableHead style={{ width: "4rem" }} className="text-center">Abrir</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredModels.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                  <FileStack className="size-10 opacity-30" />
                  <p className="text-sm">
                    {models.length === 0
                      ? "Nenhum modelo cadastrado. Clique em \"Cadastrar modelo\" para começar."
                      : "Nenhum modelo encontrado para a busca realizada."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {filteredModels.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.subject}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{model.updatedAt}</TableCell>
              <TableCell className="text-center">
                <DocumentModelDialog model={model} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ModelsPage;

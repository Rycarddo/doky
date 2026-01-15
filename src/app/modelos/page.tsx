import { DocumentModelDialog } from "@/components/DocumentModelDialog";
import { RegisterNewModel } from "@/components/RegisterNewModel";
import { SearchProcess } from "@/components/SearchProcess";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expand } from "lucide-react";

const models = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 w-full">
        <SearchProcess
          searchText="Digite o assunto do modelo buscado..."
          width={"full"}
        />

        <RegisterNewModel />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assunto</TableHead>
            {/* Aqui entrará um Dialog */}
            <TableHead className="w-4">Abrir</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>
              Assunto Assunto Assunto Assunto Assunto Assunto Assunto Assunto
              Assunto Assunto
            </TableCell>
            <TableCell>
              <DocumentModelDialog />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default models;

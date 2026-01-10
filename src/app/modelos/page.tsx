import { DocumentModelDialog } from "@/components/DocumentModelDialog";
import { SearchProcess } from "@/components/SearchProcess";
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
      <div className="w-full ">
        <SearchProcess
          searchText="Digite o assunto do modelo buscado..."
          width={"full"}
        />
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
          <TableCell>
            Assunto Assunto Assunto Assunto Assunto Assunto Assunto Assunto
            Assunto Assunto
          </TableCell>
          <TableCell>
            <DocumentModelDialog />
          </TableCell>
        </TableBody>
      </Table>
    </>
  );
};

export default models;

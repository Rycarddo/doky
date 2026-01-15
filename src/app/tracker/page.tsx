import { RegisterNewDocument } from "@/components/RegisterNewDocument";
import { RegisterNewTracker } from "@/components/RegisterNewTracker";
import { SearchProcess } from "@/components/SearchProcess";
import { TrackerDialog } from "@/components/TrackerDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expand } from "lucide-react";

const TrackerPage = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 w-full ">
        <SearchProcess
          searchText="Digite o assunto do tracker buscado..."
          width={"full"}
        />

        <RegisterNewTracker />
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
              <TrackerDialog />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default TrackerPage;

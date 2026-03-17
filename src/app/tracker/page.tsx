"use client";

import { useMemo, useState } from "react";
import { RegisterNewTracker } from "@/components/RegisterNewTracker";
import { SearchProcess } from "@/components/SearchProcess";
import { TrackerDialog } from "@/components/TrackerDialog";
import { EditTracker } from "@/components/EditTracker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/app-context";
import { GraduationCap, Trash2 } from "lucide-react";

const TrackerPage = () => {
  const { trackers, deleteTracker } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrackers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return trackers;
    return trackers.filter((t) => t.subject.toLowerCase().includes(query));
  }, [trackers, searchQuery]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-4">
        <SearchProcess
          searchText="Digite o assunto do tracker buscado..."
          width={"full"}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <RegisterNewTracker />
      </div>

      <Table style={{ tableLayout: "fixed", width: "100%" }}>
        <TableHeader>
          <TableRow>
            <TableHead>Assunto</TableHead>
            <TableHead style={{ width: "10rem" }}>Última atualização</TableHead>
            <TableHead style={{ width: "4rem" }} className="text-center">Editar</TableHead>
            <TableHead style={{ width: "4rem" }} className="text-center">Abrir</TableHead>
            <TableHead style={{ width: "4rem" }} className="text-center">Excluir</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTrackers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                  <GraduationCap className="size-10 opacity-30" />
                  <p className="text-sm">
                    {trackers.length === 0
                      ? "Nenhum tracker cadastrado. Clique em \"Cadastrar novo Tracker\" para começar."
                      : "Nenhum tracker encontrado para a busca realizada."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {filteredTrackers.map((tracker) => (
            <TableRow key={tracker.id}>
              <TableCell>{tracker.subject}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{tracker.updatedAt}</TableCell>
              <TableCell className="text-center">
                <EditTracker tracker={tracker} />
              </TableCell>
              <TableCell className="text-center">
                <TrackerDialog tracker={tracker} />
              </TableCell>
              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors mx-auto size-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir tracker</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o tracker <strong>&quot;{tracker.subject}&quot;</strong>? Essa ação não pode ser desfeita. Documentos vinculados a este tracker perderão a associação.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTracker(tracker.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TrackerPage;

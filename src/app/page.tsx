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
import { Expand, Search } from "lucide-react";

const Home = () => {
  const documentos = [
    {
      sigad: "1211231",
      prioridade: "Normal",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Em andamento",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
    },
    {
      sigad: "1211232",
      prioridade: "Alta",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Finalizado",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
    },
    {
      sigad: "1211233",
      prioridade: "Alta",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Em andamento",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
    },
    {
      sigad: "1211234",
      prioridade: "Normal",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Finalizado",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
    },
    {
      sigad: "1211235",
      prioridade: "Normal",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Em andamento",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
    },
    {
      sigad: "1211236",
      prioridade: "Normal",
      assunto: "Publicação em boletim",
      dataInicio: "01/01/2026",
      responsavel: "rycarddo",
      statusDocumento: "Em andamento",
      ultimaAtualizacao: "31/12/2025",
      prazo: "30/01/2026",
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
          <Button
            className="rounded-full cursor-pointer"
            variant={"currentStatusFilterChecked"}
          >
            Todos
          </Button>
          <Button
            className="rounded-full cursor-pointer border-green-700"
            variant={"currentStatusFilterUnchecked"}
          >
            Em andamento
          </Button>
          <Button
            className="rounded-full cursor-pointer"
            variant={"currentStatusFilterUnchecked"}
          >
            Finalizado
          </Button>
        </div>
        <div>
          <Button className="rounded-full bg-green-700 hover:bg-green-600 cursor-pointer">
            Cadastrar novo
          </Button>
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
          {documentos.map((documento) => (
            <TableRow key={documento.sigad}>
              <TableCell>{documento.sigad}</TableCell>
              <TableCell>{checarPrioridade(documento.prioridade)}</TableCell>
              <TableCell>{documento.assunto}</TableCell>
              <TableCell>{documento.dataInicio}</TableCell>
              <TableCell>{documento.responsavel}</TableCell>
              <TableCell>{checarStatus(documento.statusDocumento)}</TableCell>
              <TableCell>{documento.ultimaAtualizacao}</TableCell>
              <TableCell>{documento.prazo}</TableCell>
              <TableCell>
                <Expand className="size-5 cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total de documentos:</TableCell>
            <TableCell colSpan={8}>{documentos.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default Home;

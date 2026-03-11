"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchProcess } from "@/components/SearchProcess";
import { RegisterNewOcom } from "@/components/RegisterNewOcom";
import { OcomDialog } from "@/components/OcomDialog";
import { useAppContext } from "@/context/app-context";
import type { OcomSituacao } from "@/lib/types";
import { FileText } from "lucide-react";

// Compute status badge from prazo string (DD/MM/YYYY)
function computeStatus(prazo: string): "VENCIDO" | "ATENÇÃO" | "OK" | null {
  if (!prazo) return null;
  const [day, month, year] = prazo.split("/").map(Number);
  if (!day || !month || !year) return null;
  const deadline = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "VENCIDO";
  if (diff < 10) return "ATENÇÃO";
  return "OK";
}

const STATUS_COLORS = {
  VENCIDO: "#dc2626",
  ATENÇÃO: "#ca8a04",
  OK: "#16a34a",
};

function StatusBadge({ prazo }: { prazo: string }) {
  const status = computeStatus(prazo);
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;

  const color = STATUS_COLORS[status];
  return (
    <span
      style={{ color, borderColor: color }}
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
    >
      {status}
    </span>
  );
}

const CATEGORIA_COLORS: Record<string, string> = {
  "EPTA A": "#0d9488",
  "EPTA ESPECIAL": "#ea580c",
  "ETEX": "#4f46e5",
  "EQI": "#d97706",
  "OUTROS": "#6b7280",
};

function CategoriaBadge({ categoria }: { categoria: string }) {
  const color = CATEGORIA_COLORS[categoria] ?? "#6b7280";
  return (
    <span
      style={{ color, borderColor: color }}
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
    >
      {categoria}
    </span>
  );
}

const SITUACAO_COLORS: Record<OcomSituacao, string> = {
  ARQUIVADO: "#dc2626",
  "CONCLUÍDO": "#16a34a",
  "EM ANDAMENTO": "#2563eb",
  OUTROS: "#9333ea",
};

function SituacaoBadge({ situacao }: { situacao: OcomSituacao }) {
  const color = SITUACAO_COLORS[situacao] ?? "#6b7280";
  return (
    <span
      style={{ color, borderColor: color }}
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
    >
      {situacao}
    </span>
  );
}

function parsePrazoToMs(prazo: string): number {
  if (!prazo) return Infinity;
  const [day, month, year] = prazo.split("/").map(Number);
  if (!day || !month || !year) return Infinity;
  return new Date(year, month - 1, day).getTime();
}

const CATEGORIAS_FILTER = ["TODOS", "EPTA A", "EPTA ESPECIAL", "ETEX", "EQI", "OUTROS"] as const;
type CategoriaFilter = (typeof CATEGORIAS_FILTER)[number];

const SITUACOES_FILTER = ["TODOS", "EM ANDAMENTO", "CONCLUÍDO", "OUTROS", "ARQUIVADO"] as const;
type SituacaoFilter = (typeof SITUACOES_FILTER)[number];

export default function ControleOcomPage() {
  const { ocomProcesses } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<CategoriaFilter>("TODOS");
  const [filterSituacao, setFilterSituacao] = useState<SituacaoFilter>("EM ANDAMENTO");

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const list = ocomProcesses.filter((o) => {
      const matchesSearch =
        !query ||
        o.processo.toLowerCase().includes(query) ||
        o.categoria.toLowerCase().includes(query) ||
        o.desigTelegrafica.toLowerCase().includes(query) ||
        o.localidade.toLowerCase().includes(query) ||
        o.empresa.toLowerCase().includes(query);
      const matchesCategoria = filterCategoria === "TODOS" || o.categoria === filterCategoria;
      const matchesSituacao = filterSituacao === "TODOS" || o.situacao === filterSituacao;
      return matchesSearch && matchesCategoria && matchesSituacao;
    });

    return [...list].sort((a, b) => parsePrazoToMs(a.prazo) - parsePrazoToMs(b.prazo));
  }, [ocomProcesses, searchQuery, filterCategoria, filterSituacao]);

  return (
    <>
      <div className="flex items-center justify-between py-4 gap-4">
        <SearchProcess
          searchText="Digite o processo, categoria, localidade ou empresa..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <RegisterNewOcom />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground w-16">Categoria</span>
          {CATEGORIAS_FILTER.map((c) => (
            <Button
              key={c}
              className="rounded-full cursor-pointer"
              variant={filterCategoria === c ? "currentStatusFilterChecked" : "currentStatusFilterUnchecked"}
              onClick={() => setFilterCategoria(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground w-16">Situação</span>
          {SITUACOES_FILTER.map((s) => (
            <Button
              key={s}
              className="rounded-full cursor-pointer"
              variant={filterSituacao === s ? "currentStatusFilterChecked" : "currentStatusFilterUnchecked"}
              onClick={() => setFilterSituacao(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Processo</TableHead>
            <TableHead className="w-28">Categoria</TableHead>
            <TableHead className="w-28">Desig. Telegr.</TableHead>
            <TableHead className="w-36">Localidade</TableHead>
            <TableHead className="w-40">Empresa</TableHead>
            <TableHead className="w-28">Prazo</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-32">Situação</TableHead>
            <TableHead className="w-20">Ano Início</TableHead>
            <TableHead className="w-12">Abrir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={10}>
                <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                  <FileText className="size-10 opacity-30" />
                  <p className="text-sm">
                    {ocomProcesses.length === 0
                      ? "Nenhum processo cadastrado. Clique em \"Cadastrar processo\" para começar."
                      : "Nenhum processo encontrado para a busca realizada."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {filtered.map((ocom) => (
            <TableRow key={ocom.id}>
              <TableCell className="max-w-64 truncate">{ocom.processo}</TableCell>
              <TableCell><CategoriaBadge categoria={ocom.categoria} /></TableCell>
              <TableCell className="font-mono text-sm">{ocom.desigTelegrafica}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{ocom.localidade}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{ocom.empresa || "—"}</TableCell>
              <TableCell className="text-sm">
                {ocom.prazo || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                <StatusBadge prazo={ocom.prazo} />
              </TableCell>
              <TableCell>
                <SituacaoBadge situacao={ocom.situacao} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{ocom.anoInicio}</TableCell>
              <TableCell>
                <OcomDialog ocom={ocom} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9} className="text-muted-foreground text-sm">
              {filtered.length} processo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

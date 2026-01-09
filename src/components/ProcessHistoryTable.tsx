"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export const ProcessHistoryTable = () => {
  return (
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
            <TableCell>Ofício para publicação em boletim</TableCell>
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
  );
};

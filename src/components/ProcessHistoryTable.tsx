"use client";

import { Edit, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { HistoryEntry } from "@/lib/types";

type ProcessHistoryTableProps = {
  history: HistoryEntry[];
  onEdit: (entryId: string, text: string) => void;
  onDelete: (entryId: string) => void;
};

export const ProcessHistoryTable = ({
  history,
  onEdit,
  onDelete,
}: ProcessHistoryTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (entry: HistoryEntry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Texto</TableHead>
            <TableHead className="w-8">Editar</TableHead>
            <TableHead className="w-8">Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum histórico registrado.
              </TableCell>
            </TableRow>
          )}
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap">{entry.date}</TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell>
                {editingId === entry.id ? (
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  entry.text
                )}
              </TableCell>
              <TableCell>
                {editingId === entry.id ? (
                  <div className="flex gap-1">
                    <Check className="cursor-pointer text-green-600 size-4" onClick={saveEdit} />
                    <X className="cursor-pointer text-red-600 size-4" onClick={cancelEdit} />
                  </div>
                ) : (
                  <Edit className="cursor-pointer size-4" onClick={() => startEdit(entry)} />
                )}
              </TableCell>
              <TableCell>
                <Trash2 className="cursor-pointer size-4" onClick={() => onDelete(entry.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

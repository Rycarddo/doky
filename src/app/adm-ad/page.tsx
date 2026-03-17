"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

type AdmAdGroup = "DNB" | "EPTA" | "CIVA_AZ";

type AdmAdContact = {
  id: string;
  group: AdmAdGroup;
  radio: string;
  oprOrgao: string;
  oprAd: string;
  horarioFuncionamento: string;
};

type EditState = {
  radio: string;
  oprOrgao: string;
  oprAd: string;
  horarioFuncionamento: string;
};

type NewState = EditState & { open: boolean };

function GroupSection({
  group,
  title,
  contacts,
  onAdd,
  onSave,
  onDelete,
}: {
  group: AdmAdGroup;
  title: string;
  contacts: AdmAdContact[];
  onAdd: (group: AdmAdGroup, data: EditState) => Promise<void>;
  onSave: (id: string, data: EditState) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({ radio: "", oprOrgao: "", oprAd: "", horarioFuncionamento: "" });
  const [newEntry, setNewEntry] = useState<NewState>({ open: false, radio: "", oprOrgao: "", oprAd: "", horarioFuncionamento: "" });

  const startEdit = (c: AdmAdContact) => {
    setEditingId(c.id);
    setEdit({ radio: c.radio, oprOrgao: c.oprOrgao, oprAd: c.oprAd, horarioFuncionamento: c.horarioFuncionamento });
  };

  const handleSave = async (id: string) => {
    await onSave(id, edit);
    setEditingId(null);
  };

  const handleAdd = async () => {
    await onAdd(group, { radio: newEntry.radio, oprOrgao: newEntry.oprOrgao, oprAd: newEntry.oprAd, horarioFuncionamento: newEntry.horarioFuncionamento });
    setNewEntry({ open: false, radio: "", oprOrgao: "", oprAd: "", horarioFuncionamento: "" });
  };

  const rows = contacts.filter((c) => c.group === group);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between my-6">
        <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
        <Dialog open={newEntry.open} onOpenChange={(o) => setNewEntry((s) => ({ ...s, open: o }))}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="size-4" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle>Novo registro — {title}</DialogTitle>
            <div className="flex flex-col gap-4 mt-2">
              <Label>
                RADIO
                <Input
                  value={newEntry.radio}
                  onChange={(e) => setNewEntry((s) => ({ ...s, radio: e.target.value }))}
                  autoFocus
                />
              </Label>
              <Label>
                OPR. ÓRGÃO
                <Input
                  value={newEntry.oprOrgao}
                  onChange={(e) => setNewEntry((s) => ({ ...s, oprOrgao: e.target.value }))}
                />
              </Label>
              <Label>
                OPR. AD
                <Input
                  value={newEntry.oprAd}
                  onChange={(e) => setNewEntry((s) => ({ ...s, oprAd: e.target.value }))}
                />
              </Label>
              <Label>
                Horário de Funcionamento
                <Input
                  value={newEntry.horarioFuncionamento}
                  onChange={(e) => setNewEntry((s) => ({ ...s, horarioFuncionamento: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                />
              </Label>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Cancelar</Button>
                </DialogTrigger>
                <Button size="sm" onClick={handleAdd}>
                  Cadastrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RADIO</TableHead>
            <TableHead>OPR. ÓRGÃO</TableHead>
            <TableHead>OPR. AD</TableHead>
            <TableHead>Horário Funcionamento</TableHead>
            <TableHead className="w-10">Editar</TableHead>
            <TableHead className="w-10">Excluir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                Nenhum registro cadastrado.
              </TableCell>
            </TableRow>
          )}
          {rows.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="text-sm">
                {editingId === c.id ? (
                  <Input className="h-7 text-sm" value={edit.radio} onChange={(e) => setEdit((s) => ({ ...s, radio: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") handleSave(c.id); if (e.key === "Escape") setEditingId(null); }} autoFocus />
                ) : c.radio || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-sm">
                {editingId === c.id ? (
                  <Input className="h-7 text-sm" value={edit.oprOrgao} onChange={(e) => setEdit((s) => ({ ...s, oprOrgao: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") handleSave(c.id); if (e.key === "Escape") setEditingId(null); }} />
                ) : c.oprOrgao || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-sm">
                {editingId === c.id ? (
                  <Input className="h-7 text-sm" value={edit.oprAd} onChange={(e) => setEdit((s) => ({ ...s, oprAd: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") handleSave(c.id); if (e.key === "Escape") setEditingId(null); }} />
                ) : c.oprAd || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-sm">
                {editingId === c.id ? (
                  <Input className="h-7 text-sm" value={edit.horarioFuncionamento} onChange={(e) => setEdit((s) => ({ ...s, horarioFuncionamento: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") handleSave(c.id); if (e.key === "Escape") setEditingId(null); }} />
                ) : c.horarioFuncionamento || <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                {editingId === c.id ? (
                  <div className="flex gap-1">
                    <Check className="cursor-pointer text-green-600 size-4" onClick={() => handleSave(c.id)} />
                    <X className="cursor-pointer text-red-600 size-4" onClick={() => setEditingId(null)} />
                  </div>
                ) : (
                  <Pencil className="cursor-pointer size-4" onClick={() => startEdit(c)} />
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Trash2 className="cursor-pointer size-4" />
                  </DialogTrigger>
                  <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                    <DialogTitle>Excluir registro</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Tem certeza que deseja excluir este registro?
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
                          Excluir
                        </Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-muted-foreground text-sm">
              {rows.length} registro{rows.length !== 1 ? "s" : ""}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default function AdmAdPage() {
  const [contacts, setContacts] = useState<AdmAdContact[]>([]);

  useEffect(() => {
    fetch("/api/adm-ad")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setContacts(data); })
      .catch(() => {});
  }, []);

  const handleAdd = useCallback(async (group: AdmAdGroup, data: EditState) => {
    const res = await fetch("/api/adm-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group, ...data }),
    });
    const created = await res.json();
    setContacts((prev) => [...prev, created]);
  }, []);

  const handleSave = useCallback(async (id: string, data: EditState) => {
    const res = await fetch(`/api/adm-ad/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`/api/adm-ad/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <div className="px-6 pb-10">
      <GroupSection group="DNB" title="DNB's" contacts={contacts} onAdd={handleAdd} onSave={handleSave} onDelete={handleDelete} />
      <GroupSection group="EPTA" title="EPTA's" contacts={contacts} onAdd={handleAdd} onSave={handleSave} onDelete={handleDelete} />
      <GroupSection group="CIVA_AZ" title="CIVA-AZ" contacts={contacts} onAdd={handleAdd} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}

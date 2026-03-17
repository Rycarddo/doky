"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, PhoneCall } from "lucide-react";
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

type OcomContact = {
  id: string;
  orgaoAts: string;
  tf2: string;
  tf4: string;
};

export default function ContatosOcomPage() {
  const [contacts, setContacts] = useState<OcomContact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOrgaoAts, setEditOrgaoAts] = useState("");
  const [editTf2, setEditTf2] = useState("");
  const [editTf4, setEditTf4] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newOrgaoAts, setNewOrgaoAts] = useState("");
  const [newTf2, setNewTf2] = useState("");
  const [newTf4, setNewTf4] = useState("");

  useEffect(() => {
    fetch("/api/ocom-contacts")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setContacts(data); })
      .catch(() => {});
  }, []);

  const startEdit = (contact: OcomContact) => {
    setEditingId(contact.id);
    setEditOrgaoAts(contact.orgaoAts);
    setEditTf2(contact.tf2);
    setEditTf4(contact.tf4);
  };

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/ocom-contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgaoAts: editOrgaoAts, tf2: editTf2, tf4: editTf4 }),
    });
    const updated = await res.json();
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleDelete = async (id: string) => {
    await fetch(`/api/ocom-contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdd = async () => {
    if (!newOrgaoAts.trim()) return;
    const res = await fetch("/api/ocom-contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgaoAts: newOrgaoAts, tf2: newTf2, tf4: newTf4 }),
    });
    const created = await res.json();
    setContacts((prev) => [...prev, created]);
    setNewOrgaoAts("");
    setNewTf2("");
    setNewTf4("");
    setAddOpen(false);
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Contatos Operacionais OCOM</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <PhoneCall className="size-4" />
              Novo contato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle>Novo contato</DialogTitle>
            <div className="flex flex-col gap-4 mt-2">
              <Label>
                Órgão ATS
                <Input
                  placeholder="Ex: ACC-BR"
                  value={newOrgaoAts}
                  onChange={(e) => setNewOrgaoAts(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                />
              </Label>
              <Label>
                TF-2
                <Input
                  placeholder="Frequência TF-2"
                  value={newTf2}
                  onChange={(e) => setNewTf2(e.target.value)}
                />
              </Label>
              <Label>
                TF-4
                <Input
                  placeholder="Frequência TF-4"
                  value={newTf4}
                  onChange={(e) => setNewTf4(e.target.value)}
                />
              </Label>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Cancelar</Button>
                </DialogTrigger>
                <Button size="sm" onClick={handleAdd} disabled={!newOrgaoAts.trim()}>
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
            <TableHead>Órgão ATS</TableHead>
            <TableHead className="w-48">TF-2</TableHead>
            <TableHead className="w-48">TF-4</TableHead>
            <TableHead className="w-10">Editar</TableHead>
            <TableHead className="w-10">Excluir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                Nenhum contato cadastrado.
              </TableCell>
            </TableRow>
          )}
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="text-sm">
                {editingId === contact.id ? (
                  <Input
                    className="h-7 text-sm"
                    value={editOrgaoAts}
                    onChange={(e) => setEditOrgaoAts(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(contact.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  contact.orgaoAts
                )}
              </TableCell>
              <TableCell className="text-sm">
                {editingId === contact.id ? (
                  <Input
                    className="h-7 text-sm"
                    value={editTf2}
                    onChange={(e) => setEditTf2(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(contact.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                ) : (
                  contact.tf2 || <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {editingId === contact.id ? (
                  <Input
                    className="h-7 text-sm"
                    value={editTf4}
                    onChange={(e) => setEditTf4(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(contact.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                ) : (
                  contact.tf4 || <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {editingId === contact.id ? (
                  <div className="flex gap-1">
                    <Check className="cursor-pointer text-green-600 size-4" onClick={() => saveEdit(contact.id)} />
                    <X className="cursor-pointer text-red-600 size-4" onClick={cancelEdit} />
                  </div>
                ) : (
                  <Pencil className="cursor-pointer size-4" onClick={() => startEdit(contact)} />
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Trash2 className="cursor-pointer size-4" />
                  </DialogTrigger>
                  <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                    <DialogTitle>Excluir contato</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Tem certeza que deseja excluir o contato de <strong>{contact.orgaoAts}</strong>?
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.id)}>
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
            <TableCell colSpan={5} className="text-muted-foreground text-sm">
              {contacts.length} contato{contacts.length !== 1 ? "s" : ""} cadastrado{contacts.length !== 1 ? "s" : ""}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

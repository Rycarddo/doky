"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/table";

type UserCaixa = { id: string; caixa: string };

type ApprovedUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "OPERATOR";
  caixas: UserCaixa[];
  createdAt: string;
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  OPERATOR: "Operador",
};

const CAIXAS = ["OCOM", "OCNO", "CIVA_AZ"] as const;
const CAIXA_LABEL: Record<string, string> = {
  OCOM: "OCOM",
  OCNO: "OCNO",
  CIVA_AZ: "CIVA-AZ",
};

function CaixasCheckboxes({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex gap-3">
      {CAIXAS.map((caixa) => (
        <label key={caixa} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
          <Checkbox
            checked={value.includes(caixa)}
            onCheckedChange={(checked) => {
              if (checked) onChange([...value, caixa]);
              else onChange(value.filter((c) => c !== caixa));
            }}
          />
          {CAIXA_LABEL[caixa]}
        </label>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState<ApprovedUser[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "OPERATOR">("OPERATOR");
  const [editCaixas, setEditCaixas] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "OPERATOR">("OPERATOR");
  const [newCaixas, setNewCaixas] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .catch(() => {});
  }, []);

  const startEdit = (user: ApprovedUser) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setEditCaixas(user.caixas.map((c) => c.caixa));
  };

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, role: editRole, caixas: editCaixas }),
    });
    const updated = await res.json();
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAdd = async () => {
    if (!newEmail.trim() || !newName.trim()) return;
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail.trim(),
        name: newName.trim(),
        role: newRole,
        caixas: newCaixas,
      }),
    });
    const created = await res.json();
    setUsers((prev) => [...prev, created]);
    setNewEmail("");
    setNewName("");
    setNewRole("OPERATOR");
    setNewCaixas([]);
    setAddOpen(false);
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Usuários autorizados</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="size-4" />
              Cadastrar usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle>Cadastrar usuário</DialogTitle>
            <div className="flex flex-col gap-4 mt-2">
              <Label>
                Email
                <Input
                  type="email"
                  placeholder="usuario@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Label>
              <Label>
                Nome
                <Input
                  placeholder="Nome do usuário"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Label>
              <div>
                <Label>Perfil</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as "ADMIN" | "OPERATOR")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="OPERATOR">Operador</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Caixas</Label>
                <CaixasCheckboxes value={newCaixas} onChange={setNewCaixas} />
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Cancelar</Button>
                </DialogTrigger>
                <Button size="sm" onClick={handleAdd} disabled={!newEmail.trim() || !newName.trim()}>
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
            <TableHead>Email</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-36">Perfil</TableHead>
            <TableHead>Caixas</TableHead>
            <TableHead className="w-10">Editar</TableHead>
            <TableHead className="w-10">Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhum usuário cadastrado.
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="text-sm">{user.email}</TableCell>
              <TableCell className="text-sm">
                {editingId === user.id ? (
                  <Input
                    className="h-7 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(user.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Select value={editRole} onValueChange={(v) => setEditRole(v as "ADMIN" | "OPERATOR")}>
                    <SelectTrigger className="h-7 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="OPERATOR">Operador</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm">{ROLE_LABEL[user.role]}</span>
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <CaixasCheckboxes value={editCaixas} onChange={setEditCaixas} />
                ) : (
                  <div className="flex gap-1 flex-wrap">
                    {user.caixas.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      user.caixas.map((c) => (
                        <span
                          key={c.id}
                          className="text-xs bg-muted px-1.5 py-0.5 rounded"
                        >
                          {CAIXA_LABEL[c.caixa] ?? c.caixa}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <div className="flex gap-1">
                    <Check className="cursor-pointer text-green-600 size-4" onClick={() => saveEdit(user.id)} />
                    <X className="cursor-pointer text-red-600 size-4" onClick={cancelEdit} />
                  </div>
                ) : (
                  <Pencil className="cursor-pointer size-4" onClick={() => startEdit(user)} />
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Trash2 className="cursor-pointer size-4" />
                  </DialogTrigger>
                  <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                    <DialogTitle>Remover acesso</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Tem certeza que deseja remover o acesso de <strong>{user.email}</strong>? O usuário não conseguirá mais fazer login.
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">Cancelar</Button>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                          Remover
                        </Button>
                      </DialogTrigger>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

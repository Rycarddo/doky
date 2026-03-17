"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Pencil, Trash2, Check, X, UserPlus, RefreshCw,
  Users, ShieldCheck, MonitorSmartphone, FileText,
  FolderOpen, GraduationCap, FileStack, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// ─── Types ───────────────────────────────────────────────────────────────────

type UserCaixa = { id: string; caixa: string };
type ApprovedUser = {
  id: string; email: string; name: string;
  role: "ADMIN" | "OPERATOR"; caixas: UserCaixa[]; createdAt: string;
};
type SessionEntry = {
  id: string; userName: string; email: string;
  ipAddress: string | null; userAgent: string | null;
  createdAt: string; expiresAt: string;
};
type RecentLogin = {
  id: string; userName: string; email: string;
  ipAddress: string | null; userAgent: string | null;
  createdAt: string; isActive: boolean;
};
type DashboardStats = {
  totalUsers: number; totalApproved: number; activeSessions: number;
  totalProcesses: number; totalOcomProcesses: number;
  totalTrackers: number; totalModels: number;
};
type DashboardData = {
  stats: DashboardStats;
  activeSessions: SessionEntry[];
  recentLogins: RecentLogin[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", OPERATOR: "Operador" };
const CAIXAS = ["OCOM", "OCNO", "CIVA_AZ"] as const;
const CAIXA_LABEL: Record<string, string> = { OCOM: "OCOM", OCNO: "OCNO", CIVA_AZ: "CIVA-AZ" };

function parseBrowser(ua: string | null): string {
  if (!ua) return "—";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Outro";
}

function parseOS(ua: string | null): string {
  if (!ua) return "—";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Macintosh/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Outro";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color,
}: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className={`rounded-full p-2 ${color}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function CaixasCheckboxes({
  value, onChange,
}: { value: string[]; onChange: (v: string[]) => void }) {
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  // Dashboard
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);

  // Users
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

  const loadDashboard = useCallback(() => {
    setDashLoading(true);
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => setDashboard(data))
      .catch(() => {})
      .finally(() => setDashLoading(false));
  }, []);

  useEffect(() => {
    loadDashboard();
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .catch(() => {});
  }, [loadDashboard]);

  // ── Session revoke ──
  const revokeSession = async (id: string) => {
    await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
    setDashboard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activeSessions: prev.activeSessions.filter((s) => s.id !== id),
        recentLogins: prev.recentLogins.map((s) =>
          s.id === id ? { ...s, isActive: false } : s
        ),
        stats: { ...prev.stats, activeSessions: prev.stats.activeSessions - 1 },
      };
    });
  };

  // ── User CRUD ──
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
      body: JSON.stringify({ email: newEmail.trim(), name: newName.trim(), role: newRole, caixas: newCaixas }),
    });
    const created = await res.json();
    setUsers((prev) => [...prev, created]);
    setNewEmail(""); setNewName(""); setNewRole("OPERATOR"); setNewCaixas([]);
    setAddOpen(false);
  };

  const stats = dashboard?.stats;

  return (
    <div className="py-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Controle Admin</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        {/* ── Visão Geral ── */}
        <TabsContent value="overview" className="flex flex-col gap-6 mt-4">

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard label="Usuários no sistema" value={stats?.totalUsers ?? "—"} icon={Users} color="bg-blue-500/10 text-blue-500" />
            <StatCard label="Usuários autorizados" value={stats?.totalApproved ?? "—"} icon={ShieldCheck} color="bg-green-500/10 text-green-500" />
            <StatCard label="Sessões ativas agora" value={stats?.activeSessions ?? "—"} icon={MonitorSmartphone} color="bg-purple-500/10 text-purple-500" />
            <StatCard label="Documentos OCNO" value={stats?.totalProcesses ?? "—"} icon={FileText} color="bg-orange-500/10 text-orange-500" />
            <StatCard label="Processos OCOM" value={stats?.totalOcomProcesses ?? "—"} icon={FolderOpen} color="bg-cyan-500/10 text-cyan-500" />
            <StatCard label="Trackers" value={stats?.totalTrackers ?? "—"} icon={GraduationCap} color="bg-yellow-500/10 text-yellow-500" />
            <StatCard label="Modelos" value={stats?.totalModels ?? "—"} icon={FileStack} color="bg-rose-500/10 text-rose-500" />
          </div>

          <Separator />

          {/* Online agora */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Online agora</h2>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={loadDashboard} disabled={dashLoading}>
                <RefreshCw className={`size-3.5 ${dashLoading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
            {dashLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : !dashboard?.activeSessions.length ? (
              <p className="text-sm text-muted-foreground">Nenhuma sessão ativa no momento.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {dashboard.activeSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <Wifi className="size-4 text-green-500 shrink-0" />
                      <div>
                        <p className="font-medium">{s.userName}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{parseBrowser(s.userAgent)} · {parseOS(s.userAgent)}</p>
                      <p>{s.ipAddress ?? "IP desconhecido"}</p>
                      <p>{timeAgo(s.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Sessões ── */}
        <TabsContent value="sessions" className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Histórico de sessões</h2>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={loadDashboard} disabled={dashLoading}>
              <RefreshCw className={`size-3.5 ${dashLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Navegador / SO</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-24">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Carregando...</TableCell>
                </TableRow>
              ) : !dashboard?.recentLogins.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhuma sessão registrada.</TableCell>
                </TableRow>
              ) : (
                dashboard.recentLogins.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{s.userName}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {parseBrowser(s.userAgent)} · {parseOS(s.userAgent)}
                    </TableCell>
                    <TableCell className="text-sm font-mono">{s.ipAddress ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(s.createdAt)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {s.isActive
                        ? fmtDate(dashboard.activeSessions.find((a) => a.id === s.id)?.expiresAt ?? s.createdAt)
                        : "Expirada"}
                    </TableCell>
                    <TableCell className="text-center">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Wifi className="size-3" /> Ativa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <WifiOff className="size-3" /> Expirada
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {s.isActive && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs h-7">
                              Revogar
                            </Button>
                          </DialogTrigger>
                          <DialogContent style={{ width: "20rem" }} className="max-w-xs">
                            <DialogTitle>Revogar sessão</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                              Isso encerrará a sessão de <strong>{s.userName}</strong> imediatamente.
                            </p>
                            <div className="flex justify-end gap-2 mt-2">
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">Cancelar</Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => revokeSession(s.id)}>
                                  Revogar
                                </Button>
                              </DialogTrigger>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── Usuários ── */}
        <TabsContent value="users" className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Usuários autorizados</h2>
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
                    <Input type="email" placeholder="usuario@email.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </Label>
                  <Label>
                    Nome
                    <Input placeholder="Nome do usuário" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  </Label>
                  <div>
                    <Label>Perfil</Label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as "ADMIN" | "OPERATOR")}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                      <Input className="h-7 text-sm" value={editName} onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(user.id); if (e.key === "Escape") cancelEdit(); }}
                        autoFocus />
                    ) : user.name}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id ? (
                      <Select value={editRole} onValueChange={(v) => setEditRole(v as "ADMIN" | "OPERATOR")}>
                        <SelectTrigger className="h-7 text-sm"><SelectValue /></SelectTrigger>
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
                            <span key={c.id} className="text-xs bg-muted px-1.5 py-0.5 rounded">
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
                          Tem certeza que deseja remover o acesso de <strong>{user.email}</strong>?
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

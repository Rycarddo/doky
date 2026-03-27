"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ServiceStatus = "operational" | "degraded" | "outage";

type ServiceResult = {
  key: string;
  name: string;
  group: string;
  status: ServiceStatus;
  latency: number | null;
  error: string | null;
};

type ServiceGroup = {
  name: string;
  services: ServiceResult[];
};

type StatusResponse = {
  status: ServiceStatus;
  checkedAt: string;
  groups: ServiceGroup[];
};

const STATUS_CONFIG = {
  operational: {
    label: "Operacional",
    color: "text-green-500",
    bg: "bg-green-500",
    icon: CheckCircle2,
    banner: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
    bannerText: "Todos os sistemas operacionais",
  },
  degraded: {
    label: "Degradado",
    color: "text-yellow-500",
    bg: "bg-yellow-500",
    icon: AlertTriangle,
    banner: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    bannerText: "Desempenho degradado em alguns serviços",
  },
  outage: {
    label: "Indisponível",
    color: "text-red-500",
    bg: "bg-red-500",
    icon: XCircle,
    banner: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
    bannerText: "Falha detectada em serviços críticos",
  },
};

function StatusDot({ status }: { status: ServiceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {status !== "operational" && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.bg} opacity-75`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.bg}`} />
    </span>
  );
}

function LatencyBadge({ latency }: { latency: number | null }) {
  if (latency === null) return null;
  const color =
    latency < 100
      ? "text-green-500"
      : latency < 500
        ? "text-yellow-500"
        : "text-red-500";
  return (
    <span className={`text-xs font-mono tabular-nums ${color}`}>{latency}ms</span>
  );
}

function ServiceRow({ service }: { service: ServiceResult }) {
  const cfg = STATUS_CONFIG[service.status];
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-3 min-w-0">
        <StatusDot status={service.status} />
        <span className="text-sm font-medium truncate">{service.name}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <LatencyBadge latency={service.latency} />
        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: ServiceGroup }) {
  const groupStatus: ServiceStatus = group.services.some((s) => s.status === "outage")
    ? "outage"
    : group.services.some((s) => s.status === "degraded")
      ? "degraded"
      : "operational";

  const cfg = STATUS_CONFIG[groupStatus];
  const GroupIcon = cfg.icon;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <span className="font-semibold text-sm">{group.name}</span>
        <GroupIcon className={`size-4 ${cfg.color}`} />
      </div>
      <div className="divide-y">
        {group.services.map((service, i) => (
          <ServiceRow key={service.key} service={service} />
        ))}
      </div>
    </div>
  );
}

function OverallBanner({ status }: { status: ServiceStatus }) {
  const cfg = STATUS_CONFIG[status];
  const BannerIcon = cfg.icon;
  return (
    <div className={`rounded-xl border px-5 py-4 flex items-center gap-3 ${cfg.banner}`}>
      <BannerIcon className="size-5 shrink-0" />
      <span className="font-semibold">{cfg.bannerText}</span>
    </div>
  );
}

function SkeletonGroup() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-pulse">
      <div className="h-11 bg-muted/50 border-b" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-muted" />
            <div className="h-3.5 w-32 rounded bg-muted" />
          </div>
          <div className="h-3.5 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/status");
      const json: StatusResponse = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 30_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const formatLastRefresh = () => {
    if (!lastRefresh) return null;
    return lastRefresh.toLocaleTimeString("pt-BR");
  };

  const totalServices = data?.groups.reduce((acc, g) => acc + g.services.length, 0) ?? 0;
  const operationalCount = data?.groups.reduce(
    (acc, g) => acc + g.services.filter((s) => s.status === "operational").length,
    0
  ) ?? 0;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Activity className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Status do Sistema</h1>
            {lastRefresh && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Atualizado às {formatLastRefresh()}
                {totalServices > 0 && (
                  <> · {operationalCount}/{totalServices} serviços operacionais</>
                )}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchStatus(true)}
          disabled={refreshing || loading}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Separator />

      {/* Overall banner */}
      {loading ? (
        <div className="h-14 rounded-xl bg-muted animate-pulse" />
      ) : data ? (
        <OverallBanner status={data.status} />
      ) : null}

      {/* Service groups */}
      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonGroup />
            <SkeletonGroup />
            <SkeletonGroup />
          </>
        ) : (
          data?.groups.map((group) => (
            <GroupCard key={group.name} group={group} />
          ))
        )}
      </div>

      {/* Footer */}
      {!loading && data && (
        <p className="text-center text-xs text-muted-foreground pt-2">
          Verificação automática a cada 30 segundos ·{" "}
          {new Date(data.checkedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </div>
  );
}

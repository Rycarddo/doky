"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { CalendarData, CalendarTask } from "@/app/api/tasks/calendar/route";

// ─── Helpers ───────────────────────────────────────────────────────────────

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── Task panel shown below the calendar ──────────────────────────────────

function TaskPanel({
  dateKey,
  tasks,
  onClose,
}: {
  dateKey: string;
  tasks: CalendarTask[];
  onClose: () => void;
}) {
  const label = new Date(dateKey + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="mt-2 mx-1 rounded-md border bg-card text-card-foreground shadow-sm text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="font-medium capitalize">{label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-5 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="size-3" />
        </Button>
      </div>
      <ul className="divide-y">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start gap-2 px-3 py-2">
            <span className="text-muted-foreground shrink-0 tabular-nums">{t.time}</span>
            <span className="leading-snug wrap-break-word min-w-0">{t.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main exported component ───────────────────────────────────────────────

export function TasksCalendar() {
  const [tasksMap, setTasksMap] = React.useState<CalendarData>({});
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

  const fetchTasks = React.useCallback(() => {
    fetch("/api/tasks/calendar")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d === "object" && !Array.isArray(d)) setTasksMap(d);
      })
      .catch(() => {});
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Re-fetch whenever a "tasks" SSE event arrives
  React.useEffect(() => {
    const es = new EventSource("/api/sse");
    es.onmessage = (e) => {
      if (e.data === "tasks") fetchTasks();
    };
    return () => es.close();
  }, [fetchTasks]);

  // Build Date objects for days with tasks so react-day-picker can match them
  const taskDates = React.useMemo(
    () =>
      Object.keys(tasksMap).map((key) => {
        const [y, m, d] = key.split("-").map(Number);
        return new Date(y, m - 1, d); // local midnight — matches react-day-picker's day.date
      }),
    [tasksMap]
  );

  const selectedTasks: CalendarTask[] = selectedKey
    ? (tasksMap[selectedKey] ?? [])
    : [];

  // The Date to pass as `selected` (only for task days, so non-task days aren't highlighted)
  const selectedDate: Date | undefined = React.useMemo(() => {
    if (!selectedKey) return undefined;
    const [y, m, d] = selectedKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedKey]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedKey(null);
      return;
    }
    const key = localDateKey(date);
    if ((tasksMap[key]?.length ?? 0) > 0) {
      // Toggle panel for this day
      setSelectedKey((prev) => (prev === key ? null : key));
    } else {
      // No tasks — close panel and don't highlight the clicked day
      setSelectedKey(null);
    }
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        modifiers={{ hasTask: taskDates }}
        modifiersClassNames={{ hasTask: "rdp-has-task" }}
        className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground **:[[role=gridcell]]:w-8.25"
      />
      {selectedKey && selectedTasks.length > 0 && (
        <TaskPanel
          dateKey={selectedKey}
          tasks={selectedTasks}
          onClose={() => setSelectedKey(null)}
        />
      )}
    </div>
  );
}

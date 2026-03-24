"use client";

import * as React from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CalendarIcon, X } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

type Props = {
  value: string; // ISO datetime string or ""
  onChange: (value: string) => void;
};

function isoToparts(iso: string): { date: Date | undefined; hour: string; minute: string } {
  if (!iso) return { date: undefined, hour: "09", minute: "00" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: undefined, hour: "09", minute: "00" };
  const minuteRounded = String(Math.floor(d.getMinutes() / 5) * 5).padStart(2, "0");
  return {
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    hour: String(d.getHours()).padStart(2, "0"),
    minute: minuteRounded,
  };
}

function buildIso(date: Date, hour: string, minute: string): string {
  const d = new Date(date);
  d.setHours(Number(hour), Number(minute), 0, 0);
  return d.toISOString();
}

export function ScheduledAtPicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);

  const { date: initDate, hour: initHour, minute: initMinute } = React.useMemo(
    () => isoToparts(value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [date, setDate] = React.useState<Date | undefined>(initDate);
  const [hour, setHour] = React.useState(initHour);
  const [minute, setMinute] = React.useState(initMinute);

  // Sync when value is reset externally (e.g. opening edit dialog)
  React.useEffect(() => {
    const { date: d, hour: h, minute: m } = isoToparts(value);
    setDate(d);
    setHour(h);
    setMinute(m);
  }, [value]);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    setOpen(false);
    if (selected) onChange(buildIso(selected, hour, minute));
    else onChange("");
  };

  const handleHourChange = (h: string) => {
    setHour(h);
    if (date) onChange(buildIso(date, h, minute));
  };

  const handleMinuteChange = (m: string) => {
    setMinute(m);
    if (date) onChange(buildIso(date, hour, m));
  };

  const handleClear = () => {
    setDate(undefined);
    setHour("09");
    setMinute("00");
    onChange("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Agendar para</Label>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start gap-2 font-normal w-36 text-sm"
              data-empty={!date}
            >
              <CalendarIcon className="size-3.5 text-muted-foreground" />
              <span className={date ? "" : "text-muted-foreground"}>
                {date ? date.toLocaleDateString("pt-BR") : "Selecionar dia"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>

        {/* Hour select */}
        <Select value={hour} onValueChange={handleHourChange} disabled={!date}>
          <SelectTrigger className="w-20 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {HOURS.map((h) => (
              <SelectItem key={h} value={h}>{h}h</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-sm">:</span>

        {/* Minute select */}
        <Select value={minute} onValueChange={handleMinuteChange} disabled={!date}>
          <SelectTrigger className="w-20 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m}>{m}min</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear button */}
        {date && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={handleClear}
            type="button"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

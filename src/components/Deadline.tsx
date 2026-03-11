"use client";

import React from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DeadlineProps = {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
};

export const Deadline = ({ date: controlledDate, onDateChange }: DeadlineProps = {}) => {
  const [openDate, setOpenDate] = React.useState(false);
  const [localDate, setLocalDate] = React.useState<Date | undefined>(undefined);

  const isControlled = onDateChange !== undefined;
  const date = isControlled ? controlledDate : localDate;

  const handleSelect = (selected: Date | undefined) => {
    if (isControlled) {
      onDateChange!(selected);
    } else {
      setLocalDate(selected);
    }
    setOpenDate(false);
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Label>Prazo:</Label>
      <Popover open={openDate} onOpenChange={setOpenDate}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-fit justify-start text-left font-normal"
          >
            {date ? date.toLocaleDateString("pt-BR") : "Selecione uma data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

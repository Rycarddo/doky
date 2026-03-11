"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import React from "react";
import { useAppContext } from "@/context/app-context";

type LinkProcessProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const LinkProcess = ({
  value: controlledValue,
  onChange,
}: LinkProcessProps = {}) => {
  const { trackers } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");

  const isControlled = onChange !== undefined;
  const value = isControlled ? (controlledValue ?? "") : localValue;

  const handleSelect = (currentValue: string) => {
    const next = currentValue === value ? "" : currentValue;
    if (isControlled) {
      onChange!(next);
    } else {
      setLocalValue(next);
    }
    setOpen(false);
  };

  const selectedTracker = trackers.find((t) => t.id === value);

  return (
    <div className="flex items-center gap-4 mt-4">
      <Label>Vincular Tracker:</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-fit"
          >
            {selectedTracker ? selectedTracker.subject : "Selecione um tracker..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Buscar tracker..." />
            <CommandList>
              <CommandEmpty>Nenhum tracker encontrado.</CommandEmpty>
              <CommandGroup>
                {value && (
                  <CommandItem value="" onSelect={() => handleSelect(value)}>
                    Nenhum
                    <Check className={value === "" ? "opacity-100" : "opacity-0"} />
                  </CommandItem>
                )}
                {trackers.map((tracker) => (
                  <CommandItem
                    key={tracker.id}
                    value={tracker.id}
                    onSelect={handleSelect}
                  >
                    {tracker.subject}
                    <Check
                      className={value === tracker.id ? "opacity-100" : "opacity-0"}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

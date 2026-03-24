"use client";

import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type CheckboxTrackerProps = {
  id: string;
  text: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const CheckboxTracker = ({
  id,
  text,
  checked,
  onCheckedChange,
}: CheckboxTrackerProps) => {
  return (
    <div className="w-full">
      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 w-full cursor-pointer">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(c) => onCheckedChange?.(c === true)}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 shrink-0 mt-0.5"
        />
        <p className="wrap-break-word min-w-0">{text}</p>
      </Label>
    </div>
  );
};

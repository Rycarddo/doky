"use client";

import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type CheckboxTrackerProps = {
  text: string;
};

export const CheckboxTracker = ({ text }: CheckboxTrackerProps) => {
  return (
    <>
      <div>
        <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950 w-fit cursor-pointer">
          <Checkbox
            id="2"
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <p>{text}</p>
        </Label>
      </div>
    </>
  );
};

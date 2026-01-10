"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

type SearchProcessProps = {
  searchText: string;
  width?: string;
};

{
  /* 
  
  w-70 default
  w-full para models

  */
}

export const SearchProcess = ({
  searchText,
  width = "70",
}: SearchProcessProps) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className={`w-${width} my-8 pl-9 rounded-full`}
        placeholder={`${searchText}`}
      />
    </div>
  );
};

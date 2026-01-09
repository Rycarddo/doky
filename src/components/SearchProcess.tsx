"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

export const SearchProcess = () => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="w-70 my-8 pl-9 rounded-full"
        placeholder="Digite o SIGAD ou assunto..."
      />
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { getContacts } from "@/actions/get-contacts";
import { toast } from "sonner";
import ContactCard from "@/components/ui/contact-card";
import type { OperatorLocation } from "../../../generated/prisma/enums";

type Contact = { location: OperatorLocation; content: string };

const DNB_LOCATIONS = [
  { code: "SBCZ", name: "CRUZEIRO DO SUL - SBCZ" },
  { code: "SBTF", name: "TEFÉ - SBTF" },
  { code: "SBAT", name: "ALTA FLORESTA - SBAT" },
  { code: "SBHT", name: "ALTAMIRA - SBHT" },
  { code: "SBCJ", name: "CARAJÁS - SBCJ" },
  { code: "SBIH", name: "ITAITUBA - SBIH" },
  { code: "SBMA", name: "MARABÁ - SBMA" },
] as const;

const EPTA_LOCATIONS = [
  { code: "SBTB", name: "TROMBETAS - SBTB" },
  { code: "SBJI", name: "JI-PARANÁ - SBJI" },
  { code: "SBUY", name: "URUCU - SBUY" },
  { code: "SBRD", name: "RONDONÓPOLIS - SBRD" },
  { code: "SBSO", name: "SORRISO - SBSO" },
  { code: "SBSI", name: "SINOP - SBSI" },
  { code: "SSKW", name: "CACOAL - SSKW" },
  { code: "SWGN", name: "ARAGUAÍNA - SWGN" },
] as const;

export default function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getContacts().then((result) => {
      if (cancelled) return;
      if (result.success && result.data) {
        setContacts(
          result.data.map((c) => ({
            location: c.location,
            content: c.content,
          })),
        );
      } else {
        toast.error("Erro ao carregar contatos");
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const getContent = (code: string) =>
    contacts.find((c) => c.location === code)?.content ?? "";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        Carregando contatos...
      </div>
    );
  }

  return (
    <div className="px-6 pb-10">
      <div id="dnbs" className="mb-10">
        <h2 className="text-xl font-semibold text-center my-6 tracking-wide">
          DNB&apos;s
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {DNB_LOCATIONS.map((loc) => (
            <ContactCard
              key={loc.code}
              location={loc.code}
              title={loc.name}
              initialContent={getContent(loc.code)}
            />
          ))}
        </div>
      </div>

      <div id="eptas">
        <h2 className="text-xl font-semibold text-center my-6 tracking-wide">
          EPTA&apos;s
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {EPTA_LOCATIONS.map((loc) => (
            <ContactCard
              key={loc.code}
              location={loc.code}
              title={loc.name}
              initialContent={getContent(loc.code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

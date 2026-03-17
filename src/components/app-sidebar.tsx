"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FileStack,
  GraduationCap,
  Shield,
  SquareCheck,
  BookUser,
  PhoneCall,
  Building2,
} from "lucide-react";

import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";

type NavItem = { href: string; label: string; icon: React.ElementType };
type NavGroup = { caixa: string | null; items: NavItem[] };

const ALL_GROUPS: NavGroup[] = [
  {
    caixa: "OCNO",
    items: [
      { href: "/", label: "Controle OCNO", icon: FileText },
      { href: "/modelos/ocno", label: "Modelos OCNO", icon: FileStack },
      { href: "/tracker/ocno", label: "Tracker OCNO", icon: GraduationCap },
      { href: "/tarefas/ocno", label: "Tarefas OCNO", icon: SquareCheck },
    ],
  },
  {
    caixa: "OCOM",
    items: [
      { href: "/controleOcom", label: "Controle OCOM", icon: FileText },
      { href: "/modelos/ocom", label: "Modelos OCOM", icon: FileStack },
      { href: "/tracker/ocom", label: "Tracker OCOM", icon: GraduationCap },
      { href: "/tarefas/ocom", label: "Tarefas OCOM", icon: SquareCheck },
      { href: "/contatos-ocom", label: "Contatos Op. OCOM", icon: PhoneCall },
      { href: "/adm-ad", label: "ADM AD", icon: Building2 },
    ],
  },
  {
    caixa: "CIVA_AZ",
    items: [
      { href: "/modelos/civa-az", label: "Modelos CIVA-AZ", icon: FileStack },
      { href: "/tracker/civa-az", label: "Tracker CIVA-AZ", icon: GraduationCap },
      { href: "/tarefas/civa-az", label: "Tarefas CIVA-AZ", icon: SquareCheck },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [userCaixas, setUserCaixas] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    if (!session) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setUserCaixas(d.caixas ?? []))
      .catch(() => setUserCaixas([]));
  }, [session]);

  const navGroups = React.useMemo<NavGroup[]>(() => {
    const caixaGroups = isAdmin || userCaixas === null
      ? ALL_GROUPS
      : ALL_GROUPS.filter((g) => g.caixa && userCaixas.includes(g.caixa));
    return [
      ...caixaGroups,
      { caixa: null, items: [{ href: "/contatos", label: "Contatos", icon: BookUser }] },
      ...(isAdmin ? [{ caixa: null, items: [{ href: "/admin", label: "Admin", icon: Shield }] }] : []),
    ];
  }, [isAdmin, userCaixas]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <SidebarContent className="flex">
          <SidebarContent className="ml-2">
            {navGroups.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && <SidebarSeparator className="mx-0 my-1" />}
                {group.items.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <SidebarMenuButton
                      key={href}
                      className="h-10"
                      variant={isActive ? "currentSection" : "default"}
                      asChild
                    >
                      <Link href={href}>
                        <Icon />
                        {label}
                      </Link>
                    </SidebarMenuButton>
                  );
                })}
              </React.Fragment>
            ))}
          </SidebarContent>
        </SidebarContent>
      </SidebarContent>
      <SidebarFooter className="mt-auto flex items-end justify-end p-2">
        <ModeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

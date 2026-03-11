"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FileStack, GraduationCap } from "lucide-react";

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

const data = {
  user: {
    name: "Rycarddo",
    email: "rycarddo@email.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Controle OCNO", icon: FileText },
    { href: "/modelos", label: "Modelos", icon: FileStack },
    { href: "/tracker", label: "Tracker", icon: GraduationCap },
    { href: "/controleOcom", label: "Controle OCOM", icon: FileText },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <SidebarContent className="flex">
          <SidebarContent className="ml-2">
            {navItems.map(({ href, label, icon: Icon }) => {
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

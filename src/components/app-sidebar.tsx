import * as React from "react";
import Link from "next/link";
import { Plus, FileText, FileStack, GraduationCap } from "lucide-react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-provider";

// This is sample data.
const data = {
  user: {
    name: "Rycarddo",
    email: "rycarddo@email.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "Processos",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Modelos",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Tutoriais",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
            <SidebarMenuButton className="h-10" variant={"currentSection"}>
              <FileText />
              <Link href="/">Processos</Link>
            </SidebarMenuButton>
            <SidebarMenuButton className="h-10">
              <FileStack />
              <Link href="/modelos">Modelos</Link>
            </SidebarMenuButton>
            <SidebarMenuButton className="h-10">
              <GraduationCap />
              <Link href="/tracker" className="cursor-pointer">
                Tracker
              </Link>
            </SidebarMenuButton>
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

import * as React from "react";
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
        <SidebarContent className="ml-2">
          <SidebarMenuButton className="h-10" variant={"currentSection"}>
            <FileText />
            <p>Processos</p>
          </SidebarMenuButton>
          <SidebarMenuButton className="h-10">
            <FileStack />
            <p>Modelos</p>
          </SidebarMenuButton>
          <SidebarMenuButton className="h-10">
            <GraduationCap />
            <p>Tutoriais</p>
          </SidebarMenuButton>
        </SidebarContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

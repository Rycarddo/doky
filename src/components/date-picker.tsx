import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { TasksCalendar } from "@/components/TasksCalendar";

export function DatePicker() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <TasksCalendar />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

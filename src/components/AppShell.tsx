"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppProvider } from "@/context/app-context";

// Skip SSR for AppSidebar: it uses authClient.useSession() which makes
// outbound HTTP calls that fail inside Docker (SSL termination is at the proxy).
const AppSidebar = dynamic(
  () => import("@/components/app-sidebar").then((m) => ({ default: m.AppSidebar })),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex h-full w-full">
          <AppSidebar />
          <main className="flex-1 min-w-0 flex flex-col h-full">
            <header className="border-b h-12 px-4 flex items-center gap-3 sticky top-0 bg-background z-10 shrink-0">
              <SidebarTrigger />
            </header>
            <div className="flex-1 overflow-auto px-6 pb-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider, ModeToggle } from "@/components/theme-provider";
import { AppProvider } from "@/context/app-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doky",
  description: "Administrative document manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <SidebarProvider>
              {/* Container geral: sidebar + conteúdo */}
              <div className="flex h-full w-full">
                <AppSidebar />

                {/* Área restante */}
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
        </ThemeProvider>
      </body>
    </html>
  );
}

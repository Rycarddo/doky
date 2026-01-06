import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
        suppressHydrationWarning
      >
        <SidebarProvider>
          {/* Container geral: sidebar + conteúdo */}
          <div className="flex h-full w-full">
            <AppSidebar />

            {/* Área restante */}
            <main className="flex-1 min-w-0 overflow-hidden">
              {/* Conteúdo da rota (tabela) */}
              <div className="overflow-auto px-4 pb-4">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

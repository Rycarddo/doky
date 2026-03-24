"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

type TrackerDialogShellProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  width?: string;
};

export function TrackerDialogShell({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  width = "min(90vw, 32rem)",
}: TrackerDialogShellProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
        <DialogPrimitive.Content
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            width,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--background)",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            outline: "none",
          }}
        >
          {/* Cabeçalho fixo */}
          <div style={{ flexShrink: 0, padding: "1.5rem 1.5rem 0" }}>
            <DialogPrimitive.Title
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                lineHeight: 1.4,
                color: "var(--foreground)",
                paddingRight: "1.5rem",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {title}
            </DialogPrimitive.Title>
            <hr style={{ marginTop: "1rem", borderColor: "var(--border)" }} />
          </div>

          {/* Área rolável */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              padding: "1rem 1.5rem 1.5rem",
            }}
          >
            {children}
          </div>

          {/* Botão fechar */}
          <DialogPrimitive.Close
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              opacity: 0.7,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground)",
            }}
          >
            <XIcon style={{ width: "1rem", height: "1rem" }} />
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
              Fechar
            </span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

"use client";

import React, { ReactNode, useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return React.createElement(
    ToastContext.Provider,
    { value: { toasts, addToast, dismissToast } },
    children
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  const toast = context.addToast;
  return { toast, toasts: context.toasts, dismissToast: context.dismissToast };
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  return React.createElement(
    "div",
    {
      className: "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
    },
    toasts.map((t) =>
      React.createElement(
        "div",
        {
          key: t.id,
          className:
            "max-w-sm rounded-lg border bg-[hsl(var(--background))] px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2",
        },
        [
          t.title &&
            React.createElement(
              "p",
              { key: "title", className: "font-medium text-[hsl(var(--foreground))]" },
              t.title
            ),
          t.description &&
            React.createElement(
              "p",
              { key: "desc", className: "text-sm text-[hsl(var(--muted-foreground))]" },
              t.description
            ),
        ]
      )
    )
  );
}

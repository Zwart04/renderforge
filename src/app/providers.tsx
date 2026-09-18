"use client";

import { AppProvider } from "@/lib/app-context";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast-provider";
import { useState, useEffect, ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ToastProvider>
          {mounted ? children : null}
        </ToastProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

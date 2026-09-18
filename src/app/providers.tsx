"use client";

import { AppProvider } from "@/lib/app-context";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {mounted ? children : null}
      </ThemeProvider>
    </AppProvider>
  );
}

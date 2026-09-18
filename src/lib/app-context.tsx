"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "en" | "id";

interface User {
  email: string;
  name: string;
}

interface AppContextType {
  mounted: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);

    try {
      const storedUser = localStorage.getItem("hf_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const storedUsers = localStorage.getItem("hf_users");
        if (storedUsers) {
          const users: Record<string, User> = JSON.parse(storedUsers);
          const firstKey = Object.keys(users)[0];
          if (firstKey) {
            setUser(users[firstKey]);
            localStorage.setItem("hf_user", JSON.stringify(users[firstKey]));
          }
        }
      }

      const storedLocale = localStorage.getItem("rf_locale") as Locale;
      if (storedLocale === "en" || storedLocale === "id") {
        setLocale(storedLocale);
      }

      const storedTheme = localStorage.getItem("rf_theme") as "light" | "dark";
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("rf_theme", next);
  };

  const updateLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("rf_locale", newLocale);
  };

  return (
    <AppContext.Provider
      value={{
        mounted,
        user,
        setUser,
        locale,
        setLocale: updateLocale,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

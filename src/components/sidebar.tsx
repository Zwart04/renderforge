import { useToast } from "@/components/ui/toast-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Terminal,
  GitBranch,
  Image,
  BarChart3,
  DollarSign,
  Settings,
  Download,
  Link2,
  LogOut,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav_dashboard" },
  { href: "/playground", icon: Terminal, labelKey: "nav_playground" },
  { href: "/graph", icon: GitBranch, labelKey: "nav_graph" },
  { href: "/gallery", icon: Image, labelKey: "nav_gallery" },
  { href: "/export", icon: Download, labelKey: "nav_export" },
  { href: "/analytics", icon: BarChart3, labelKey: "nav_analytics" },
  { href: "/finance", icon: DollarSign, labelKey: "nav_finance" },
  { href: "/settings", icon: Settings, labelKey: "nav_settings" },
];

export default function Sidebar({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const pathname = usePathname();
  const { locale, theme, toggleTheme, user } = useApp();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = {
    nav_dashboard: locale === "id" ? "Dasbor" : "Dashboard",
    nav_playground: locale === "id" ? "Area Main" : "Playground",
    nav_graph: locale === "id" ? "Editor Graf" : "Graph Editor",
    nav_gallery: locale === "id" ? "Galeri" : "Gallery",
    nav_export: locale === "id" ? "Ekspor" : "Export",
    nav_analytics: locale === "id" ? "Analitik" : "Analytics",
    nav_finance: locale === "id" ? "Keuangan" : "Finance",
    nav_settings: locale === "id" ? "Pengaturan" : "Settings",
    nav_logout: locale === "id" ? "Keluar" : "Log Out",
    nav_share: locale === "id" ? "Bagikan" : "Share",
    lang_en: locale === "id" ? "English" : "Bahasa Indonesia",
    lang_id: locale === "id" ? "Bahasa Indonesia" : "English",
    theme_light: locale === "id" ? "Terang" : "Light",
    theme_dark: locale === "id" ? "Gelap" : "Dark",
  };

  // Close lang menu on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Track attribution on first visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const source = params.get("utm_source") || "direct";
        const medium = params.get("utm_medium") || "none";
        if (!localStorage.getItem("rf_source")) {
          localStorage.setItem("rf_source", `${source}/${medium}`);
          const stored = JSON.parse(localStorage.getItem("rf_attribution") || "[]");
          const existing = stored.find(
            (s: { source: string; medium: string }) => s.source === source && s.medium === medium
          );
          if (existing) {
            existing.count += 1;
          } else {
            stored.push({ source, medium, count: 1 });
          }
          localStorage.setItem("rf_attribution", JSON.stringify(stored));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 h-full w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] z-50 transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
              <rect width="32" height="32" rx="6" fill={`hsl(var(--primary))`} />
              <path
                d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z"
                stroke={`hsl(var(--primary-foreground))`}
                strokeWidth="2"
                fill="none"
              />
              <circle cx="16" cy="16" r="3" fill={`hsl(var(--primary-foreground))`} />
            </svg>
            <span className="font-semibold text-[hsl(var(--foreground))]">RenderForge</span>
          </Link>
          <button
            className="lg:hidden p-1 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                onNavigate?.(item.href);
                setMobileOpen(false);
              }}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
              ].join(" ")}
            >
              <item.icon size={18} />
              {t[item.labelKey as keyof typeof t]}
              {isActive(item.href) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))] text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>

          {/* Share button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mb-2 text-[hsl(var(--foreground))] border-[hsl(var(--border))] bg-transparent"
            onClick={() => {
              const url = window.location.href;
              if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                  toast({
                    title: locale === "id" ? "Tautan disalin" : "Link copied",
                    description: locale === "id" ? "Bagikan ke teman Anda" : "Share with your friends",
                  });
                });
              }
              const wa = `https://wa.me/?text=${encodeURIComponent(url)}`;
              window.open(wa, "_blank");
            }}
          >
            <Link2 size={14} className="mr-1" />
            {t.nav_share}
          </Button>

          {/* Language + Theme row */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <Globe size={14} />
                {locale === "id" ? "ID" : "EN"}
              </button>
              {langMenuOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-36 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg p-1">
                  <button
                    onClick={() => {
                      setLangMenuOpen(false);
                      if (locale === "id") {
                        localStorage.setItem("rf_locale", "en");
                      } else {
                        localStorage.setItem("rf_locale", "id");
                      }
                      window.location.reload();
                    }}
                    className={[
                      "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                      locale === "id"
                        ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary))/10]"
                        : "text-[hsl(var(--muted-foreground))]",
                    ].join(" ")}
                  >
                    {t.lang_en}
                  </button>
                  <button
                    onClick={() => {
                      setLangMenuOpen(false);
                      if (locale === "id") {
                        localStorage.setItem("rf_locale", "id");
                      } else {
                        localStorage.setItem("rf_locale", "en");
                      }
                      window.location.reload();
                    }}
                    className={[
                      "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                      locale !== "id"
                        ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary))/10]"
                        : "text-[hsl(var(--muted-foreground))]",
                    ].join(" ")}
                  >
                    {t.lang_id}
                  </button>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              title={theme === "dark" ? t.theme_dark : t.theme_light}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout */}
            <form action="/auth/logout" method="post">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="px-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive-foreground))]"
              >
                <LogOut size={16} />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} className="text-[hsl(var(--foreground))]" />
      </button>
    </>
  );
}

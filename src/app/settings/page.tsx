"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/components/ui/toast-provider";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Globe,
  User,
  Shield,
  Palette,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { locale, theme, toggleTheme, user } = useApp();
  const { toast } = useToast();
  const [localTheme, setLocalTheme] = useState("dark");
  const [localLocale, setLocalLocale] = useState<"en" | "id">("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mounted) {
      setLocalTheme(theme);
      setLocalLocale(locale);
    }
  }, [theme, locale, mounted]);

  const t = {
    title: locale === "id" ? "Pengaturan" : "Settings",
    subtitle: locale === "id" ? "Atur preferensi akun dan tampilan" : "Configure your account and display preferences",
    appearance: locale === "id" ? "Tampilan" : "Appearance",
    language: locale === "id" ? "Bahasa" : "Language",
    account: locale === "id" ? "Akun" : "Account",
    themeLight: locale === "id" ? "Terang" : "Light",
    themeDark: locale === "id" ? "Gelap" : "Dark",
    localeEn: locale === "id" ? "English" : "Inggris",
    localeId: locale === "id" ? "Bahasa Indonesia" : "Bahasa Indonesia",
    email: locale === "id" ? "Email" : "Email",
    name: locale === "id" ? "Nama" : "Name",
    about: locale === "id" ? "Tentang" : "About",
    version: "1.0.0",
    build: locale === "id" ? "Build GPU Compute" : "GPU Compute Build",
    saved: locale === "id" ? "Berhasil disimpan" : "Saved successfully",
    accountSecured: locale === "id" ? "Akun dilindungi dengan lokal-first authentication" : "Account protected with local-first authentication",
    interfaceLanguage: locale === "id" ? "Bahasa antarmuka" : "Interface language",
    theme: locale === "id" ? "Tema" : "Theme",
  };

  const handleThemeChange = () => {
    const newTheme = localTheme === "light" ? "dark" : "light";
    setLocalTheme(newTheme);
    localStorage.setItem("rf_theme", newTheme);
    toggleTheme();
  };

  const handleLocaleChange = (value: "en" | "id") => {
    setLocalLocale(value);
    localStorage.setItem("rf_locale", value);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (localTheme !== theme) {
      // Already handled by toggleTheme
    }
    if (localLocale !== locale) {
      window.location.reload();
    }
    setSaving(false);
    toast({ title: t.saved });
  };

  // Sync local state with props when they change
  useEffect(() => {
    setLocalTheme(theme);
    setLocalLocale(locale);
  }, [theme, locale]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            {t.title}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))] flex items-center gap-2">
                <Palette size={18} />
                {t.appearance}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {localTheme === "light" ? (
                    <Sun size={18} className="text-[hsl(142, 91%, 60%)]" />
                  ) : (
                    <Moon size={18} className="text-[hsl(var(--muted-foreground))]" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {t.theme}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {localTheme === "light" ? t.themeLight : t.themeDark}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleThemeChange}
                  className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  {localTheme === "light" ? (
                    <>
                      <Moon size={14} className="mr-1" />
                      {t.themeDark}
                    </>
                  ) : (
                    <>
                      <Sun size={14} className="mr-1" />
                      {t.themeLight}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))] flex items-center gap-2">
                <Globe size={18} />
                {t.language}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-[hsl(var(--muted-foreground))]" />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {t.interfaceLanguage}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {localLocale === "id" ? t.localeId : t.localeEn}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={localLocale === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLocaleChange("en")}
                    className={
                      localLocale === "en"
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                        : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                    }
                  >
                    EN
                  </Button>
                  <Button
                    variant={localLocale === "id" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLocaleChange("id")}
                    className={
                      localLocale === "id"
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                        : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                    }
                  >
                    ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))] flex items-center gap-2">
                <User size={18} />
                {t.account}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))] text-xl font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--foreground))]">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {user?.email || "user@renderforge.dev"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-[hsl(var(--foreground))] text-sm">{t.email}</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[hsl(var(--foreground))] text-sm">{t.name}</Label>
                  <Input
                    value={user?.name || ""}
                    disabled
                    className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[hsl(var(--border))] mt-4">
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <Shield size={14} />
                  <span>{t.accountSecured}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.about}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <p className="text-[hsl(var(--foreground))] font-medium">
                  RenderForge - GPU Compute Shader Playground
                </p>
                <p>v{t.version} - {t.build}</p>
                <p className="pt-2">
                  {locale === "id"
                    ? "Tools visualisasi GPU berbasis WebGPU untuk komputasi paralel real-time di browser."
                    : "GPU visualization tools based on WebGPU for real-time parallel computing in browser."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || (localTheme === theme && localLocale === locale)}
              className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  {locale === "id" ? "Menyimpan..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1" />
                  {t.saved}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

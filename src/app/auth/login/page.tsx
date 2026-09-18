"use client";

import { useToast } from "@/components/ui/toast-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-context";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, locale } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    title: locale === "id" ? "Masuk ke RenderForge" : "Sign in to RenderForge",
    subtitle: locale === "id" ? "Akses ruang kerja GPU compute Anda" : "Access your GPU compute workspace",
    email: locale === "id" ? "Alamat email" : "Email address",
    password: locale === "id" ? "Kata sandi" : "Password",
    submit: locale === "id" ? "Masuk" : "Sign in",
    noAccount: locale === "id" ? "Belum punya akun?" : "Don't have an account?",
    haveAccount: locale === "id" ? "Sudah punya akun?" : "Already have an account?",
    invalidEmail: locale === "id" ? "Masukkan email yang valid" : "Please enter a valid email",
    shortPassword: locale === "id" ? "Kata sandi minimal 8 karakter" : "Password must be at least 8 characters",
  };

  const validate = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(t.invalidEmail);
      return false;
    }
    if (password.length < 8) {
      setError(t.shortPassword);
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    try {
      const stored = localStorage.getItem("hf_users");
      const users = stored ? JSON.parse(stored) : {};
      const found = users[email.toLowerCase()];
      if (found) {
        setUser(found);
        localStorage.setItem("hf_user", JSON.stringify(found));
        toast({
          title: locale === "id" ? "Berhasil masuk" : "Sign in successful",
        });
        router.push("/dashboard");
      } else {
        setError(locale === "id" ? "Email tidak terdaftar" : "Email not registered");
      }
    } catch {
      setError(locale === "id" ? "Kesalahan autentikasi" : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(var(--background))]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg viewBox="0 0 32 32" className="w-10 h-10" fill="none">
            <rect width="32" height="32" rx="6" fill={`hsl(var(--primary))`} />
            <path
              d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z"
              stroke={`hsl(var(--primary-foreground))`}
              strokeWidth="2"
              fill="none"
            />
            <circle cx="16" cy="16" r="3" fill={`hsl(var(--primary-foreground))`} />
          </svg>
          <span className="text-xl font-semibold text-[hsl(var(--foreground))]">
            RenderForge
          </span>
        </div>

        {/* Card */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-center text-[hsl(var(--foreground))] mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">
            {t.subtitle}
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-[hsl(var(--destructive-foreground))] bg-[hsl(var(--destructive))/10] rounded-lg border border-[hsl(var(--destructive))]">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(var(--foreground))]">
                {t.email}
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="pl-9 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(var(--foreground))]">
                {t.password}
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pl-9 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="60"
                      strokeLinecap="round"
                    />
                  </svg>
                  {locale === "id" ? "Memproses..." : "Processing..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t.submit}
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            <a
              href="/auth/register"
              className="text-[hsl(var(--primary))] hover:underline font-medium"
            >
              {t.noAccount}
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
          {locale === "id"
            ? "Demo: gunakan email yang terdaftar atau daftar baru"
            : "Demo: use a registered email or register new"}
        </p>
      </div>
    </div>
  );
}

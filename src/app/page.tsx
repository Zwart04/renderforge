"use client";

import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Play,
  Code2,
  GitBranch,
  BarChart3,
  Download,
  Layers,
  Zap,
  Wifi,
} from "lucide-react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { locale } = useApp();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background))/90 backdrop-blur-lg border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                {locale === "id" ? "Masuk" : "Sign in"}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90]">
                {locale === "id" ? "Daftar" : "Register"}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--primary))/10] border border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] text-sm mb-6">
            <Zap size={14} />
            {locale === "id" ? "WebGPU Ready" : "WebGPU Ready"}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[hsl(var(--foreground))] leading-tight mb-6">
            {locale === "id"
              ? "GPU Compute. Real-Time Canvas. Tanpa Instalasi."
              : "GPU Compute. Real-Time Canvas. Zero Install."}
          </h1>
          <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-8">
            {locale === "id"
              ? "Tulis shader compute, bangun graf aliran data, dan render visualisasi langsung — semuanya di browser Anda."
              : "Write compute shaders, build data flow graphs, and render live visualizations — all in your browser."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] px-8">
                <Play size={18} className="mr-2" />
                {locale === "id" ? "Buka Ruang Kerja" : "Launch Workspace"}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] px-8">
                {locale === "id" ? "Daftar Sekarang" : "Register Now"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo canvas */}
      <section className="py-12 px-6 bg-[hsl(var(--muted))/30">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0f] aspect-video shadow-2xl">
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            {/* Canvas element */}
            <canvas
              id="hero-canvas"
              className="absolute inset-0 w-full h-full"
              width={1200}
              height={675}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))]/80 via-transparent to-transparent" />
            {/* Badge on canvas */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] text-sm">
                <Wifi size={14} className="text-[hsl(142, 91%, 60%)]" />
                <span className="text-[hsl(var(--foreground))]">
                  {locale === "id" ? "WebGPU Compute" : "WebGPU Compute"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] text-sm">
                <Layers size={14} className="text-[hsl(var(--primary))]" />
                <span className="text-[hsl(var(--foreground))]">
                  {locale === "id" ? "Real-time 60fps" : "Real-time 60fps"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[hsl(var(--foreground))] mb-3">
              {locale === "id" ? "Fitur" : "Features"}
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">
              {locale === "id"
                ? "Semua fitur yang Anda butuhkan untuk komputasi GPU di browser"
                : "Everything you need for GPU computing in the browser"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Code2}
              title={locale === "id" ? "Editor Shader Compute GPU" : "GPU Compute Shader Editor"}
              desc={
                locale === "id"
                  ? "Tulis shader WGSL dengan preview langsung. Target 60fps dengan sorotan kesalahan inline."
                  : "Write WGSL shaders with live preview. 60fps target with inline error highlighting."
              }
              colorClass="bg-blue-500"
            />
            <FeatureCard
              icon={GitBranch}
              title={locale === "id" ? "Editor Graf Aliran Data" : "Node-Based Data Flow Graph"}
              desc={
                locale === "id"
                  ? "Pipeline compute drag-and-drop dengan node sumber, transformasi, dan tujuan."
                  : "Drag-and-drop compute pipeline with source, transform, and sink nodes."
              }
              colorClass="bg-purple-500"
            />
            <FeatureCard
              icon={Wifi}
              title={locale === "id" ? "Kanvas WebGL Real-Time" : "Real-Time WebGL Canvas"}
              desc={
                locale === "id"
                  ? "Multi-layer compositing, transisi crossfade, dan overlay timestamp zona waktu WIB."
                  : "Multi-layer compositing, crossfade transitions, and WIB timezone-aware timestamp overlay."
              }
              colorClass="bg-green-500"
            />
            <FeatureCard
              icon={Download}
              title={locale === "id" ? "Pipeline Ekspor Batch" : "Batch Export Pipeline"}
              desc={
                locale === "id"
                  ? "Ekspor ke MP4/WebM, urutan PNG, atau data CSV/JSON — semuanya di sisi klien."
                  : "Export to MP4/WebM, PNG sequence, or CSV/JSON data — all client-side."
              }
              colorClass="bg-orange-500"
            />
            <FeatureCard
              icon={Layers}
              title={locale === "id" ? "Sesi Kolaboratif" : "Collaborative Sessions"}
              desc={
                locale === "id"
                  ? "Bagikan status ruang kerja via URL. Sinkronisasi multi-tab dengan BroadcastChannel API."
                  : "Share workspace state via URL. Multi-tab sync with BroadcastChannel API."
              }
              colorClass="bg-pink-500"
            />
            <FeatureCard
              icon={BarChart3}
              title={locale === "id" ? "Analitik & Atribusi" : "Analytics & Attribution"}
              desc={
                locale === "id"
                  ? "Lacak sumber UTM, statistik sesi, dan jumlah ekspor — tanpa pelacakan pihak ketiga."
                  : "Track UTM sources, session stats, and export counts — no third-party tracking."
              }
              colorClass="bg-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* Gallery + Dashboard mini */}
      <section className="py-20 px-6 bg-[hsl(var(--muted))/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-2">
              {locale === "id" ? "Galeri Template" : "Template Gallery"}
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {locale === "id"
                ? "Eksplor preset shader dan graf yang dibuat komunitas"
                : "Explore shader presets and graphs created by the community"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Particle Fever", color: "from-purple-500 to-pink-500" },
                { label: "Mandelbrot Set", color: "from-blue-500 to-cyan-500" },
                { label: "Neon Waves", color: "from-orange-500 to-yellow-500" },
                { label: "Flower Growth", color: "from-green-500 to-emerald-500" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl bg-gradient-to-br ${item.color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer group`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview */}
          <div>
            <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-2">
              {locale === "id" ? "Dasbor" : "Dashboard"}
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {locale === "id"
                ? "Ringkasan aktivitas RenderForge Anda"
                : "Your RenderForge activity summary"}
            </p>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: locale === "id" ? "Sesi" : "Sessions", value: "92", color: "text-blue-500" },
                  { label: locale === "id" ? "Ekspor" : "Exports", value: "58", color: "text-green-500" },
                  { label: "GPU", value: "67%", color: "text-orange-500" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-3 rounded-lg bg-[hsl(var(--muted))]">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* Mini chart */}
              <div className="h-20 flex items-end justify-between gap-1">
                {[40, 65, 45, 80, 55, 70, 90].map((h, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t bg-[hsl(var(--primary))] transition-all hover:bg-[hsl(var(--primary))/80]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <h2 className="text-3xl font-bold mb-4">
              {locale === "id" ? "Siap Memulai?" : "Ready to Get Started?"}
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-lg mx-auto">
              {locale === "id"
                ? "Bergabung dengan komunitas creative coder dan data viz engineer."
                : "Join the creative coder and data viz engineer community."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-foreground))/90]"
                >
                  {locale === "id" ? "Daftar Sekarang" : "Register Now"}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))]/10"
                >
                  {locale === "id" ? "Buka Ruang Kerja" : "Launch Workspace"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <rect width="32" height="32" rx="6" fill={`hsl(var(--primary))`} />
              <path
                d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z"
                stroke={`hsl(var(--primary-foreground))`}
                strokeWidth="2"
                fill="none"
              />
              <circle cx="16" cy="16" r="3" fill={`hsl(var(--primary-foreground))`} />
            </svg>
            <span className="font-semibold text-[hsl(var(--foreground))]">
              RenderForge
            </span>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center md:text-left">
            {locale === "id"
              ? "RenderForge dibangun dengan Next.js 16, TypeScript, Tailwind v4, dan WebGPU."
              : "RenderForge built with Next.js 16, TypeScript, Tailwind v4, and WebGPU."}
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {locale === "id"
              ? "2026 RenderForge. Dibuat dengan jelas."
              : "2026 RenderForge. Built with clarity."}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Feature card sub-component
function FeatureCard({
  icon: Icon,
  title,
  desc,
  colorClass,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  colorClass: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--primary))] transition-colors">
        <Icon size={24} className={`${colorClass} text-white`} />
      </div>
      <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        {desc}
      </p>
    </div>
  );
}

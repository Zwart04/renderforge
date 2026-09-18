"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/components/ui/toast-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Clock,
  Target,
  TrendingUp,
  Play,
  Download,
  Users,
  BarChart3,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

interface SessionStat {
  date: string;
  sessions: number;
  exports: number;
  activeNodes: number;
}

const WEEKLY_STATS: SessionStat[] = [
  { date: "Sen", sessions: 12, exports: 8, activeNodes: 45 },
  { date: "Sel", sessions: 18, exports: 12, activeNodes: 62 },
  { date: "Rab", sessions: 15, exports: 10, activeNodes: 55 },
  { date: "Kam", sessions: 22, exports: 15, activeNodes: 78 },
  { date: "Jum", sessions: 20, exports: 14, activeNodes: 70 },
  { date: "Sab", sessions: 25, exports: 18, activeNodes: 85 },
  { date: "Min", sessions: 19, exports: 13, activeNodes: 68 },
];

const ACTIVITY_ITEMS = [
  { icon: Download, color: "text-green-500", msgKey: "exportComplete", time: "2 menit yang lalu" },
  { icon: Play, color: "text-blue-500", msgKey: "graphRun", time: "15 menit yang lalu" },
  { icon: Sparkles, color: "text-purple-500", msgKey: "shaderCompiled", time: "1 jam yang lalu" },
  { icon: ImageIcon, color: "text-orange-500", msgKey: "presetDownloaded", time: "2 jam yang lalu" },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { locale } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");

  const t = {
    welcome: locale === "id" ? "Selamat datang kembali" : "Welcome back",
    subtitle: locale === "id" ? "Ringkasan aktivitas RenderForge Anda" : "Your RenderForge activity summary",
    sessions: locale === "id" ? "Sesi" : "Sessions",
    exports: locale === "id" ? "Ekspor" : "Exports",
    activeNodes: locale === "id" ? "Node Aktif" : "Active Nodes",
    gpuUsage: locale === "id" ? "Penggunaan GPU" : "GPU Usage",
    project: locale === "id" ? "Proyek" : "Project",
    status: locale === "id" ? "Status" : "Status",
    running: locale === "id" ? "Berjalan" : "Running",
    thisWeek: locale === "id" ? "Minggu ini" : "This week",
    avgSession: locale === "id" ? "Rata-rata Durasi Sesi" : "Avg Session Duration",
    openWorkspace: locale === "id" ? "Buka Ruang Kerja" : "Open Workspace",
    openPlayground: locale === "id" ? "Buka Area Main" : "Open Playground",
    openGraph: locale === "id" ? "Buka Editor Graf" : "Open Graph Editor",
    openGallery: locale === "id" ? "Buka Galeri" : "Open Gallery",
    recentActivity: locale === "id" ? "Aktivitas Terbaru" : "Recent Activity",
    exportComplete: locale === "id" ? "Ekspor selesai" : "Export complete",
    graphRun: locale === "id" ? "Pipeline berjalan" : "Pipeline running",
    shaderCompiled: locale === "id" ? "Shader dikompilasi" : "Shader compiled",
    presetDownloaded: locale === "id" ? "Preset diunduh" : "Preset downloaded",
    minutesAverage: locale === "id" ? "menit rata-rata" : "minutes average",
    today: locale === "id" ? `Hari ini: ` : `Today: `,
    fromLastWeek: locale === "id" ? " dari minggu lalu" : " from last week",
  };

  const totalSessions = WEEKLY_STATS.reduce((sum, d) => sum + d.sessions, 0);
  const totalExports = WEEKLY_STATS.reduce((sum, d) => sum + d.exports, 0);
  const avgSessionDuration = 24;
  const lastStat = WEEKLY_STATS[WEEKLY_STATS.length - 1];
  const firstStat = WEEKLY_STATS[0];

  useEffect(() => {
    toast({
      title: locale === "id" ? "Selamat datang di RenderForge" : "Welcome to RenderForge",
      description: locale === "id" ? "Ruang kerja GPU Anda siap" : "Your GPU workspace is ready",
    });
  }, [locale, toast]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
              {t.welcome}, Pengguna
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[hsl(142, 91%, 60% / 20%)] text-[hsl(142, 91%, 60%)]">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              {t.running}
            </Badge>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Button
            variant="outline"
            className="h-auto p-4 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-left hover:bg-[hsl(var(--muted))]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
                <Play size={20} className="text-[hsl(var(--primary-foreground))]" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">{t.openWorkspace}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Menuju editor" : "Go to editor"}</p>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-left hover:bg-[hsl(var(--muted))]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">{t.openPlayground}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Shader editor" : "Shader editor"}</p>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-left hover:bg-[hsl(var(--muted))]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">{t.openGraph}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Node editor" : "Node editor"}</p>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-left hover:bg-[hsl(var(--muted))]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <ImageIcon size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">{t.openGallery}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Template preset" : "Template presets"}</p>
              </div>
            </div>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.sessions}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">{totalSessions}</p>
                  <p className="text-xs text-green-500 mt-1">{t.fromLastWeek}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users size={24} className="text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.exports}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">{totalExports}</p>
                  <p className="text-xs text-green-500 mt-1">{t.fromLastWeek}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Download size={24} className="text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.activeNodes}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">{lastStat.activeNodes}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {t.today}{firstStat.activeNodes}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity size={24} className="text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.gpuUsage}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">67%</p>
                  <div className="mt-2">
                    <Progress value={67} className="h-2 bg-[hsl(var(--muted))]" />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.thisWeek}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-2">
                {WEEKLY_STATS.map((stat, idx) => {
                  const maxVal = Math.max(...WEEKLY_STATS.map((s) => s.sessions));
                  const height = (stat.sessions / maxVal) * 100;
                  const isToday = idx === WEEKLY_STATS.length - 1;
                  return (
                    <div key={stat.date} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{stat.sessions}</span>
                      <div
                        className={[
                          "w-full rounded-t-lg transition-all",
                          isToday ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]",
                        ].join(" ")}
                        style={{ height: `${height}%`, minHeight: "8px" }}
                      />
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{stat.date}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[hsl(var(--primary))]" />
                  <span className="text-[hsl(var(--foreground))]">{t.sessions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[hsl(var(--muted))]" />
                  <span className="text-[hsl(var(--muted-foreground))]">{t.exports}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.avgSession}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
                  <Clock size={32} className="text-[hsl(var(--primary-foreground))]" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))]">{avgSessionDuration}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.minutesAverage}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t.project}</span>
                  <span className="text-[hsl(var(--foreground))] font-medium">GPU Compute Playground</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{t.status}</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                    {t.running}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Node terakhir" : "Last node"}</span>
                  <span className="text-[hsl(var(--foreground))]">Wave Pattern v2.1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity feed */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[hsl(var(--foreground))]">{t.recentActivity}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(activeTab === "overview" ? "activity" : "overview")}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                {activeTab === "overview" ? t.recentActivity : t.thisWeek}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ACTIVITY_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))]/50 flex items-center justify-center">
                    <item.icon size={16} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[hsl(var(--foreground))]">
                      {item.msgKey === "exportComplete" && t.exportComplete}
                      {item.msgKey === "graphRun" && t.graphRun}
                      {item.msgKey === "shaderCompiled" && t.shaderCompiled}
                      {item.msgKey === "presetDownloaded" && t.presetDownloaded}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

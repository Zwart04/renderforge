"use client";

import { useEffect, useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/components/ui/toast-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Download, RefreshCw, Users } from "lucide-react";

interface AttributionSource {
  source: string;
  medium: string;
  count: number;
}

interface SessionData {
  date: string;
  sessions: number;
  users: number;
}

const COLORS = ["#4fc3f7", "#81c784", "#ffb74d", "#e57373", "#ba68c8", "#4db6ac"];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { locale } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const attributionData = useMemo(() => {
    try {
      if (!mounted) {
        return [
          { source: "direct", medium: "none", count: 1 },
          { source: "wa.me", medium: "share", count: 3 },
          { source: "google", medium: "organic", count: 7 },
        ];
      }
      const stored = localStorage.getItem("rf_attribution");
      if (stored) {
        return JSON.parse(stored) as AttributionSource[];
      }
    } catch {
      // ignore
    }
    return [
      { source: "direct", medium: "none", count: 1 },
      { source: "wa.me", medium: "share", count: 3 },
      { source: "google", medium: "organic", count: 7 },
    ];
  }, []);

  const sessionData: SessionData[] = useMemo(
    () => [
      { date: "Sen", sessions: 12, users: 8 },
      { date: "Sel", sessions: 18, users: 14 },
      { date: "Rab", sessions: 15, users: 11 },
      { date: "Kam", sessions: 22, users: 17 },
      { date: "Jum", sessions: 20, users: 15 },
      { date: "Sab", sessions: 25, users: 19 },
      { date: "Min", sessions: 19, users: 14 },
    ],
    []
  );

  const totals = useMemo(() => {
    const totalSessions = sessionData.reduce((sum, d) => sum + d.sessions, 0);
    const totalUsers = sessionData.reduce((sum, d) => sum + d.users, 0);
    const totalExports = attributionData.reduce((sum, d) => sum + d.count, 0);
    return { totalSessions, totalUsers, totalExports };
  }, [sessionData, attributionData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    title: locale === "id" ? "Analitik" : "Analytics",
    subtitle: locale === "id" ? "Statistik traffic dan atribusi sumber" : "Traffic statistics and source attribution",
    sessions: locale === "id" ? "Sesi" : "Sessions",
    users: locale === "id" ? "Pengguna" : "Users",
    sources: locale === "id" ? "Sumber Traffic" : "Traffic Sources",
    exports: locale === "id" ? "Ekspor" : "Exports",
    noData: locale === "id" ? "Tidak ada data atribusi" : "No attribution data",
    refresh: locale === "id" ? "Muat ulang" : "Refresh",
    exportCsv: locale === "id" ? "Ekspor CSV" : "Export CSV",
    thisWeek: locale === "id" ? "Minggu ini" : "This week",
    totalLabel: locale === "id" ? "Total" : "Total",
    sessionsLabel: locale === "id" ? "Sesi" : "Sessions",
    usersLabel: locale === "id" ? "Pengguna" : "Users",
  };

  const handleExportCSV = () => {
    const header = ["Source", "Medium", "Count"];
    const rows = attributionData.map((d) => [d.source, d.medium, String(d.count)]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renderforge-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: locale === "id" ? "Data diekspor" : "Data exported" });
  };

  const totalAttribution = attributionData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
              {t.title}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
            >
              <Download size={14} className="mr-1" />
              {t.exportCsv}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoading(true)}
              className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
            >
              <RefreshCw size={14} className="mr-1" />
              {t.refresh}
            </Button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.sessions}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">
                    {totals.totalSessions}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 size={24} className="text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.users}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">
                    {totals.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Users size={24} className="text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.exports}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">
                    {totals.totalExports}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.sources}</p>
                  <p className="text-3xl font-semibold text-[hsl(var(--foreground))] mt-1">
                    {attributionData.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <BarChart3 size={24} className="text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.thisWeek}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <RefreshCw size={24} className="text-[hsl(var(--muted-foreground))] animate-spin" />
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="sessions"
                        name={t.sessionsLabel}
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="users"
                        name={t.usersLabel}
                        fill="hsl(142, 91%, 60%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attribution pie chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.sources}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <RefreshCw size={24} className="text-[hsl(var(--muted-foreground))] animate-spin" />
                </div>
              ) : attributionData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-[hsl(var(--muted-foreground))]">
                  <BarChart3 size={32} className="mb-2 opacity-50" />
                  <p>{t.noData}</p>
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                        label={(entry: any) => {
                          const pct =
                            totalAttribution > 0
                              ? ((entry.count / totalAttribution) * 100).toFixed(0)
                              : "0";
                          return `${entry.source} ${pct}%`;
                        }}
                        labelLine={false}
                      >
                        {attributionData.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* Source list */}
              <div className="mt-4 space-y-2">
                {attributionData.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-[hsl(var(--foreground))] truncate">
                        {source.source}
                      </span>
                      <span className="text-[hsl(var(--muted-foreground))]">
                        / {source.medium}
                      </span>
                    </div>
                    <span className="text-[hsl(var(--foreground))] font-medium ml-2">
                      {source.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic sources bar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">{t.sources}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attributionData.slice(0, 5).map((source, idx) => {
                  const maxCount = Math.max(
                    ...attributionData.map((d) => d.count),
                    1
                  );
                  const percentage = (source.count / maxCount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[hsl(var(--muted-foreground))] truncate">
                          {source.source} / {source.medium}
                        </span>
                        <span className="text-[hsl(var(--foreground))] font-medium">
                          {source.count}
                        </span>
                      </div>
                      <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[hsl(var(--primary))] transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { useToast } from "@/components/ui/toast-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Plus,
  Trash2,
  Tag,
  Receipt,
  TrendingUp,
  Download,
} from "lucide-react";

interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  source: "auto-task" | "auto-vendor" | "manual";
  category: string;
}

const SAMPLE_ENTRIES: FinanceEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    description: "GPU Compute Export - PNG Sequence",
    amount: 450000,
    source: "auto-task",
    category: "Export",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000).toISOString(),
    description: "Shader Template - Commercial License",
    amount: 750000,
    source: "auto-vendor",
    category: "License",
  },
  {
    id: "3",
    date: new Date(Date.now() - 172800000).toISOString(),
    description: "WebGPU Workshop Registration",
    amount: 250000,
    source: "manual",
    category: "Education",
  },
  {
    id: "4",
    date: new Date(Date.now() - 259200000).toISOString(),
    description: "RenderForge Pro Subscription",
    amount: 1500000,
    source: "auto-task",
    category: "Subscription",
  },
];

export default function FinancePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { locale } = useApp();
  const { toast } = useToast();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<FinanceEntry>>({
    description: "",
    amount: 0,
    source: "manual",
    category: "",
  });

  useEffect(() => {
    if (mounted) {
      try {
        const stored = localStorage.getItem("rf_finance");
        if (stored) {
          setEntries(JSON.parse(stored) as FinanceEntry[]);
        } else {
          setEntries([...SAMPLE_ENTRIES]);
        }
      } catch {
        setEntries([...SAMPLE_ENTRIES]);
      }
    }
  }, [mounted]);

  const total = entries.reduce((acc, e) => acc + e.amount, 0);
  const autoTaskTotal = entries
    .filter((e) => e.source === "auto-task")
    .reduce((acc, e) => acc + e.amount, 0);
  const autoVendorTotal = entries
    .filter((e) => e.source === "auto-vendor")
    .reduce((acc, e) => acc + e.amount, 0);

  const t = {
    title: locale === "id" ? "Jurnal Keuangan" : "Finance Journal",
    subtitle: locale === "id" ? "Catatan keuangan dan tag otomatis" : "Financial records and auto-tagging",
    entries: locale === "id" ? "Entri Jurnal" : "Journal Entries",
    total: locale === "id" ? "Total" : "Total",
    addEntry: locale === "id" ? "Tambah Entri" : "Add Entry",
    description: locale === "id" ? "Deskripsi" : "Description",
    amount: locale === "id" ? "Jumlah (Rp)" : "Amount (Rp)",
    source: locale === "id" ? "Sumber" : "Source",
    category: locale === "id" ? "Kategori" : "Category",
    sourceAutoTask: locale === "id" ? "Auto-Tugas" : "Auto-Task",
    sourceAutoVendor: locale === "id" ? "Auto-Vendor" : "Auto-Vendor",
    sourceManual: locale === "id" ? "Manual" : "Manual",
    noEntries: locale === "id" ? "Belum ada entri keuangan" : "No finance entries yet",
    addFirstEntry: locale === "id" ? "Tambah entri pertama Anda" : "Add your first entry",
    exportCsv: locale === "id" ? "Ekspor CSV" : "Export CSV",
    autoTagging: locale === "id" ? "Penandaan Otomatis" : "Auto Tagging",
    autoTaskDesc: locale === "id" ? "Tag untuk tugas/ekspor otomatis" : "Tag for auto-tasks/exports",
    autoVendorDesc: locale === "id" ? "Tag untuk vendor/klien eksternal" : "Tag for external vendors/clients",
    totalAutoTask: locale === "id" ? "Total Auto-Tugas" : "Auto-Task Total",
    totalAutoVendor: locale === "id" ? "Total Auto-Vendor" : "Auto-Vendor Total",
    recentEntries: locale === "id" ? "Entri Terbaru" : "Recent Entries",
  };

  const handleAddEntry = () => {
    if (!newEntry.description?.trim() || !newEntry.amount || !newEntry.category?.trim()) {
      toast({ title: locale === "id" ? "Data tidak lengkap" : "Incomplete data" });
      return;
    }
    const entry: FinanceEntry = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      description: newEntry.description!,
      amount: newEntry.amount || 0,
      source: newEntry.source as FinanceEntry["source"],
      category: newEntry.category!,
    };
    setEntries((prev) => {
      const next = [entry, ...prev];
      try {
        localStorage.setItem("rf_finance", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
    setNewEntry({ description: "", amount: 0, source: "manual", category: "" });
    setShowAddForm(false);
    toast({
      title: locale === "id" ? "Entri ditambahkan" : "Entry added",
      description: entry.description,
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem("rf_finance", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
    toast({
      title: locale === "id" ? "Entri dihapus" : "Entry deleted",
    });
  };

  const handleExportCSV = () => {
    const header = ["Date", "Description", "Amount", "Source", "Category"];
    const rows = entries.map((e) => [
      e.date.split("T")[0],
      e.description,
      e.amount.toLocaleString("id-ID"),
      e.source,
      e.category,
    ]);
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renderforge-finance.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: locale === "id" ? "Data diekspor" : "Data exported" });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
              {t.title}
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {t.subtitle}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
          >
            <Download size={14} className="mr-1" />
            {t.exportCsv}
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.total}</p>
                  <p className="text-3xl font-bold text-[hsl(var(--foreground))] mt-1">
                    Rp {total.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.totalAutoTask}</p>
                  <p className="text-xl font-semibold text-blue-500 mt-1">
                    Rp {autoTaskTotal.toLocaleString("id-ID")}
                  </p>
                </div>
                <Tag className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500" size={20} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{t.totalAutoVendor}</p>
                  <p className="text-xl font-semibold text-orange-500 mt-1">
                    Rp {autoVendorTotal.toLocaleString("id-ID")}
                  </p>
                </div>
                <Receipt className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Auto-tagging info */}
          <Card className="bg-[hsl(var(--primary))]/5 border-[hsl(var(--primary))]/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Tag className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center text-[hsl(var(--primary-foreground))]" size={16} />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{t.autoTagging}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                    {locale === "id"
                      ? `Entri dengan sumber "${t.sourceAutoTask}" otomatis tercatat dari tugas/ekspor. "${t.sourceAutoVendor}" untuk vendor eksternal.`
                      : `Entries with "${t.sourceAutoTask}" source are auto-logged from tasks/exports. "${t.sourceAutoVendor}" for external vendors.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add entry form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[hsl(var(--foreground))] flex items-center gap-2">
                  <Plus size={18} />
                  {t.addEntry}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">{t.description}</Label>
                    <Input
                      value={newEntry.description || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      placeholder={locale === "id" ? "Misal: Penjualan shader batch" : "e.g. Shader batch sale"}
                      className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">{t.amount}</Label>
                    <Input
                      type="number"
                      value={newEntry.amount || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: parseInt(e.target.value) || 0 })}
                      placeholder="450000"
                      className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">{t.source}</Label>
                    <div className="flex gap-2">
                      {(["auto-task", "auto-vendor", "manual"] as const).map((src) => (
                        <Button
                          key={src}
                          variant={newEntry.source === src ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewEntry({ ...newEntry, source: src })}
                          className={
                            newEntry.source === src
                              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                              : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                          }
                        >
                          {src === "auto-task" ? t.sourceAutoTask : src === "auto-vendor" ? t.sourceAutoVendor : t.sourceManual}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">{t.category}</Label>
                    <Input
                      value={newEntry.category || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                      placeholder={locale === "id" ? "Misal: Ekspor, Pendapatan" : "e.g. Export, Revenue"}
                      className="bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={handleAddEntry}
                    className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  >
                    {t.addEntry}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewEntry({ description: "", amount: 0, source: "manual", category: "" });
                    }}
                    className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                  >
                    {locale === "id" ? "Batal" : "Cancel"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Entries list */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[hsl(var(--foreground))] flex items-center gap-2">
                  <DollarSign size={18} />
                  {t.entries}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  <Plus size={14} className="mr-1" />
                  {t.addEntry}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
                  <DollarSign size={32} className="mb-3 opacity-50" />
                  <p className="text-sm">{t.noEntries}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="mt-3 border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                  >
                    <Plus size={14} className="mr-1" />
                    {t.addFirstEntry}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          entry.source === "auto-task"
                            ? "bg-blue-500/20 text-blue-500"
                            : entry.source === "auto-vendor"
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-green-500/20 text-green-500"
                        }`}>
                          {entry.source === "auto-task" ? <Receipt size={16} /> :
                           entry.source === "auto-vendor" ? <Tag size={16} /> :
                           <DollarSign size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                            {entry.description}
                          </p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {new Date(entry.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                            {" · "}
                            <span className="capitalize">{entry.source}</span>
                            {" · "}
                            {entry.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                          Rp {entry.amount.toLocaleString("id-ID")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive-foreground))]"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useToast } from "@/components/ui/toast-provider";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileVideo,
  FileImage,
  FileText,
  Settings,
  Play,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { useState, useRef } from "react";

interface ExportJob {
  id: string;
  format: "mp4" | "png-sequence" | "csv" | "json";
  status: "pending" | "processing" | "complete" | "error" | "cancelled";
  progress: number;
  filename: string;
  startTime?: number;
  endTime?: number;
}

const FORMATS = [
  {
    id: "mp4" as const,
    label: "MP4 Video",
    icon: FileVideo,
    description: "Rendered video with VP9 codec",
    ext: ".mp4",
    estimatedSize: "2-10 MB",
  },
  {
    id: "png-sequence" as const,
    label: "PNG Sequence",
    icon: FileImage,
    description: "High-res frames for post-processing",
    ext: ".png",
    estimatedSize: "50-200 MB",
  },
  {
    id: "csv" as const,
    label: "CSV Data",
    icon: FileText,
    description: "Export node output as spreadsheet",
    ext: ".csv",
    estimatedSize: "10-50 KB",
  },
  {
    id: "json" as const,
    label: "JSON Data",
    icon: FileText,
    description: "Full graph state export",
    ext: ".json",
    estimatedSize: "5-20 KB",
  },
];

export default function ExportPage() {
  const { locale } = useApp();
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<string>("mp4");
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [exporting, setExporting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = {
    title: locale === "id" ? "Pipeline Ekspor" : "Export Pipeline",
    subtitle: locale === "id" ? "Ekspor hasil render dan data graf" : "Export render results and graph data",
    selectFormat: locale === "id" ? "Pilih format" : "Select format",
    estimatedSize: locale === "id" ? "Ukuran estimasi" : "Estimated size",
    export: locale === "id" ? "Mulai Ekspor" : "Start Export",
    cancel: locale === "id" ? "Batal" : "Cancel",
    cancelled: locale === "id" ? "Dibatalkan" : "Cancelled",
    jobQueue: locale === "id" ? "Antrian Ekspor" : "Export Queue",
    queueEmpty: locale === "id" ? "Antrian kosong" : "Queue is empty",
    pending: locale === "id" ? "Pending" : "Pending",
    processing: locale === "id" ? "Memproses..." : "Processing...",
    complete: locale === "id" ? "Selesai" : "Complete",
    error: locale === "id" ? "Gagal" : "Error",
    download: locale === "id" ? "Unduh" : "Download",
    processingTime: locale === "id" ? "Waktu pemrosesan" : "Processing time",
    exportComplete: locale === "id" ? "Ekspor selesai" : "Export complete",
    noJobs: locale === "id" ? "Belum ada ekspor" : "No exports yet",
    clearQueue: locale === "id" ? "Hapus Antrian" : "Clear Queue",
    downloadAll: locale === "id" ? "Unduh Semua" : "Download All",
    status: locale === "id" ? "Status" : "Status",
    progress: locale === "id" ? "Progress" : "Progress",
  };

  const startExport = () => {
    if (exporting) return;

    const format = FORMATS.find((f) => f.id === selectedFormat);
    if (!format) return;

    const job: ExportJob = {
      id: Math.random().toString(36).slice(2),
      format: format.id,
      status: "pending",
      progress: 0,
      filename: `renderforge-export-${Date.now()}${format.ext}`,
      startTime: Date.now(),
    };

    setJobs((prev) => [...prev, job]);
    setExporting(true);

    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: "complete" as const, progress: 100, endTime: Date.now() }
              : j
          )
        );
        setExporting(false);
        toast({
          title: t.exportComplete,
          description: `${format.label} berhasil dibuat`,
        });
      } else {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: "processing" as const, progress }
              : j
          )
        );
      }
    }, 300);
  };

  const cancelExport = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, status: "cancelled" as const } : j
      )
    );
    setExporting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    toast({ title: t.cancelled });
  };

  const downloadJob = (job: ExportJob) => {
    if (job.status !== "complete") return;
    const blob = new Blob([JSON.stringify({ job: job.filename, exported: true })], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = job.filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: locale === "id" ? "File diunduh" : "File downloaded" });
  };

  const clearCompleted = () => {
    setJobs((prev) =>
      prev.filter(
        (j) => j.status !== "complete" && j.status !== "cancelled"
      )
    );
  };

  const formatJobTime = (startTime?: number, endTime?: number) => {
    if (!startTime) return "-";
    const end = endTime || Date.now();
    const diff = Math.round((end - startTime) / 1000);
    if (diff < 60) return `${diff}s`;
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusLabel = (status: ExportJob["status"]) => {
    switch (status) {
      case "complete":
        return t.complete;
      case "cancelled":
        return t.cancelled;
      case "error":
        return t.error;
      case "processing":
        return t.processing;
      case "pending":
        return t.pending;
      default:
        return "";
    }
  };

  const getStatusColorClass = (status: ExportJob["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-500/20 text-green-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "error":
        return "bg-red-500/20 text-red-500";
      case "processing":
        return "bg-blue-500/20 text-blue-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            {t.title}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--foreground))]">
                {t.selectFormat}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {FORMATS.map((format) => (
                  <div
                    key={format.id}
                    className={[
                      "flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                      selectedFormat === format.id
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))/5]"
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]",
                    ].join(" ")}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div
                      className={[
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedFormat === format.id
                          ? "bg-[hsl(var(--primary))]"
                          : "bg-[hsl(var(--muted))]",
                      ].join(" ")}
                    >
                      <format.icon
                        size={20}
                        className={
                          selectedFormat === format.id
                            ? "text-[hsl(var(--primary-foreground))]"
                            : "text-[hsl(var(--muted-foreground))]"
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[hsl(var(--foreground))]">
                          {format.label}
                        </p>
                        {selectedFormat === format.id && (
                          <span className="px-2 py-0.5 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded">
                            {locale === "id" ? "Terpilih" : "Selected"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {format.description} ({format.estimatedSize})
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export button */}
              <div className="mt-6 pt-4 border-t border-[hsl(var(--border))]">
                <Button
                  size="sm"
                  onClick={startExport}
                  disabled={exporting}
                  className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90] disabled:opacity-50"
                >
                  <Play size={14} className="mr-1" />
                  {exporting ? t.processing : t.export}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job queue */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-[hsl(var(--foreground))]">
                {t.jobQueue}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  disabled={
                    jobs.filter(
                      (j) => j.status === "complete" || j.status === "cancelled"
                    ).length === 0
                  }
                  className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  {t.clearQueue}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: locale === "id"
                        ? "Fitur belum tersedia"
                        : "Feature not available",
                    });
                  }}
                  className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  <Download size={14} className="mr-1" />
                  {t.downloadAll}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Settings
                    size={48}
                    className="mx-auto mb-4 text-[hsl(var(--muted-foreground))] opacity-50"
                  />
                  <p className="text-lg text-[hsl(var(--muted-foreground))]">
                    {t.queueEmpty}
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    {locale === "id"
                      ? "Pilih format dan mulai ekspor"
                      : "Select a format and start export"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {jobs.map((job) => {
                    const format = FORMATS.find((f) => f.id === job.format);
                    return (
                      <div
                        key={job.id}
                        className={[
                          "p-4 rounded-lg border transition-colors",
                          job.status === "complete"
                            ? "border-green-500/30 bg-green-500/5"
                            : job.status === "cancelled"
                            ? "border-red-500/30 bg-red-500/5"
                            : job.status === "error"
                            ? "border-red-500/30 bg-red-500/5"
                            : "border-[hsl(var(--border))] bg-[hsl(var(--card))]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                job.status === "complete"
                                  ? "bg-green-500/20"
                                  : job.status === "cancelled"
                                  ? "bg-red-500/20"
                                  : job.status === "error"
                                  ? "bg-red-500/20"
                                  : "bg-[hsl(var(--muted))]",
                              ].join(" ")}
                            >
                              {job.status === "complete" ? (
                                <Check size={16} className="text-green-500" />
                              ) : job.status === "cancelled" ? (
                                <X size={16} className="text-red-500" />
                              ) : job.status === "error" ? (
                                <AlertCircle size={16} className="text-red-500" />
                              ) : (
                                <Play
                                  size={16}
                                  className="text-[hsl(var(--muted-foreground))]"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[hsl(var(--foreground))]">
                                {format?.label || job.format}
                              </p>
                              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {job.filename}
                              </p>
                            </div>
                          </div>
                          {job.status === "complete" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadJob(job)}
                              className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                            >
                              <Download size={14} className="mr-1" />
                              {t.download}
                            </Button>
                          )}
                          {(job.status === "pending" ||
                            job.status === "processing") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => cancelExport(job.id)}
                              className="text-[hsl(var(--muted-foreground))] hover:text-red-500 hover:bg-red-500/10"
                            >
                              {t.cancel}
                            </Button>
                          )}
                        </div>

                        {/* Status and progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              {t.status}
                            </span>
                            <span
                              className={[
                                "px-2 py-0.5 text-xs rounded",
                                getStatusColorClass(job.status),
                              ].join(" ")}
                            >
                              {getStatusLabel(job.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              {t.progress}
                            </span>
                            <span className="text-[hsl(var(--muted-foreground))]">
                              {Math.round(job.progress)}%
                            </span>
                          </div>
                          <Progress
                            value={job.progress}
                            className="h-2 bg-[hsl(var(--muted))]"
                          />
                          {job.startTime && (
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                              {t.processingTime}:{" "}
                              {formatJobTime(job.startTime, job.endTime)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

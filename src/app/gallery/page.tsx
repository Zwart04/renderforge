"use client";

import { useToast } from "@/components/ui/toast-provider";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Image,
  Search,
  Download,
  ExternalLink,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  tags: string[];
  thumbnail: string;
  downloads: number;
  featured: boolean;
}

const PRESETS: Preset[] = [
  {
    id: "1",
    name: "Particle Fever",
    description: "High-energy particle system with collision detection and color cycling. Perfect for backgrounds and visual effects.",
    category: "Particles",
    author: "RenderForge Team",
    tags: ["particles", "physics", "colorful"],
    thumbnail: "https://picsum.photos/seed/particle/400/300",
    downloads: 1247,
    featured: true,
  },
  {
    id: "2",
    name: "Mandelbrot Deep Dive",
    description: "Deep zoom Mandelbrot set explorer with smooth color mapping and iteration counter.",
    category: "Fractal",
    author: "Math Visualizer",
    tags: ["fractal", "math", "zoom"],
    thumbnail: "https://picsum.photos/seed/mandelbrot/400/300",
    downloads: 892,
    featured: true,
  },
  {
    id: "3",
    name: "Neon Waves",
    description: "Synthwave-inspired wave interference pattern with pulsing colors and retro aesthetic.",
    category: "Wave",
    author: "RetroVibe",
    tags: ["wave", "synthwave", "retro"],
    thumbnail: "https://picsum.photos/seed/neonwave/400/300",
    downloads: 654,
    featured: false,
  },
  {
    id: "4",
    name: "Flower Growth",
    description: "Procedural flower generation with petal physics, stem growth animation, and wind response.",
    category: "Nature",
    author: "Organic Forms",
    tags: ["nature", "growth", "procedural"],
    thumbnail: "https://picsum.photos/seed/flower/400/300",
    downloads: 521,
    featured: true,
  },
  {
    id: "5",
    name: "Grid Tunnel",
    description: "Infinite tunnel effect with perspective grid, color cycling, and speed control.",
    category: "Geometric",
    author: "CyberVision",
    tags: ["tunnel", "grid", "cyberpunk"],
    thumbnail: "https://picsum.photos/seed/tunnel/400/300",
    downloads: 433,
    featured: false,
  },
  {
    id: "6",
    name: "Liquid Metal",
    description: "Metaball simulation with reflective surface, dynamic lighting, and fluid motion.",
    category: "Fluid",
    author: "Shader Wizard",
    tags: ["metaball", "fluid", "reflective"],
    thumbnail: "https://picsum.photos/seed/liquid/400/300",
    downloads: 387,
    featured: false,
  },
  {
    id: "7",
    name: "Star Field",
    description: "Parallax star field with twinkling stars, nebula clouds, and space dust particles.",
    category: "Space",
    author: "Cosmic Arts",
    tags: ["space", "stars", "nebula"],
    thumbnail: "https://picsum.photos/seed/starfield/400/300",
    downloads: 342,
    featured: false,
  },
  {
    id: "8",
    name: "DNA Helix",
    description: "Double helix DNA visualization with base pair highlighting, rotation, and zoom.",
    category: "Science",
    author: "BioVisual",
    tags: ["dna", "science", "helix"],
    thumbnail: "https://picsum.photos/seed/dna/400/300",
    downloads: 298,
    featured: false,
  },
];

const CATEGORIES = ["All", "Particles", "Fractal", "Wave", "Nature", "Geometric", "Fluid", "Space", "Science"];

export default function GalleryPage() {
  const { locale } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = {
    title: locale === "id" ? "Galeri Template" : "Template Gallery",
    subtitle: locale === "id" ? "Eksplor preset shader dan graf yang dibuat komunitas" : "Explore shader presets and graphs created by the community",
    searchPlaceholder: locale === "id" ? "Cari preset..." : "Search presets...",
    category: locale === "id" ? "Kategori" : "Category",
    viewGrid: locale === "id" ? "Tampilan Grid" : "Grid View",
    viewList: locale === "id" ? "Tampilan Daftar" : "List View",
    downloads: locale === "id" ? "Unduh" : "Downloads",
    by: locale === "id" ? "oleh" : "by",
    useTemplate: locale === "id" ? "Gunakan Template" : "Use Template",
    downloadTemplate: locale === "id" ? "Unduh Template" : "Download Template",
    previewTemplate: locale === "id" ? "Pratinjau Template" : "Preview Template",
    noResults: locale === "id" ? "Tidak ada preset ditemukan" : "No presets found",
    results: locale === "id" ? "hasil" : "results",
    featured: locale === "id" ? "Unggulan" : "Featured",
    tags: locale === "id" ? "Tags" : "Tags",
    loading: locale === "id" ? "Mendownload..." : "Downloading...",
  };

  const filteredPresets = PRESETS.filter((preset) => {
    const matchesSearch = preset.name.toLowerCase().includes(search.toLowerCase()) ||
      preset.description.toLowerCase().includes(search.toLowerCase()) ||
      preset.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "All" || preset.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (preset: Preset) => {
    toast({
      title: locale === "id" ? "Template dimuat" : "Template loaded",
      description: `${preset.name} siap diedit`,
    });
    // In a real app, this would navigate to the editor with preset data
  };

  const handleDownload = async (preset: Preset) => {
    setDownloadingId(preset.id);
    // Simulate download
    await new Promise((r) => setTimeout(r, 800));
    setDownloadingId(null);
    toast({
      title: locale === "id" ? "Template diunduh" : "Template downloaded",
      description: `${preset.name} berhasil diunduh`,
    });
  };

  const handlePreview = (preset: Preset) => {
    toast({
      title: locale === "id" ? "Membuka pratinjau" : "Opening preview",
      description: `${preset.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{t.title}</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1" />
                  <rect x="9" y="1" width="6" height="6" rx="1" />
                  <rect x="1" y="9" width="6" height="6" rx="1" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="3" rx="1" />
                  <rect x="1" y="7" width="14" height="3" rx="1" />
                  <rect x="1" y="12" width="14" height="3" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="pl-9 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={[
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  category === cat
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {filteredPresets.length} {t.results}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-[hsl(var(--primary))] hover:underline"
            >
              {locale === "id" ? "Hapus filter" : "Clear filter"}
            </button>
          )}
        </div>

        {/* Preset grid/list */}
        {filteredPresets.length === 0 ? (
          <div className="text-center py-12">
            <Image size={48} className="mx-auto mb-4 text-[hsl(var(--muted-foreground))] opacity-50" />
            <p className="text-lg text-[hsl(var(--muted-foreground))]">{t.noResults}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {locale === "id" ? "Coba ubah kata kunci atau kategori" : "Try different keywords or category"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPresets.map((preset) => (
              <Card
                key={preset.id}
                className={[
                  "group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
                  preset.featured && "ring-2 ring-[hsl(var(--primary))]",
                ].join(" ")}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[hsl(var(--muted))] overflow-hidden">
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {preset.featured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-medium rounded">
                      {t.featured}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Action buttons on hover */}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-0 hover:bg-[hsl(var(--muted))]"
                      onClick={() => handleUseTemplate(preset)}
                    >
                      <Sparkles size={12} className="mr-1" />
                      {t.useTemplate}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-0 hover:bg-[hsl(var(--muted))]"
                      onClick={() => handleDownload(preset)}
                      disabled={downloadingId === preset.id}
                    >
                      {downloadingId === preset.id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
                          {t.loading}
                        </span>
                      ) : (
                        <>
                          <Download size={12} className="mr-1" />
                          {t.downloadTemplate}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {preset.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0">
                      {preset.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-3">
                    {preset.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      {t.by} {preset.author}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                      <Download size={12} />
                      {preset.downloads.toLocaleString()}
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {preset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] roundedtext-[hsl(var(--muted-foreground))]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPresets.map((preset) => (
              <Card
                key={preset.id}
                className={[
                  "group transition-all hover:shadow-md",
                  preset.featured && "ring-2 ring-[hsl(var(--primary))]",
                ].join(" ")}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-[hsl(var(--muted))] rounded-lg overflow-hidden shrink-0">
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                            {preset.name}
                          </h3>
                          {preset.featured && (
                            <Badge className="text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                              {t.featured}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0">
                        {preset.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        {t.by} {preset.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={12} />
                        {preset.downloads.toLocaleString()} {t.downloads}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex flex-wrap gap-1">
                        {preset.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded text-[hsl(var(--muted-foreground))]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="ml-auto flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
                          onClick={() => handlePreview(preset)}
                        >
                          <ExternalLink size={12} className="mr-1" />
                          {t.previewTemplate}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90]"
                          onClick={() => handleUseTemplate(preset)}
                        >
                          {t.useTemplate}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

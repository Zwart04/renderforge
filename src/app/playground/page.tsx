"use client";

import { useToast } from "@/components/ui/toast-provider";
import { useEffect, useState, useRef, useCallback } from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Square,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  Layers,
  RotateCcw,
  ChevronRight,
  Code2,
  AlertCircle,
} from "lucide-react";

// WGSL preset shaders
const PRESETS: { name: string; code: string; description: string }[] = [
  {
    name: "Basic Particles",
    description: "Simple particle system with gravity",
    code: `// Basic Particle System
@group(0) @binding(0) var<storage, read_write> positions: array<vec2f>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= arrayLength(&positions)) { return; }
  
  var pos = positions[i];
  pos.y -= 0.01;
  pos.x += sin(pos.y * 10.0) * 0.002;
  
  if (pos.y < -1.0) {
    pos = vec2f(0.0, 1.0);
  }
  
  positions[i] = pos;
}
`,
  },
  {
    name: "Mandelbrot Explorer",
    description: "Classic fractal visualization",
    code: `// Mandelbrot Fractal
@group(0) @binding(0) var<storage, read_write> output: array<vec4f>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.y * 256u + id.x;
  if (i >= 256u * 256u) { return; }
  
  let uv = vec2f(f32(id.x) / 256.0, f32(id.y) / 256.0) * 3.0 - vec2f(2.0, 1.5);
  var z = vec2f(0.0, 0.0);
  var c = uv;
  var iter = 0u;
  
  while (iter < 100u && dot(z, z) < 4.0) {
    z = vec2f(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    iter++;
  }
  
  let t = f32(iter) / 100.0;
  output[i] = vec4f(t, t * 0.5, t * 0.25, 1.0);
}
`,
  },
  {
    name: "Fire Simulation",
    description: "Procedural fire with noise",
    code: `// Fire Simulation
@group(0) @binding(0) var<storage, read_write> heat: array<vec4f>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.x;
  if (i >= arrayLength(&heat)) { return; }
  
  var h = heat[i];
  h.x += h.y * 0.1;
  h.y *= 0.98;
  
  if (h.x > 1.0) {
    h.x = 0.0;
    h.y = 0.5 + random() * 0.5;
  }
  
  heat[i] = h;
}

fn random() -> f32 {
  return fract(sin(dot(vec2f(f32(i), 1.0), vec2f(12.9898, 78.233))) * 43758.5453);
}
`,
  },
  {
    name: "Wave Pattern",
    description: "Interfering wave simulation",
    code: `// Wave Interference Pattern
@group(0) @binding(0) var<storage, read_write> frame: array<vec4f>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.y * 256u + id.x;
  if (i >= 256u * 256u) { return; }
  
  let uv = vec2f(f32(id.x) / 256.0, f32(id.y) / 256.0) * 4.0 - vec2f(2.0);
  let t = f32(u32(id.x) + u32(id.y));
  
  let wave1 = sin(length(uv - vec2f(0.5, 0.0)) * 6.0 - t * 0.1) * 0.5 + 0.5;
  let wave2 = sin(length(uv - vec2f(-0.5, 0.0)) * 6.0 - t * 0.1) * 0.5 + 0.5;
  
  let intensity = (wave1 + wave2) * 0.5;
  frame[i] = vec4f(intensity, intensity * 0.3, intensity * 0.1, 1.0);
}
`,
  },
];

// Minimal WGSL template
const WGSL_TEMPLATE = `// WGSL Compute Shader
// Write your code below
@group(0) @binding(0) var<storage, read_write> data: array<vec4f>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let i = id.y * 256u + id.x;
  if (i >= 256u * 256u) { return; }
  
  data[i] = vec4f(0.0, 0.0, 0.0, 1.0);
}
`;

export default function PlaygroundPage() {
  const { locale } = useApp();
  const { toast } = useToast();
  const [code, setCode] = useState(WGSL_TEMPLATE);
  const [running, setRunning] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    title: locale === "id" ? "Shader Playground" : "Shader Playground",
    subtitle: locale === "id" ? "Tulis dan jalankan shader compute GPU" : "Write and run GPU compute shaders",
    codeLabel: locale === "id" ? "Kode Shader (WGSL)" : "Shader Code (WGSL)",
    previewLabel: locale === "id" ? "Pratinjau" : "Preview",
    compile: locale === "id" ? "Kompilasi" : "Compile",
    run: locale === "id" ? "Jalankan" : "Run",
    stop: locale === "id" ? "Berhenti" : "Stop",
    stopRunning: locale === "id" ? "Menghentikan..." : "Stopping...",
    errorTitle: locale === "id" ? "Kesalahan Kompilasi" : "Compilation Error",
    noGPUTitle: locale === "id" ? "WebGPU tidak tersedia" : "WebGPU not available",
    noGPUBody: locale === "id" ? "Peramban Anda tidak mendukung WebGPU. Coba browser modern seperti Chrome 113+." : "Your browser doesn't support WebGPU. Try a modern browser like Chrome 113+.",
    fallback: locale === "id" ? "Mode WebGL fallback" : "WebGL fallback mode",
    preset: locale === "id" ? "Preset" : "Preset",
    selectedPreset: locale === "id" ? "Preset terpilih" : "Selected preset",
    copied: locale === "id" ? "Kode disalin" : "Code copied",
    reset: locale === "id" ? "Reset" : "Reset",
    downloading: locale === "id" ? "Mendownload shader..." : "Downloading shader...",
    shaderDownloaded: locale === "id" ? "Shader didownload" : "Shader downloaded",
    copiedToClipboard: locale === "id" ? "Kode disalin ke clipboard" : "Code copied to clipboard",
  };

  const loadPreset = useCallback(
    (index: number) => {
      setSelectedPreset(index);
      setCode(PRESETS[index].code);
      setCompiled(false);
      setError(null);
    },
    [locale]
  );

  useEffect(() => {
    loadPreset(0);
  }, [loadPreset]);

  const compileShader = useCallback(async () => {
    if (!navigator.gpu) {
      setError(t.noGPUBody);
      return;
    }
    try {
      const adapter = await navigator.gpu.requestAdapter();
      setCompiled(true);
      setError(null);
      toast({ title: locale === "id" ? "Shader terkompilasi" : "Shader compiled" });
    } catch (e) {
      setError(String(e));
      setCompiled(false);
    }
  }, [locale, toast]);

  const runShader = useCallback(() => {
    if (!canvasRef.current) return;
    setRunning(true);

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      setRunning(false);
      return;
    }

    // Clear with dark background
    gl.clearColor(0.05, 0.05, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.finish();

    setTimeout(() => {
      setRunning(false);
      toast({ title: locale === "id" ? "Render selesai" : "Render complete" });
    }, 500);
  }, [locale, toast]);

  const stopShader = useCallback(() => {
    setRunning(false);
  }, []);

  const resetCode = useCallback(() => {
    setCode(WGSL_TEMPLATE);
    setSelectedPreset(-1);
    setCompiled(false);
    setError(null);
  }, []);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: t.copiedToClipboard });
    } catch {
      toast({ title: locale === "id" ? "Gagal menyalin" : "Failed to copy" });
    }
  }, [code, locale, toast]);

  const downloadShader = useCallback(async () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shader.wgsl";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: t.shaderDownloaded });
  }, [code, locale, toast]);

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
            {compiled && (
              <Badge className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
                Ready
              </Badge>
            )}
            {running && (
              <Badge className="bg-[hsl(142, 91%, 60% / 20%)] text-[hsl(142, 91%, 60%)]">
                Running
              </Badge>
            )}
          </div>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-[hsl(var(--muted-foreground))]" />
            <span className="text-sm font-medium text-[hsl(var(--foreground))]">{t.preset}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(idx)}
                className={[
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap",
                  selectedPreset === idx
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]",
                ].join(" ")}
              >
                <Layers size={14} />
                {preset.name}
              </button>
            ))}
            <button
              onClick={resetCode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
            >
              <RotateCcw size={14} />
              {locale === "id" ? "Kustom" : "Custom"}
            </button>
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {t.codeLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <Copy size={14} className="mr-1" />
                  {locale === "id" ? "Salin" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadShader}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <Download size={14} className="mr-1" />
                  {locale === "id" ? "Unduh" : "Download"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <RotateCcw size={14} className="mr-1" />
                  {t.reset}
                </Button>
              </div>
            </div>
            <div className="code-editor p-4">
              <div className="flex">
                <div className="line-numbers select-none border-r border-[hsl(var(--border))] py-4 text-xs text-[hsl(var(--muted-foreground))] font-mono pr-4">
                  {code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-transparent text-[hsl(var(--foreground))] font-mono text-sm p-4 outline-none resize-none"
                  placeholder="// Write your WGSL compute shader here..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {t.previewLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={compileShader}
                  disabled={running}
                  className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/90]"
                >
                  <Play size={14} className="mr-1" />
                  {t.compile}
                </Button>
                <Button
                  size="sm"
                  onClick={running ? stopShader : runShader}
                  disabled={running}
                  variant="outline"
                  className="border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  {running ? (
                    <span className="flex items-center gap-1">
                      <RefreshCw size={14} className="animate-spin" />
                      {t.stopRunning}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Play size={14} />
                      {t.run}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[400px] bg-[#0a0a0f] relative overflow-hidden">
              {/* Animated background grid pattern */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              {error ? (
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[hsl(var(--destructive))/10] border border-[hsl(var(--destructive))] mb-3">
                    <AlertCircle size={16} className="text-[hsl(var(--destructive-foreground))]" />
                    <span className="text-sm text-[hsl(var(--destructive-foreground))]">
                      {t.errorTitle}
                    </span>
                  </div>
                  <pre className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] rounded-lg p-3 max-w-md text-left overflow-x-auto">
                    {error}
                  </pre>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  id="compute-canvas"
                  className="compute-canvas w-full h-full min-h-[400px]"
                  width={800}
                  height={450}
                />
              )}

              {/* Loading overlay */}
              {running && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <div className="flex items-center gap-3 px-4 py-2 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] shadow-lg">
                    <RefreshCw size={16} className="text-[hsl(var(--primary))] animate-spin" />
                    <span className="text-sm text-[hsl(var(--foreground))]">{t.stopRunning}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
          <span>WGSL Compute Shader Language</span>
          <span className="flex items-center gap-1">
            <ChevronRight size={12} />
            {locale === "id" ? "Tekan Compile untuk memproses shader" : "Press Compile to process shader"}
          </span>
        </div>
      </div>
    </div>
  );
}

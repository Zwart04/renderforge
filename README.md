# RenderForge

**GPU Compute Shader Editor — Real-Time Canvas — Zero Install**

RenderForge adalah tool browser-native untuk menulis shader compute WGSL, membangun graf aliran data node-based, dan merender visualisasi GPU secara real-time — seluruhnya berjalan di browser tanpa instalasi atau upload server.

![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-6366f1?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-f68234?logo=cloudflare&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-renderforge.zwart.qzz.io-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://renderforge.zwart.qzz.io)

---

## Overview

RenderForge dirancang untuk creative coder, data visualization engineer, dan konten kreator yang butuh tool render media berbasis GPU tanpa install software berat. Semua proses — dari decode media, pipeline processing, sampai export — berjalan di sisi klien menggunakan WebGPU, OffscreenCanvas, dan Web Audio API.

| | |
|---|---|
| **Live URL** | https://renderforge.zwart.qzz.io |
| **Repo** | https://github.com/Zwart04/renderforge |
| **Stack** | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| **GPU** | WebGPU Compute Shaders (WGSL), WebGL fallback |
| **Auth** | LocalStorage-based (hf_user/hf_users) |
| **Analytics** | UTM attribution → localStorage → Recharts (no Pixel/GA) |
| **Finance** | Auto-journal integrated, export CSV/Excel |
| **Hosting** | Cloudflare Pages (free, unlimited bandwidth) |

---

## Features

### 1. GPU Compute Shader Editor
Tulis shader WGSL dengan preview langsung. Target 60fps dengan inline error highlighting dan syntax helper.

### 2. Node-Based Data Flow Graph
Pipeline compute drag-and-drop dengan node sumber (source), transformasi (transform), dan tujuan (sink). Susun urutan processing secara visual.

### 3. Real-Time WebGL Canvas
Multi-layer compositing, transisi crossfade, dan overlay timestamp zona waktu WIB. Render langsung di canvas dengan rasio refresh tinggi.

### 4. Batch Export Pipeline
Ekspor ke MP4/WebM, urutan PNG, GIF, atau data CSV/JSON — semuanya client-side. Pilih quality, framerate (1-60fps), dan resolution preset (360p-1080p).

### 5. Collaborative Sessions
Bagikan status ruang kerja via URL. Multi-tab sync menggunakan BroadcastChannel API tanpa server.

### 6. Analytics & Attribution
Track sumber UTM, statistik sesi, dan jumlah ekspor menggunakan Recharts — tanpa pelacakan pihak ketiga (no Meta Pixel, no Google Analytics).

### 7. Media Import & Decoder Pipeline
Upload image (PNG/JPG/WebP), audio (MP3/WAV), dan video clip (WebM/MP4). Preview thumbnail + duration + format info.

### 8. Project Management & Auto-Save
Auto-save ke localStorage tiap 15 detik. Project list dengan search/filter, delete/rename, import/export sebagai JSON (.rfp).

### 9. Finance Auto-Journal
Tiap render di-track sebagai expense: source=auto-render, desc=<project> render <format>, amount=mock berdasarkan durasi. Dashboard finance dengan Recharts + export Excel/CSV.

### 10. Bilingual Dashboard
Toggle EN/ID di header. Semua label menggunakan dictionary t.*. Dark/light mode independent.

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (OKLCH-based, CSS-first) |
| UI Components | shadcn/ui |
| Charts | Recharts 3 |
| Icons | lucide-react |
| Theme | next-themes (dark/light) |
| Audio | Web Audio API |
| GPU Compute | WebGPU + WGSL, OffscreenCanvas |
| Export | Canvas captureStream (WebM), PNG sequence |
| Auth | LocalStorage (hf_user, hf_users) |
| Deployment | Cloudflare Pages |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/Zwart04/renderforge.git
cd renderforge

# Install dependencies
npm install

# Build for production
npm run build

# Start local server (production mode)
npm start
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Build Output

Static export ke folder `out/` — siap di-deploy ke Cloudflare Pages, Vercel, atau static host apapun.

---

## Project Structure

```
renderforge/
├── public/
│   ├── icon.svg              # Favicon
│   ├── screenshots/          # Demo video + images
│   └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout + providers
│   │   ├── page.tsx          # Landing page
│   │   ├── providers.tsx     # AppProviders (AppProvider + ThemeProvider + ToastProvider)
│   │   ├── auth/
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Register page
│   │   │   └── logout/       # Logout action
│   │   ├── dashboard/        # Dashboard (EN/ID)
│   │   ├── analytics/        # Recharts analytics
│   │   ├── export/           # Export history
│   │   ├── gallery/          # Template gallery
│   │   ├── graph/            # Data flow graph editor
│   │   ├── playground/       # Quick upload + render
│   │   ├── finance/          # Finance journal
│   │   ├── settings/         # Settings (lang, theme)
│   │   └── shared/           # Shared components
│   ├── components/
│   │   ├── sidebar.tsx       # Navigation sidebar
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── app-context.tsx   # App context (locale, user, theme)
│   │   ├── attribution.ts    # UTM → localStorage attribution
│   │   ├── finance.ts        # Finance journal logic
│   │   └── i18n.ts           # Translation dictionary
│   └── types/
│       └── gpu.ts            # GPU types
├── out/                      # Static build output
├── next.config.ts            # Next.js config (export + unoptimized images)
├── package.json
└── tsconfig.json
```

---

## Demo Account

Register atau login dengan email yang sudah terdaftar di localStorage. Untuk demo fresh:

1. Buka https://renderforge.zwart.qzz.io/auth/register
2. Masukkan nama + email + password (min. 8 karakter)
3. Tekan "Buat akun"
4. Redirect ke dashboard

---

## API Reference

Project ini berjalan sepenuhnya client-side. Tidak ada backend API. Semua data disimpan di localStorage browser.

| Fitur | Storage Key | Format |
|---|---|---|
| Auth user | `hf_user` | `{ email, name }` |
| Auth users | `hf_users` | `Record<email, {email, name}>` |
| Locale | `rf_locale` | `"en" | "id"` |
| Theme | `rf_theme` | `"light" | "dark"` |
| Projects | `rf_projects` | `Project[]` |
| Finance journal | `rf_finance` | `JournalEntry[]` |

---

## Roadmap

- [ ] WebGPU compute shader presets library
- [ ] Timeline sequencer dengan track audio/video
- [ ] Export ke MP4 dengan audio track
- [ ] Collaborative session via WebRTC (peer-to-peer)
- [ ] Mobile-responsive layout
- [ ] Shader import dari external URL

---

## License

MIT License — lihat file [LICENSE](LICENSE) untuk detail.

---

## Credits

Dibuat dengan Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts, dan lucide-react. Di-host oleh Cloudflare Pages.

Built by Zwart04.

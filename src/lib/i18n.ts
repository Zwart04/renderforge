// Translations dictionary - bilingual EN/ID
export const t = {
  // Nav
  nav_dashboard: { en: "Dashboard", id: "Dasbor" },
  nav_playground: { en: "Playground", id: "Area Main" },
  nav_graph: { en: "Graph Editor", id: "Editor Graf" },
  nav_gallery: { en: "Gallery", id: "Galeri" },
  nav_analytics: { en: "Analytics", id: "Analitik" },
  nav_finance: { en: "Finance", id: "Keuangan" },
  nav_settings: { en: "Settings", id: "Pengaturan" },
  nav_export: { en: "Export", id: "Ekspor" },
  nav_login: { en: "Log In", id: "Masuk" },
  nav_register: { en: "Register", id: "Daftar" },
  nav_logout: { en: "Log Out", id: "Keluar" },

  // Auth
  auth_title: { en: "Sign in to RenderForge", id: "Masuk ke RenderForge" },
  auth_subtitle: {
    en: "Access your GPU compute workspace",
    id: "Akses ruang kerja GPU compute Anda",
  },
  auth_email: { en: "Email address", id: "Alamat email" },
  auth_password: { en: "Password", id: "Kata sandi" },
  auth_name: { en: "Full name", id: "Nama lengkap" },
  auth_submit: { en: "Sign in", id: "Masuk" },
  auth_register_submit: { en: "Create account", id: "Buat akun" },
  auth_no_account: { en: "Don't have an account?", id: "Belum punya akun?" },
  auth_have_account: { en: "Already have an account?", id: "Sudah punya akun?" },
  auth_email_invalid: { en: "Please enter a valid email", id: "Masukkan email yang valid" },
  auth_password_short: { en: "Password must be at least 8 characters", id: "Kata sandi minimal 8 karakter" },
  auth_name_required: { en: "Name is required", id: "Nama wajib diisi" },
  auth_error: { en: "Authentication error", id: "Kesalahan autentikasi" },

  // Landing
  hero_title: {
    en: "GPU Compute. Real-Time Canvas. Zero Install.",
    id: "GPU Compute. Kanvas Real-Time. Tanpa Instalasi.",
  },
  hero_subtitle: {
    en: "Write compute shaders, build data flow graphs, and render live visualizations — all in your browser.",
    id: "Tulis shader compute, buat graf aliran data, dan render visualisasi live — semua di browser Anda.",
  },
  hero_cta: { en: "Launch Workspace", id: "Buka Ruang Kerja" },

  features_title: { en: "Features", id: "Fitur" },
  feature_shader_editor: {
    en: "GPU Compute Shader Editor",
    id: "Editor Shader Compute GPU",
  },
  feature_shader_desc: {
    en: "Write WGSL compute shaders with live preview. 60fps target, inline error highlighting.",
    id: "Tulis shader compute WGSL dengan preview langsung. Target 60fps, sorot kesalahan inline.",
  },
  feature_graph_editor: {
    en: "Node-Based Data Flow Graph",
    id: "Graf Aliran Data Berbasis Node",
  },
  feature_graph_desc: {
    en: "Drag-and-drop compute pipeline. Source, transform, and sink nodes with live connections.",
    id: "Pipeline compute drag-and-drop. Node sumber, transformasi, dan tujuan dengan koneksi langsung.",
  },
  feature_canvas: {
    en: "Real-Time WebGL Canvas",
    id: "Kanvas WebGL Real-Time",
  },
  feature_canvas_desc: {
    en: "Multi-layer compositing, crossfade transitions, and timezone-aware timestamp overlay.",
    id: "Kompositasi multi-lapis, transisi crossfade, dan overlay timestamp zona waktu.",
  },
  feature_export: {
    en: "Batch Export Pipeline",
    id: "Pipeline Ekspor Batch",
  },
  feature_export_desc: {
    en: "Export to MP4/WebM, PNG sequence, or CSV/JSON data — all client-side.",
    id: "Ekspor ke MP4/WebM, urutan PNG, atau data CSV/JSON — semuanya di sisi klien.",
  },
  feature_collab: {
    en: "Collaborative Sessions",
    id: "Sesi Kolaboratif",
  },
  feature_collab_desc: {
    en: "Share workspace state via URL. Multi-tab sync with BroadcastChannel API.",
    id: "Bagikan status ruang kerja via URL. Sinkronisasi multi-tab dengan BroadcastChannel API.",
  },
  feature_analytics: {
    en: "Analytics & Attribution",
    id: "Analitik & Atribusi",
  },
  feature_analytics_desc: {
    en: "Track UTM sources, session stats, and export counts — no third-party tracking.",
    id: "Lacak sumber UTM, statistik sesi, dan jumlah ekspor — tanpa pelacakan pihak ketiga.",
  },

  // Dashboard
  dashboard_welcome: { en: "Welcome back", id: "Selamat datang kembali" },
  dashboard_project: { en: "Project", id: "Proyek" },
  dashboard_status: { en: "Status", id: "Status" },
  dashboard_status_running: { en: "Running", id: "Berjalan" },
  dashboard_status_idle: { en: "Idle", id: "Menganggur" },
  dashboard_sessions: { en: "Sessions", id: "Sesi" },
  dashboard_exports: { en: "Exports", id: "Ekspor" },
  dashboard_active_nodes: { en: "Active Nodes", id: "Node Aktif" },
  dashboard_gpub_usage: { en: "GPU Usage", id: "Penggunaan GPU" },

  // Playground
  playground_title: { en: "Shader Playground", id: "Area Main Shader" },
  playground_code: { en: "Shader Code (WGSL)", id: "Kode Shader (WGSL)" },
  playground_preview: { en: "Preview", id: "Pratinjau" },
  playground_compile: { en: "Compile", id: "Kompilasi" },
  playground_stop: { en: "Stop", id: "Berhenti" },
  playground_error: { en: "Compilation Error", id: "Kesalahan Kompilasi" },
  playground_no_gpu: { en: "WebGPU not available", id: "WebGPU tidak tersedia" },
  playground_fallback: { en: "Falling back to WebGL", id: "Beralih ke WebGL" },

  // Graph Editor
  graph_title: { en: "Data Flow Graph", id: "Graf Aliran Data" },
  graph_add_node: { en: "Add Node", id: "Tambah Node" },
  graph_node_source: { en: "Source", id: "Sumber" },
  graph_node_compute: { en: "Compute", id: "Komputasi" },
  graph_node_sink: { en: "Sink", id: "Tujuan" },
  graph_connect: { en: "Connect", id: "Hubungkan" },
  graph_run: { en: "Run", id: "Jalankan" },
  graph_clear: { en: "Clear", id: "Hapus" },

  // Gallery
  gallery_title: { en: "Template Gallery", id: "Galeri Template" },
  gallery_search: { en: "Search presets...", id: "Cari preset..." },
  gallery_empty: { en: "No presets found", id: "Tidak ada preset ditemukan" },
  gallery_preview: { en: "Preview", id: "Pratinjau" },
  gallery_use: { en: "Use Template", id: "Gunakan Template" },
  gallery_download: { en: "Download", id: "Unduh" },

  // Analytics
  analytics_title: { en: "Analytics", id: "Analitik" },
  analytics_sessions: { en: "Sessions", id: "Sesi" },
  analytics_sources: { en: "Traffic Sources", id: "Sumber Traffic" },
  analytics_exports: { en: "Exports", id: "Ekspor" },
  analytics_duration: { en: "Avg Session Duration", id: "Rata-rata Durasi Sesi" },

  // Finance
  finance_title: { en: "Finance Journal", id: "Jurnal Keuangan" },
  finance_entries: { en: "Journal Entries", id: "Entri Jurnal" },
  finance_total: { en: "Total", id: "Total" },
  finance_auto_task: { en: "Auto-Task", id: "Auto-Tugas" },
  finance_auto_vendor: { en: "Auto-Vendor", id: "Auto-Vendor" },
  finance_empty: { en: "No finance entries yet", id: "Belum ada entri keuangan" },

  // Export
  export_title: { en: "Export Pipeline", id: "Pipeline Ekspor" },
  export_format: { en: "Format", id: "Format" },
  export_progress: { en: "Export Progress", id: "Progress Ekspor" },
  export_complete: { en: "Export Complete", id: "Ekspor Selesai" },
  export_cancel: { en: "Cancel", id: "Batal" },

  // Settings
  settings_title: { en: "Settings", id: "Pengaturan" },
  settings_appearance: { en: "Appearance", id: "Tampilan" },
  settings_language: { en: "Language", id: "Bahasa" },
  settings_theme_light: { en: "Light", id: "Terang" },
  settings_theme_dark: { en: "Dark", id: "Gelap" },
  settings_locale_en: { en: "English", id: "Inggris" },
  settings_locale_id: { en: "Bahasa Indonesia", id: "Bahasa Indonesia" },

  // Shared
  shared_title: { en: "Shared Session", id: "Sesi Terbagi" },
  shared_invalid: { en: "Invalid or expired session", id: "Sesi tidak valid atau kedaluwarsa" },

  // Common
  loading: { en: "Loading...", id: "Memuat..." },
  error: { en: "Error", id: "Kesalahan" },
  save: { en: "Save", id: "Simpan" },
  cancel: { en: "Cancel", id: "Batal" },
  delete: { en: "Delete", id: "Hapus" },
  close: { en: "Close", id: "Tutup" },
  confirm: { en: "Confirm", id: "Konfirmasi" },
  share_via_wa: { en: "Share via WhatsApp", id: "Bagikan via WhatsApp" },
  copied_to_clipboard: { en: "Copied to clipboard", id: "Disalin ke clipboard" },
  no_results: { en: "No results", id: "Tidak ada hasil" },
  view_all: { en: "View all", id: "Lihat semua" },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, locale: "en" | "id"): string {
  const entry = t[key];
  if (!entry) return key as string;
  return entry[locale] ?? entry.en;
}

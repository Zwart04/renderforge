export const PRODUCTS = {
  "renderforge": {
    "accent": "#b6a0ed",
    "currency": "IDR",
    "tagline": "One story. Every creative tool.",
    "modules": [
      {
        "key": "projects",
        "label": "Proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          },
          {
            "key": "deadline",
            "label": "Target selesai",
            "type": "date"
          }
        ],
        "statuses": [
          "planning",
          "active",
          "review",
          "done"
        ]
      },
      {
        "key": "assets",
        "label": "Asset library",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "type",
            "label": "Jenis",
            "type": "select",
            "options": [
              "image",
              "audio",
              "video",
              "document"
            ]
          },
          {
            "key": "filename",
            "label": "Nama berkas",
            "type": "text"
          },
          {
            "key": "description",
            "label": "Deskripsi",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "storyboards",
        "label": "Storyboard",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "position",
            "label": "Urutan",
            "type": "number",
            "min": 0
          },
          {
            "key": "script",
            "label": "Naskah",
            "type": "textarea"
          },
          {
            "key": "duration",
            "label": "Durasi detik",
            "type": "number",
            "min": 0
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "timelines",
        "label": "Timeline",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "clips",
            "label": "Klip timeline",
            "type": "json"
          },
          {
            "key": "notes",
            "label": "Catatan",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "scripts",
        "label": "Naskah & podcast",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "body",
            "label": "Naskah",
            "type": "textarea",
            "required": true
          },
          {
            "key": "speaker",
            "label": "Pembicara",
            "type": "text"
          }
        ],
        "statuses": [
          "draft",
          "review",
          "approved",
          "published"
        ]
      },
      {
        "key": "moodboards",
        "label": "Moodboard",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "palette",
            "label": "Palet warna",
            "type": "text"
          },
          {
            "key": "description",
            "label": "Arahan visual",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "publishing",
        "label": "Publikasi",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "channel",
            "label": "Kanal",
            "type": "text"
          },
          {
            "key": "start",
            "label": "Mulai",
            "type": "datetime",
            "required": true
          },
          {
            "key": "caption",
            "label": "Caption",
            "type": "textarea"
          }
        ],
        "statuses": [
          "draft",
          "scheduled",
          "published"
        ]
      },
      {
        "key": "versions",
        "label": "Versi proyek",
        "fields": [
          {
            "key": "name",
            "label": "Nama / judul",
            "type": "text",
            "required": true
          },
          {
            "key": "project_id",
            "label": "Proyek",
            "type": "ref",
            "ref": "projects",
            "required": true
          },
          {
            "key": "content",
            "label": "Data versi",
            "type": "json"
          },
          {
            "key": "notes",
            "label": "Catatan",
            "type": "textarea"
          }
        ],
        "statuses": [
          "active",
          "archived"
        ]
      },
      {
        "key": "creative-studio",
        "label": "Editor media",
        "tool": "media-studio",
        "fields": []
      },
      {
        "key": "assistant",
        "label": "Asisten kreatif",
        "tool": "ai",
        "fields": []
      },
      {
        "key": "reports",
        "label": "Laporan",
        "tool": "reports",
        "fields": [],
        "statuses": []
      }
    ],
    "id": "renderforge",
    "name": "RenderForge Studio",
    "purpose": "Studio kreatif dengan satu proyek, asset library, timeline, audio dan paket publikasi.",
    "sources": [
      "renderforge",
      "mediaforge",
      "clipforge",
      "clipforge-ai",
      "neurotone",
      "audiomind-studio",
      "socsynth-studio",
      "socsynth-studio-new",
      "zwart-2026-08-31-socsynth-studio",
      "podforge",
      "voiceforge-studio",
      "moodcanvas"
    ],
    "workflow": "Buat proyek → impor aset → susun storyboard/timeline → edit audio atau visual → preview → ekspor media dan simpan catatan versi di proyek yang sama."
  }
};

import { AppProviders } from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RenderForge | GPU Compute Shader Playground",
  description: "Real-time GPU compute shader editor, node-based data flow graph, and collaborative canvas — all in your browser.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[hsl(var(--background))] antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

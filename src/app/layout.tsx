import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import TopBar from "@/components/TopBar";
import MainShell from "@/components/MainShell";
import { AudioProvider } from "@/lib/audio";
import "./globals.css";

const body = Noto_Sans_SC({
  weight: ["400", "700", "900"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "懂点健康 · health.heystone.site",
  description: "先站队，再看证据。把生活里最常见的健康谣言送上法庭，每条判决都附权威来源。",
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={body.variable}>
      <head>
        {/* 得意黑 Smiley Sans（OFL 1.1），中文网字计划切片 CDN。正式上线前改为自托管。 */}
        <link rel="stylesheet" href="https://chinese-fonts-cdn.netlify.app/packages/dyh/dist/SmileySans-Oblique/result.css" />
      </head>
      <body className="min-h-dvh">
        <AudioProvider>
          <TopBar />
          <MainShell>{children}</MainShell>
        </AudioProvider>
        <Analytics />
      </body>
    </html>
  );
}

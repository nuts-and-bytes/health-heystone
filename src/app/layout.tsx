import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC } from "next/font/google";
import TopBar from "@/components/TopBar";
import "./globals.css";

const body = Noto_Sans_SC({
  weight: ["400", "700", "900"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "健康谣言法庭 · health.heystone.site",
  description: "先站队，再看证据。把生活里最常见的健康谣言送上法庭，每条判决都附权威来源。",
};

export const viewport: Viewport = {
  themeColor: "#fdeecf",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={body.variable}>
      <head>
        {/* 得意黑 Smiley Sans（OFL 1.1），中文网字计划切片 CDN。正式上线前改为自托管。 */}
        <link rel="stylesheet" href="https://chinese-fonts-cdn.netlify.app/packages/dyh/dist/SmileySans-Oblique/result.css" />
      </head>
      <body className="min-h-dvh">
        <TopBar />
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-6 pb-10 text-center text-sm text-ink-soft">
          本站内容用于科普，不能替代医生的诊断和建议。每条判决都附有来源，欢迎核对。
        </footer>
      </body>
    </html>
  );
}

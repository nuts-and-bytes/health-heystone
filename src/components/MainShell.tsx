"use client";

import { usePathname } from "next/navigation";

export default function MainShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isPodcast = path.startsWith("/podcasts");

  if (isPodcast) {
    /* 播客工作台：桌面端锁定视口全高独立三栏滚动（与 SubCast 一致），手机端自然滚动 */
    return (
      <main className="mx-auto w-full max-w-[1520px] px-3 pb-24 pt-3 sm:px-4 md:h-[calc(100dvh-56px)] md:overflow-hidden md:pb-3">
        {children}
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-8 sm:px-6">{children}</main>
      <footer className="mx-auto max-w-4xl border-t border-line px-6 py-8 text-center text-xs text-ink-soft">
        本站内容用于科普，不能替代医生的诊断和建议。每条判决都附有来源，看到带橙色虚线的专业词可以点开看大白话解释。
      </footer>
    </>
  );
}

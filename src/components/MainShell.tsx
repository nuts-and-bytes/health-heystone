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
      <main className="mx-auto w-full max-w-4xl px-4 pb-12 pt-4 sm:px-6 sm:pt-8 md:pb-20">{children}</main>
      <footer className="mx-auto max-w-4xl border-t border-line px-5 pb-24 pt-6 text-center text-xs leading-relaxed text-ink-soft md:py-8">
        本站内容用于科普，不能替代医生的诊断和建议。每条结论均附一线权威来源，零商业带货、零医疗诊断。
      </footer>
    </>
  );
}

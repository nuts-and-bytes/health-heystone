"use client";

import { usePathname } from "next/navigation";

export default function MainShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const wide = path.startsWith("/podcasts");

  return (
    <main
      className={
        wide
          ? "mx-auto w-full max-w-[1440px] px-3 pb-24 pt-5 sm:px-5"
          : "mx-auto w-full max-w-4xl px-4 pb-28 pt-8 sm:px-6"
      }
    >
      {children}
    </main>
  );
}

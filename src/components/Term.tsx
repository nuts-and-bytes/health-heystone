"use client";

import Link from "next/link";
import { Popover } from "@base-ui/react/popover";
import { GLOSSARY_KEYS, GLOSSARY_MAP, type GlossaryTerm } from "@/data/glossary";

export function Term({ word, children }: { word: string; children?: React.ReactNode }) {
  const item: GlossaryTerm | undefined = GLOSSARY_MAP.get(word);
  if (!item) return <>{children ?? word}</>;

  return (
    <Popover.Root>
      <Popover.Trigger
        type="button"
        className="inline cursor-pointer rounded-sm border-b-[1.5px] border-dashed border-accent font-medium text-ink transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        title={`点一下看「${item.title}」大白话解释`}
      >
        {children ?? word}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} className="z-50">
          <Popover.Popup className="w-[min(320px,calc(100vw-2rem))] rounded-2xl border-[1.5px] border-ink bg-white p-4 text-left text-sm leading-relaxed text-ink shadow-[0_12px_32px_rgba(28,25,23,0.14)] outline-none">
            <div className="flex items-start justify-between gap-2">
              <Popover.Title className="font-bold text-ink">{item.title}</Popover.Title>
              <Popover.Close className="cursor-pointer rounded-md px-1.5 text-xs text-ink-soft hover:bg-cream hover:text-ink" aria-label="关闭">
                ✕
              </Popover.Close>
            </div>
            <Popover.Description className="mt-1.5 font-medium text-accent-dark">{item.short}</Popover.Description>
            <p className="mt-2 text-[13.5px] text-ink-soft">{item.detail}</p>
            <p className="mt-2.5 rounded-xl bg-cream px-3 py-2 text-[13px] text-ink">
              <span className="font-bold text-accent-dark">打个比方：</span>
              {item.analogy}
            </p>
            <div className="mt-2.5 flex justify-end gap-3">
              {item.bodySlug && (
                <Link href={`/body?tab=roles&role=${item.bodySlug}`} className="text-xs font-bold text-accent-dark hover:underline">
                  看身体动画科普 →
                </Link>
              )}
              <Link href="/guide" className="text-xs font-bold text-ink-soft hover:text-accent-dark hover:underline">
                看证据怎么分级 →
              </Link>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const REGEX = new RegExp(`(${GLOSSARY_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

/** 自动把段落里出现的专业词变成可点击的大白话弹窗（同一段落内同一词只标第一次，避免满屏虚线） */
export function RichText({ text }: { text: string }) {
  const parts = text.split(REGEX);
  const seen = new Set<string>();
  return (
    <>
      {parts.map((part, i) => {
        const term = GLOSSARY_MAP.get(part);
        if (term && !seen.has(term.key)) {
          seen.add(term.key);
          return <Term key={`${i}-${part}`} word={part} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

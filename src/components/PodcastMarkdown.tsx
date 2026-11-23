"use client";

import { timeToSec } from "@/data/podcasts";

/** 轻量 Markdown + SubCast 风格可点击 [mm:ss] 时间戳渲染器 */
export default function PodcastMarkdown({
  content,
  onSeek,
}: {
  content: string;
  onSeek: (sec: number) => void;
}) {
  const renderInline = (text: string) => {
    // 拆分 [mm:ss] / [h:mm:ss] 与 **加粗**
    const tokens = text.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\]|\*\*[^*]+\*\*)/g);
    return tokens.map((tok, i) => {
      const tm = tok.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]$/);
      if (tm) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSeek(timeToSec(tm[1]))}
            className="mx-0.5 inline-flex cursor-pointer items-center rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[11px] font-bold text-accent-dark transition hover:bg-accent hover:text-white"
            title={`跳到 ${tm[1]} 播放`}
          >
            ▶ {tm[1]}
          </button>
        );
      }
      const bm = tok.match(/^\*\*([^*]+)\*\*$/);
      if (bm) {
        return (
          <strong key={i} className="font-bold text-ink">
            {bm[1]}
          </strong>
        );
      }
      return <span key={i}>{tok}</span>;
    });
  };

  const lines = content.split(/\r?\n/);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink/90">
      {lines.map((raw, idx) => {
        const line = raw.trim();
        if (!line) return <div key={idx} className="h-1" />;
        if (line.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-display pt-2 text-lg text-ink">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="pt-1 font-bold text-accent-dark">
              {line.slice(4)}
            </h4>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote key={idx} className="rounded-r-xl border-l-[3px] border-accent bg-cream/70 px-3 py-2 text-[13.5px] text-ink">
              {renderInline(line.slice(2))}
            </blockquote>
          );
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">{renderInline(line.slice(2))}</div>
            </div>
          );
        }
        return <p key={idx}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

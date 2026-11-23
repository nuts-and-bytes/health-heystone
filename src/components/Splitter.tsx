"use client";

import { useRef } from "react";

/**
 * 完整复刻 SubCast 的全高可拖拽分隔线：
 * - self-stretch 撑满整栏高度，整条边线任意位置都可抓拖
 * - setPointerCapture 防止拖快脱手；拖过 snap 阈值松手折叠
 * - 双击恢复默认宽度；键盘左右方向键 16px 微调
 */
export default function Splitter({
  value,
  min,
  max,
  def,
  snap,
  edge,
  onChange,
  onCollapse,
  label,
}: {
  value: number;
  min: number;
  max: number;
  def: number;
  snap: number;
  edge: "right" | "left";
  onChange: (w: number) => void;
  onCollapse: () => void;
  label: string;
}) {
  const start = useRef<{ x: number; w: number } | null>(null);
  const clamp = (w: number) => Math.round(Math.min(max, Math.max(min, w)));
  const widthAt = (x: number) => {
    const s = start.current!;
    const d = x - s.x;
    return edge === "right" ? s.w + d : s.w - d;
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      title="按住左右拖动调节宽度 · 双击恢复默认"
      className="group relative hidden w-3.5 shrink-0 cursor-col-resize select-none self-stretch items-center justify-center md:flex"
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, w: value };
        document.body.classList.add("resizing");
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        const w = widthAt(e.clientX);
        if (w < snap) return;
        onChange(clamp(w));
      }}
      onPointerUp={(e) => {
        if (!start.current) return;
        const w = widthAt(e.clientX);
        start.current = null;
        document.body.classList.remove("resizing");
        if (w < snap) onCollapse();
      }}
      onPointerCancel={() => {
        start.current = null;
        document.body.classList.remove("resizing");
      }}
      onDoubleClick={() => onChange(def)}
      onKeyDown={(e) => {
        const grow = edge === "right" ? "ArrowRight" : "ArrowLeft";
        const shrink = edge === "right" ? "ArrowLeft" : "ArrowRight";
        if (e.key === grow || e.key === shrink) {
          e.preventDefault();
          onChange(clamp(value + (e.key === grow ? 16 : -16)));
        } else if (e.key === "Enter") {
          e.preventDefault();
          onChange(def);
        }
      }}
    >
      {/* 细分隔线 + 悬停橙色高亮，视觉清晰且全高可拖 */}
      <span className="h-full w-px bg-line/80 transition-colors group-hover:w-[3px] group-hover:bg-accent group-active:w-[3px] group-active:bg-accent" />
    </div>
  );
}

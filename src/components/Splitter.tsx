"use client";

import { useRef } from "react";

/**
 * 借鉴 SubCast 的三栏拖拽分隔线：
 * - 拖动调整左侧或右侧栏宽度（setPointerCapture 防脱手）
 * - 拖过 snap 阈值松手自动折叠
 * - 双击恢复默认宽度
 * - 支持键盘左右方向键微调（16px）与 Enter 重置
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
      title="拖动调整宽度 · 双击恢复默认"
      className="group relative hidden w-3 shrink-0 cursor-col-resize select-none items-center justify-center md:flex"
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
      <span className="h-14 w-1 rounded-full bg-line transition-colors group-hover:bg-accent group-active:bg-accent" />
    </div>
  );
}

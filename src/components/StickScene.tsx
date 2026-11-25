"use client";

import { useEffect, useRef, useState } from "react";

const loaded = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loaded.get(src);
  if (existing) return existing;
  const p = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
  loaded.set(src, p);
  return p;
}

export default function StickScene({
  scene,
  caption,
  play = "view",
  height = 230,
  compact = false,
  triggerKey = 0,
}: {
  scene: string;
  caption?: string;
  play?: "view" | "click" | "hover" | "loop";
  height?: number;
  compact?: boolean;
  /** 递增即可从外部按钮触发动画播放 */
  triggerKey?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    loadScript("/scenes/stick.js")
      .then(() => loadScript("/scenes/theme.js"))
      .then(() => loadScript(`/scenes/${scene}.js`))
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
  }, [scene]);

  useEffect(() => {
    const host = hostRef.current;
    if (!ready || !host) return;
    host.innerHTML = "";
    const el = document.createElement("stick-scene");
    el.setAttribute("scene", scene);
    el.setAttribute("play", play);
    el.setAttribute("no-font", "");
    el.style.height = `${height}px`;
    el.style.width = "100%";
    el.style.cursor = "pointer";
    host.appendChild(el);
    elRef.current = el;
    return () => {
      elRef.current = null;
      host.innerHTML = "";
    };
  }, [ready, scene, play, height]);

  // 外部按钮触发（如 About 页点「投喂小橘子」）直接模拟点击画布播放
  useEffect(() => {
    if (triggerKey > 0 && elRef.current) {
      elRef.current.click();
    }
  }, [triggerKey]);

  return (
    <figure className={`${compact ? "" : "my-5"} overflow-hidden rounded-2xl border-[1.5px] border-line bg-white`}>
      <div
        ref={hostRef}
        className="w-full"
        style={{
          minHeight: `${height}px`,
          backgroundImage: "radial-gradient(#e7e2da 1px, transparent 1.2px)",
          backgroundSize: "14px 14px",
        }}
      />
      <figcaption className="flex items-center justify-between gap-2 border-t border-line/70 bg-paper px-3.5 py-2 text-[11px] text-ink-soft">
        <span className="truncate">{caption || "点一下小人互动演示"}</span>
        <span className="shrink-0 font-bold text-accent-dark">点击互动 ↻</span>
      </figcaption>
    </figure>
  );
}

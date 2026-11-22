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
}: {
  scene: string;
  caption?: string;
  play?: "view" | "click" | "hover" | "loop";
  height?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
    host.appendChild(el);
    return () => {
      host.innerHTML = "";
    };
  }, [ready, scene, play, height]);

  return (
    <figure className="my-5 overflow-hidden rounded-2xl border-[1.5px] border-line bg-white">
      <div
        ref={hostRef}
        className="w-full"
        style={{
          minHeight: `${height}px`,
          backgroundImage: "radial-gradient(#e7e2da 1px, transparent 1.2px)",
          backgroundSize: "14px 14px",
        }}
      />
      <figcaption className="flex items-center justify-between gap-3 border-t border-line/70 bg-paper px-4 py-2.5 text-xs text-ink-soft">
        <span>{caption || "点一下动画可以重播"}</span>
        <span className="shrink-0 font-medium text-accent-dark">点击重播 ↻</span>
      </figcaption>
    </figure>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EPISODES, secToTime, timeToSec, type Chapter, type Episode } from "@/data/podcasts";
import { getCase } from "@/data/cases";
import { getBodyRole } from "@/data/body-pedia";
import { useAudio } from "@/lib/audio";
import PodcastInfographic from "./PodcastInfographic";
import Splitter from "./Splitter";

/* eslint-disable @next/next/no-img-element */

const LAYOUT_KEY = "health-podcast-layout-v1";
const SIDEBAR = { min: 176, max: 320, def: 224, snap: 120 };
const PANEL = { min: 320, max: 720, def: 440, snap: 240 };

interface PaneLayout {
  sidebar: number;
  sideOpen: boolean;
  panel: number;
  panelOpen: boolean;
}

interface QAItem {
  q: string;
  a: string;
  mode: "ai" | "local";
}

const VIDEO_KEY = "health-podcast-videos-v1";

function parseVideoInput(input: string): { platform: "bilibili" | "youtube"; id: string } | null {
  const s = input.trim();
  const bv = s.match(/BV[0-9A-Za-z]{10}/);
  if (bv) return { platform: "bilibili", id: bv[0] };
  const yt = s.match(/(?:v=|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/);
  if (yt) return { platform: "youtube", id: yt[1] };
  return null;
}

const PRESET_PROMPTS: { title: string; desc: string; prompt: string }[] = [
  {
    title: "三分钟看懂这期",
    desc: "用三分钟能读完的篇幅讲清这期主要聊了什么、得出了什么核心结论",
    prompt: "用三分钟能读完的篇幅讲清这期节目：主要聊了什么、得出了什么核心结论？请带上关键时间码。",
  },
  {
    title: "最有价值的观点",
    desc: "按重要性列出这期信息量最高的 5 个观点，每条一句话讲透",
    prompt: "列出这期最有信息量的 5 个观点，按重要性排序，每条一句话讲透并附时间码。",
  },
  {
    title: "嘉宾是谁",
    desc: "结合节目介绍嘉宾的身份、专业背景，为什么他的观点值得听",
    prompt: "嘉宾是谁？结合节目内容介绍他的身份、专业背景，说明为什么他的观点值得听。",
  },
  {
    title: "反直觉和有争议的地方",
    desc: "通常大家怎么看 vs 嘉宾怎么说，哪些观点最颠覆常识",
    prompt: "这期有哪些反直觉或颠覆常识的观点？对比通常大家怎么看、嘉宾怎么说，附时间码。",
  },
  {
    title: "数据和量化建议",
    desc: "把节目里出现的具体数字、频率和可执行指标整理清楚",
    prompt: "把节目里出现的具体数字、饮食或运动量化建议整理成清单，附时间码。",
  },
  {
    title: "我能用上什么",
    desc: "站在普通人角度，明天就能马上照着做的 3 件事",
    prompt: "站在普通人角度，这期有哪些明天就能马上用到生活里的具体做法？给 3 条即可。",
  },
  {
    title: "术语和黑话",
    desc: "列出节目里的专业名词，用大白话讲明白",
    prompt: "列出这期节目里出现的专业术语或医学名词，用大白话逐个讲明白。",
  },
  {
    title: "写一段分享",
    desc: "把这期精华写成 180 字以内适合发朋友圈或家族群的口语分享",
    prompt: "把这期的精华写成一段适合发朋友圈或家族群的口语化分享，180 字以内，真实不浮夸。",
  },
];

export default function PodcastStudio() {
  const audio = useAudio();
  const ep = audio.episode;
  const [mediaMode, setMediaMode] = useState<"audio" | "video">("audio");
  const [rightTab, setRightTab] = useState<"subtitle" | "poster" | "guide" | "qa">("subtitle");
  const [query, setQuery] = useState("");
  const [customVideos, setCustomVideos] = useState<Record<string, { platform: "bilibili" | "youtube"; id: string }>>({});
  const [videoDraft, setVideoDraft] = useState("");
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Record<string, QAItem[]>>({});
  const [pane, setPane] = useState<PaneLayout>({
    sidebar: SIDEBAR.def,
    sideOpen: true,
    panel: PANEL.def,
    panelOpen: true,
  });
  const activeSubRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPane((prev) => ({ ...prev, ...saved }));
    } catch {}
  }, []);

  const updatePane = (patch: Partial<PaneLayout>) => {
    setPane((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const allChapters: Chapter[] = useMemo(() => ep.sections.flatMap((s) => s.chapters), [ep]);
  const activeVideo = customVideos[ep.id] ?? ep.video ?? null;

  // 按播客节目分组，供左栏订阅列表展示
  const shows = useMemo(() => {
    const map = new Map<string, Episode[]>();
    for (const item of EPISODES) {
      map.set(item.show, [...(map.get(item.show) ?? []), item]);
    }
    return Array.from(map.entries());
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(VIDEO_KEY) || "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomVideos(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (audio.playing && rightTab === "subtitle" && activeSubRef.current) {
      activeSubRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [audio.activeSegIndex, audio.playing, rightTab]);

  const saveCustomVideo = () => {
    const parsed = parseVideoInput(videoDraft);
    if (!parsed) return;
    const next = { ...customVideos, [ep.id]: parsed };
    setCustomVideos(next);
    try {
      localStorage.setItem(VIDEO_KEY, JSON.stringify(next));
    } catch {}
    setVideoDraft("");
  };

  const askQA = async (question = qaInput) => {
    const text = question.trim();
    if (text.length < 2 || qaLoading) return;
    setQaInput("");
    setQaLoading(true);
    setRightTab("qa");
    try {
      const r = await fetch("/api/podcast-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId: ep.id, question: text }),
      });
      const j = await r.json();
      if (r.ok && j.answer) {
        setQaHistory((prev) => ({
          ...prev,
          [ep.id]: [{ q: text, a: j.answer, mode: j.mode }, ...(prev[ep.id] ?? [])],
        }));
      }
    } finally {
      setQaLoading(false);
    }
  };

  const activeChapterIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < allChapters.length; i++) {
      if (timeToSec(allChapters[i].time) <= audio.currentTime + 1) idx = i;
    }
    return idx;
  }, [allChapters, audio.currentTime]);

  const currentLine =
    audio.transcript && audio.activeSegIndex >= 0
      ? audio.transcript[audio.activeSegIndex]?.text
      : allChapters[activeChapterIdx]?.title ?? ep.title;
  const nextLine =
    audio.transcript && audio.activeSegIndex >= 0
      ? audio.transcript[audio.activeSegIndex + 1]?.text ?? ""
      : allChapters[activeChapterIdx + 1]?.title ?? "";

  const q = query.trim().toLowerCase();
  const epQA = qaHistory[ep.id] ?? [];

  const renderWithTimestamps = (text: string) => {
    const parts = text.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]$/);
      if (m) {
        return (
          <button
            key={i}
            onClick={() => {
              setMediaMode("audio");
              audio.seekTo(timeToSec(m[1]));
            }}
            className="mx-0.5 inline-block cursor-pointer rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs font-bold text-accent-dark hover:bg-accent hover:text-white"
          >
            ▶ {m[1]}
          </button>
        );
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* 手机端顶部横向节目切换条（768px 以上直接展示左栏） */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 md:hidden">
        {EPISODES.map((item) => {
          const active = item.id === ep.id;
          return (
            <button
              key={item.id}
              onClick={() => audio.selectEpisode(item.id)}
              className={`flex w-60 shrink-0 cursor-pointer items-center gap-2.5 rounded-2xl border-[1.5px] p-2.5 text-left transition ${
                active ? "border-ink bg-accent-soft/70" : "border-line bg-white"
              }`}
            >
              <img src={item.cover} alt={item.show} className="h-11 w-11 shrink-0 rounded-xl border border-line object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-accent-dark">{item.show}</p>
                <p className="line-clamp-2 text-xs font-bold leading-snug text-ink">{item.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 桌面端（>=768px）仿 SubCast 可拖拽调宽三栏：左 节目列表 | Splitter | 中 播放器 | Splitter | 右 AI/字幕/一图读懂 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-0">
        {/* ① 左栏：播客节目与单集列表（可拖动调宽 / 折叠为封面窄条） */}
        <aside
          style={{ width: pane.sideOpen ? `${pane.sidebar}px` : "64px" }}
          className="hidden shrink-0 rounded-2xl border border-line bg-white/90 p-3 md:sticky md:top-20 md:block"
        >
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            {pane.sideOpen ? (
              <>
                <h1 className="font-display text-xl text-ink">播客精读</h1>
                <button
                  onClick={() => updatePane({ sideOpen: false })}
                  className="cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-bold text-ink-soft hover:bg-cream hover:text-ink"
                  title="收起左栏"
                >
                  «
                </button>
              </>
            ) : (
              <button
                onClick={() => updatePane({ sideOpen: true })}
                className="mx-auto cursor-pointer rounded-md px-2 py-0.5 text-xs font-bold text-ink-soft hover:bg-cream hover:text-ink"
                title="展开节目栏"
              >
                »
              </button>
            )}
          </div>

          <div className="mt-3 space-y-4">
            {shows.map(([showName, items]) => (
              <div key={showName} className="space-y-1.5">
                {pane.sideOpen && <p className="px-2 text-[11px] font-bold tracking-wide text-ink-soft">{showName}</p>}
                <div className="space-y-1">
                  {items.map((item) => {
                    const active = item.id === ep.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => audio.selectEpisode(item.id)}
                        title={item.title}
                        className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl p-1.5 text-left transition ${
                          active ? "bg-accent-soft/80 text-ink" : "text-ink-soft hover:bg-cream hover:text-ink"
                        } ${pane.sideOpen ? "" : "justify-center"}`}
                      >
                        <img
                          src={item.cover}
                          alt={item.show}
                          className={`h-9 w-9 shrink-0 rounded-lg border object-cover ${active ? "border-accent" : "border-line"}`}
                        />
                        {pane.sideOpen && (
                          <div className="min-w-0 flex-1">
                            <p className={`line-clamp-2 text-xs leading-snug ${active ? "font-bold text-ink" : "font-medium"}`}>
                              {item.title}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-ink-soft">{item.minutes} 分钟</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {pane.sideOpen && (
            <div className="mt-5 rounded-xl bg-cream p-3 text-[11px] leading-relaxed text-ink-soft">
              拖动中间分隔线可调宽任意栏，双击恢复默认。
            </div>
          )}
        </aside>

        {/* 左-中拖拽分隔线 */}
        <Splitter
          value={pane.sideOpen ? pane.sidebar : 64}
          min={SIDEBAR.min}
          max={SIDEBAR.max}
          def={SIDEBAR.def}
          snap={SIDEBAR.snap}
          edge="right"
          label="调节左侧节目栏宽度"
          onChange={(w) => updatePane({ sidebar: w, sideOpen: true })}
          onCollapse={() => updatePane({ sideOpen: false })}
        />

        {/* ② 中栏：极简居中封面 + 歌词式滚动字幕 + 播控 + 简介 */}
        <section className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-ink-soft">
                {ep.show} · {ep.pubDate} · {ep.minutes} 分钟
              </p>
              <h2 className="font-display mt-1 text-2xl leading-snug text-ink sm:text-[26px]">{ep.title}</h2>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="inline-flex rounded-lg border border-line bg-white p-0.5 text-xs font-bold">
                <button
                  onClick={() => setMediaMode("video")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 transition ${mediaMode === "video" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
                >
                  视频
                </button>
                <button
                  onClick={() => setMediaMode("audio")}
                  className={`cursor-pointer rounded-md px-2.5 py-1 transition ${mediaMode === "audio" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
                >
                  仅音频
                </button>
              </div>
              {!pane.panelOpen && (
                <button
                  onClick={() => updatePane({ panelOpen: true })}
                  className="hidden cursor-pointer rounded-lg border border-ink bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-dark md:inline-flex"
                  title="展开右侧字幕/一图读懂/AI栏"
                >
                  展开右栏
                </button>
              )}
            </div>
          </div>

          {mediaMode === "video" ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-white">
              {activeVideo ? (
                <iframe
                  src={
                    activeVideo.platform === "bilibili"
                      ? `https://player.bilibili.com/player.html?bvid=${activeVideo.id}&high_quality=1&danmaku=0`
                      : `https://www.youtube.com/embed/${activeVideo.id}`
                  }
                  className="h-full w-full border-0"
                  allowFullScreen
                  title={ep.title}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-cream p-5 text-center">
                  <p className="text-sm font-bold text-ink">粘贴本期 B站 BV 号或 YouTube 链接，站内直接看视频</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCustomVideo();
                    }}
                    className="mt-3 flex w-full max-w-sm gap-2"
                  >
                    <input
                      value={videoDraft}
                      onChange={(e) => setVideoDraft(e.target.value)}
                      placeholder="例如 BV1xxxxxxxxx 或 YouTube 链接"
                      className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-ink"
                    />
                    <button type="submit" className="cursor-pointer rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-white">
                      载入
                    </button>
                  </form>
                  {ep.videoSearchUrl && (
                    <a href={ep.videoSearchUrl} target="_blank" rel="noreferrer" className="mt-3 text-xs font-bold text-accent-dark hover:underline">
                      去 B站 找本期视频播客 ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-line bg-white px-5 py-7 text-center sm:px-8">
              <div className="mx-auto aspect-square w-48 overflow-hidden rounded-2xl border border-line/80 shadow-[0_14px_34px_rgba(28,25,23,0.12)] sm:w-56">
                <img src={ep.cover} alt={ep.title} className="h-full w-full object-cover" />
              </div>
              <div className="mx-auto mt-6 min-h-[76px] max-w-md space-y-2">
                <p className="text-[17px] font-bold leading-snug text-ink">{currentLine}</p>
                {nextLine && <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft/60">{nextLine}</p>}
              </div>
            </div>
          )}

          {/* 极简播放条 */}
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2.5 sm:gap-2.5 sm:px-3.5">
            <button onClick={() => audio.skip(-15)} className="cursor-pointer text-xs font-bold text-ink-soft hover:text-ink" title="后退 15 秒">
              ↺15
            </button>
            <button
              onClick={audio.togglePlay}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-xs font-bold text-white transition hover:scale-105"
              aria-label={audio.playing ? "暂停" : "播放"}
            >
              {audio.playing ? "❚❚" : "▶"}
            </button>
            <button onClick={() => audio.skip(30)} className="cursor-pointer text-xs font-bold text-ink-soft hover:text-ink" title="前进 30 秒">
              30↻
            </button>
            <span className="shrink-0 font-mono text-[11px] text-ink-soft">{secToTime(audio.currentTime)}</span>
            <input
              type="range"
              min={0}
              max={audio.duration}
              value={audio.currentTime}
              onChange={(e) => audio.seekTo(Number(e.target.value), false)}
              aria-label="进度条"
              className="min-w-0 flex-1 accent-[#f97316]"
            />
            <span className="shrink-0 font-mono text-[11px] text-ink-soft">{secToTime(audio.duration)}</span>
            <button onClick={audio.cycleRate} className="shrink-0 cursor-pointer rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] font-bold hover:border-ink">
              {audio.rate}x
            </button>
          </div>

          <details open className="rounded-2xl border border-line bg-white p-4">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-ink">
              <span>本集简介</span>
              <a
                href={ep.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold text-accent-dark hover:underline"
              >
                小宇宙原页 ↗
              </a>
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{ep.hook}</p>
            <p className="mt-2 text-[11px] text-ink-soft/80">嘉宾：{ep.guest}</p>
          </details>
        </section>

        {/* 中-右拖拽分隔线（拉宽右栏看大图「一图读懂」超爽） */}
        {pane.panelOpen && (
          <Splitter
            value={pane.panel}
            min={PANEL.min}
            max={PANEL.max}
            def={PANEL.def}
            snap={PANEL.snap}
            edge="left"
            label="调节右侧精读与一图读懂栏宽度"
            onChange={(w) => updatePane({ panel: w })}
            onCollapse={() => updatePane({ panelOpen: false })}
          />
        )}

        {/* ③ 右栏：字幕 / 一图读懂 / 导读 / 问答（桌面端按 pane.panel 宽度自适应，手机端全宽） */}
        {pane.panelOpen && (
          <section
            style={{ "--panel-w": `${pane.panel}px` } as React.CSSProperties}
            className="panel min-h-[560px] w-full shrink-0 bg-white p-4 sm:p-5 md:sticky md:top-20 md:w-[var(--panel-w)]"
          >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <div className="flex gap-1 overflow-x-auto">
              {(
                [
                  ["subtitle", "字幕"],
                  ["poster", "一图读懂"],
                  ["guide", "导读"],
                  ["qa", "问答"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className={`shrink-0 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold transition sm:text-sm ${
                    rightTab === id ? "border-b-2 border-ink bg-cream text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {(rightTab === "subtitle" || rightTab === "guide") && (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜关键词…"
                className="w-28 rounded-lg border border-line bg-cream/60 px-2 py-1 text-xs outline-none focus:border-ink sm:w-32"
              />
            )}
          </div>

          {/* Tab 1: 简体字幕（自动高亮并滚入视野） */}
          {rightTab === "subtitle" && (
            <div className="mt-3 max-h-[540px] space-y-1.5 overflow-y-auto pr-1">
              {audio.transcript ? (
                audio.transcript
                  .filter((s) => !q || s.text.toLowerCase().includes(q))
                  .map((s, i) => {
                    const isNow = !q && i === audio.activeSegIndex;
                    return (
                      <button
                        key={i}
                        ref={isNow ? activeSubRef : undefined}
                        onClick={() => {
                          setMediaMode("audio");
                          audio.seekTo(s.start);
                        }}
                        className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition ${
                          isNow ? "border-accent/40 bg-accent-soft/65" : "border-transparent hover:bg-cream"
                        }`}
                      >
                        <span className={`mt-0.5 shrink-0 font-mono text-xs ${isNow ? "font-bold text-accent-dark" : "text-ink-soft"}`}>
                          {secToTime(s.start)}
                        </span>
                        <span className="flex-1 leading-relaxed text-ink">{s.text}</span>
                      </button>
                    );
                  })
              ) : (
                allChapters
                  .filter((ch) => !q || ch.title.toLowerCase().includes(q))
                  .map((ch, idx) => {
                    const isNow = idx === activeChapterIdx;
                    return (
                      <button
                        key={ch.time}
                        onClick={() => {
                          setMediaMode("audio");
                          audio.seekTo(timeToSec(ch.time));
                        }}
                        className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition ${
                          isNow ? "border-accent/40 bg-accent-soft/65" : "border-transparent hover:bg-cream"
                        }`}
                      >
                        <span className={`mt-0.5 shrink-0 font-mono text-xs ${isNow ? "font-bold text-accent-dark" : "text-ink-soft"}`}>
                          {ch.time}
                        </span>
                        <span className="flex-1 leading-relaxed text-ink">{ch.title}</span>
                      </button>
                    );
                  })
              )}
            </div>
          )}

          {/* Tab 2: 一图读懂 + 导出 3:4 PNG 分享图 */}
          {rightTab === "poster" && (
            <div className="mt-4 max-h-[540px] overflow-y-auto pr-1">
              <PodcastInfographic
                ep={ep}
                onSeek={(sec) => {
                  setMediaMode("audio");
                  audio.seekTo(sec);
                }}
              />
            </div>
          )}

          {/* Tab 3: 导读 */}
          {rightTab === "guide" && (
            <div className="mt-4 max-h-[540px] space-y-5 overflow-y-auto pr-1">
              {ep.sections.map((sec) => (
                <div key={sec.title} className="space-y-2">
                  <h3 className="text-xs font-bold text-accent-dark">{sec.title}</h3>
                  <ul className="divide-y divide-line">
                    {sec.chapters
                      .filter((ch) => !q || ch.title.toLowerCase().includes(q))
                      .map((ch) => {
                        const c = ch.caseSlug ? getCase(ch.caseSlug) : undefined;
                        const r = ch.bodyRole ? getBodyRole(ch.bodyRole) : undefined;
                        return (
                          <li key={ch.time} className="py-2.5">
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => {
                                  setMediaMode("audio");
                                  audio.seekTo(timeToSec(ch.time));
                                }}
                                className="mt-0.5 shrink-0 cursor-pointer font-mono text-xs font-bold text-accent-dark hover:underline"
                              >
                                {ch.time}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-ink">{ch.title}</p>
                                {(c || r) && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {c && (
                                      <Link
                                        href={`/cases/${c.slug}`}
                                        className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-[11px] font-bold text-accent-dark hover:border-accent"
                                      >
                                        对照谣言：「{c.claim}」→
                                      </Link>
                                    )}
                                    {r && (
                                      <Link
                                        href={`/body?tab=roles&role=${r.slug}`}
                                        className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-bold text-ink-soft hover:border-ink hover:text-ink"
                                      >
                                        身体图解：{r.name} →
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: AI 问答（8 项预置提问卡 + 自由追问） */}
          {rightTab === "qa" && (
            <div className="mt-4 flex h-[520px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {epQA.length > 0 && (
                  <div className="space-y-3 pb-2">
                    {epQA.map((item, idx) => (
                      <div key={idx} className="space-y-2 rounded-2xl border border-line bg-cream/40 p-3.5 text-sm">
                        <p className="font-bold text-ink">问：{item.q}</p>
                        <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">{renderWithTimestamps(item.a)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-bold text-ink-soft">问问这期节目（点卡片即问，引用处带时间码可跳播）：</p>
                  <div className="grid gap-2">
                    {PRESET_PROMPTS.map((p) => (
                      <button
                        key={p.title}
                        onClick={() => askQA(p.prompt)}
                        disabled={qaLoading}
                        className="cursor-pointer rounded-xl border border-line bg-white px-3.5 py-2.5 text-left transition hover:border-accent hover:bg-accent-soft/30 disabled:opacity-50"
                      >
                        <p className="text-sm font-bold text-ink">{p.title}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-soft">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askQA();
                }}
                className="mt-3 flex gap-2 border-t border-line pt-3"
              >
                <input
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="自由提问本期播客内容…"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-cream/50 px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <button type="submit" disabled={qaLoading || qaInput.trim().length < 2} className="btn !py-2 text-xs">
                  {qaLoading ? "思考中…" : "提问"}
                </button>
              </form>
            </div>
          )}
          </section>
        )}
      </div>
    </div>
  );
}

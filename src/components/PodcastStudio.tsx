"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EPISODES, secToTime, timeToSec, type Chapter, type Episode } from "@/data/podcasts";
import { getCase } from "@/data/cases";
import { getBodyRole } from "@/data/body-pedia";
import { useAudio } from "@/lib/audio";
import PodcastInfographic from "./PodcastInfographic";
import PodcastMarkdown from "./PodcastMarkdown";
import Splitter from "./Splitter";

/* eslint-disable @next/next/no-img-element */

const LAYOUT_KEY = "health-podcast-layout-v2";
const VIDEO_KEY = "health-podcast-videos-v1";
const GUIDE_KEY = "health-podcast-guide-v1";
const CHAT_KEY = "health-podcast-chat-v1";
const USAGE_KEY = "health-podcast-qa-use-v1";

const SIDEBAR = { min: 176, max: 340, def: 224, snap: 120 };
const PANEL = { min: 320, max: 820, def: 460, snap: 220 };

interface PaneLayout {
  sidebar: number;
  sideOpen: boolean;
  panel: number;
  panelOpen: boolean;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

function parseVideoInput(input: string): { platform: "bilibili" | "youtube"; id: string } | null {
  const s = input.trim();
  const bv = s.match(/BV[0-9A-Za-z]{10}/);
  if (bv) return { platform: "bilibili", id: bv[0] };
  const yt = s.match(/(?:v=|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})/);
  if (yt) return { platform: "youtube", id: yt[1] };
  return null;
}

/** 复刻 SubCast 的预置提问卡，支持按点击次数自动排序 */
const PRESET_PROMPTS: { id: string; title: string; desc: string; prompt: string }[] = [
  {
    id: "tldr",
    title: "三分钟看懂这期",
    desc: "用三分钟能读完的篇幅讲清这期主要聊了什么、得出了什么核心结论",
    prompt: "用三分钟能读完的篇幅讲清这期节目：主要聊了什么、得出了什么核心结论？请带上关键时间戳。",
  },
  {
    id: "key-points",
    title: "最有价值的观点",
    desc: "按重要性列出这期信息量最高的 5–8 个观点，每条一句话讲透",
    prompt: "列出这期最有信息量的 5 到 8 个观点，按重要性排序，每条先给一句话结论再给理由，并附时间戳。",
  },
  {
    id: "guest",
    title: "嘉宾是谁",
    desc: "结合节目介绍嘉宾的身份、专业背景，为什么他的观点值得听",
    prompt: "嘉宾是谁？结合节目内容介绍他的身份、专业背景与代表经历，说明为什么他的观点值得听。",
  },
  {
    id: "counterintuitive",
    title: "反直觉和有争议的地方",
    desc: "通常大家怎么看 vs 嘉宾怎么说，哪些观点最颠覆常识",
    prompt: "这期有哪些反直觉或有争议的观点？逐条对比「通常大家怎么看」和「嘉宾怎么说」，附时间戳。",
  },
  {
    id: "numbers",
    title: "数据和量化建议",
    desc: "把节目里出现的具体数字、频率和可执行指标整理清楚",
    prompt: "把节目里出现的具体数字、时间表、饮食或运动量化建议整理成清单，并附时间戳。",
  },
  {
    id: "actionable",
    title: "我能用上什么",
    desc: "站在普通人角度，明天就能马上照着做的 3 件事",
    prompt: "站在普通人角度，这期有哪些明天就能马上用到日常生活里的具体做法？给出 3 到 5 条可执行建议并附时间戳。",
  },
  {
    id: "jargon",
    title: "术语和黑话",
    desc: "列出节目里的专业名词，用大白话逐个讲明白",
    prompt: "列出这期节目里出现的专业术语或医学名词，用大白话逐个讲明白，并附时间戳。",
  },
  {
    id: "share",
    title: "写一段分享",
    desc: "把这期精华写成 180 字以内适合发朋友圈或家族群的口语分享",
    prompt: "把这期的精华写成一段适合发朋友圈或家族群的口语化分享，180 字以内，真实克制不浮夸。",
  },
];

async function streamPodcastAI(
  payload: Record<string, unknown>,
  signal: AbortSignal,
  onDelta: (chunk: string) => void
) {
  const res = await fetch("/api/podcast-qa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    let msg = `请求失败 (HTTP ${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  if (!res.body) {
    const txt = await res.text();
    if (txt) onDelta(txt);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) onDelta(chunk);
  }
  const rest = decoder.decode();
  if (rest) onDelta(rest);
}

export default function PodcastStudio() {
  const audio = useAudio();
  const ep = audio.episode;

  const [isDesktop, setIsDesktop] = useState(false);
  const [mediaMode, setMediaMode] = useState<"audio" | "video">("audio");
  const [rightTab, setRightTab] = useState<"subtitle" | "poster" | "guide" | "qa">("subtitle");
  const [query, setQuery] = useState("");
  const [customVideos, setCustomVideos] = useState<Record<string, { platform: "bilibili" | "youtube"; id: string }>>({});
  const [videoDraft, setVideoDraft] = useState("");

  // 三栏宽度状态（支持 localStorage 记忆）
  const [pane, setPane] = useState<PaneLayout>({
    sidebar: SIDEBAR.def,
    sideOpen: true,
    panel: PANEL.def,
    panelOpen: true,
  });

  // SubCast 风格 AI 导读状态（按集缓存 + 流式生成 + 可随时停止）
  const [guides, setGuides] = useState<Record<string, string>>({});
  const [guideStreaming, setGuideStreaming] = useState(false);
  const [guideError, setGuideError] = useState("");
  const guideAbortRef = useRef<AbortController | null>(null);

  // SubCast 风格多轮流式 AI 问答状态（按集缓存 + 使用频率排序 + 停止/重试/新对话）
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({});
  const [qaUsage, setQaUsage] = useState<Record<string, number>>({});
  const [qaInput, setQaInput] = useState("");
  const [qaStreaming, setQaStreaming] = useState(false);
  const [qaError, setQaError] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const qaAbortRef = useRef<AbortController | null>(null);
  const qaEndRef = useRef<HTMLDivElement>(null);
  const activeSubRef = useRef<HTMLButtonElement>(null);

  // 监听桌面断点，确保内联 width 仅在 md (>=768px) 生效，避免与 Tailwind 媒体查询冲突
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 读取本地持久化状态
  useEffect(() => {
    try {
      const savedPane = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");
      setPane((prev) => ({ ...prev, ...savedPane }));
    } catch {}
    try {
      setCustomVideos(JSON.parse(localStorage.getItem(VIDEO_KEY) || "{}"));
    } catch {}
    try {
      setGuides(JSON.parse(localStorage.getItem(GUIDE_KEY) || "{}"));
    } catch {}
    try {
      setChats(JSON.parse(localStorage.getItem(CHAT_KEY) || "{}"));
    } catch {}
    try {
      setQaUsage(JSON.parse(localStorage.getItem(USAGE_KEY) || "{}"));
    } catch {}
  }, []);

  // 切换单集时中止上一集未完成的流
  useEffect(() => {
    guideAbortRef.current?.abort();
    qaAbortRef.current?.abort();
    setGuideStreaming(false);
    setQaStreaming(false);
    setGuideError("");
    setQaError("");
  }, [ep.id]);

  // 字幕跟随播放滚动
  useEffect(() => {
    if (audio.playing && rightTab === "subtitle" && activeSubRef.current) {
      activeSubRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [audio.activeSegIndex, audio.playing, rightTab]);

  // 问答流式输出时滚到底部
  useEffect(() => {
    if (qaStreaming && rightTab === "qa") {
      qaEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [chats, qaStreaming, rightTab]);

  const updatePane = (patch: Partial<PaneLayout>) => {
    setPane((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const persistGuides = (next: Record<string, string>) => {
    try {
      localStorage.setItem(GUIDE_KEY, JSON.stringify(next));
    } catch {}
  };

  const persistChats = (next: Record<string, ChatMsg[]>) => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(next));
    } catch {}
  };

  const jumpTo = (sec: number) => {
    setMediaMode("audio");
    audio.seekTo(sec);
  };

  const allChapters: Chapter[] = useMemo(() => ep.sections.flatMap((s) => s.chapters), [ep]);
  const activeVideo = customVideos[ep.id] ?? ep.video ?? null;

  const shows = useMemo(() => {
    const map = new Map<string, Episode[]>();
    for (const item of EPISODES) {
      map.set(item.show, [...(map.get(item.show) ?? []), item]);
    }
    return Array.from(map.entries());
  }, []);

  // 按使用频率排序的预置提问卡（SubCast byUse 逻辑）
  const orderedPresets = useMemo(
    () => [...PRESET_PROMPTS].sort((a, b) => (qaUsage[b.id] ?? 0) - (qaUsage[a.id] ?? 0)),
    [qaUsage]
  );

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

  // 生成 / 重新生成 SubCast 5 段结构化 AI 导读
  const generateGuide = async () => {
    if (guideStreaming) return;
    const epId = ep.id;
    const ctrl = new AbortController();
    guideAbortRef.current = ctrl;
    setGuideStreaming(true);
    setGuideError("");
    let acc = "";
    setGuides((prev) => ({ ...prev, [epId]: "" }));

    try {
      await streamPodcastAI({ episodeId: epId, action: "guide" }, ctrl.signal, (chunk) => {
        acc += chunk;
        setGuides((prev) => ({ ...prev, [epId]: acc }));
      });
      setGuides((prev) => {
        const next = { ...prev, [epId]: acc };
        persistGuides(next);
        return next;
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setGuideError((err as Error).message || "导读生成失败，请稍后重试");
      } else if (acc) {
        setGuides((prev) => {
          const next = { ...prev, [epId]: acc };
          persistGuides(next);
          return next;
        });
      }
    } finally {
      setGuideStreaming(false);
    }
  };

  const stopGuide = () => {
    guideAbortRef.current?.abort();
    setGuideStreaming(false);
  };

  // 发送多轮流式 AI 问答
  const sendChat = async (question = qaInput, presetId?: string) => {
    const text = question.trim();
    if (text.length < 2 || qaStreaming) return;
    const epId = ep.id;

    if (presetId) {
      setQaUsage((prev) => {
        const next = { ...prev, [presetId]: (prev[presetId] ?? 0) + 1 };
        try {
          localStorage.setItem(USAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    }

    setQaInput("");
    setShowPresets(false);
    setQaError("");
    setRightTab("qa");

    const baseHistory = chats[epId] ?? [];
    const reqMessages: ChatMsg[] = [...baseHistory, { role: "user", content: text }];
    const withPlaceholder: ChatMsg[] = [...reqMessages, { role: "assistant", content: "" }];
    setChats((prev) => ({ ...prev, [epId]: withPlaceholder }));

    const ctrl = new AbortController();
    qaAbortRef.current = ctrl;
    setQaStreaming(true);
    let acc = "";

    try {
      await streamPodcastAI(
        { episodeId: epId, action: "chat", messages: reqMessages },
        ctrl.signal,
        (chunk) => {
          acc += chunk;
          setChats((prev) => {
            const cur = prev[epId] ?? withPlaceholder;
            const updated = [...cur.slice(0, -1), { role: "assistant" as const, content: acc }];
            return { ...prev, [epId]: updated };
          });
        }
      );
      setChats((prev) => {
        const finalList: ChatMsg[] = [...reqMessages, { role: "assistant", content: acc }];
        const next = { ...prev, [epId]: finalList };
        persistChats(next);
        return next;
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setQaError((err as Error).message || "回答生成失败，请重试");
        setChats((prev) => ({ ...prev, [epId]: reqMessages }));
      } else if (acc) {
        setChats((prev) => {
          const finalList: ChatMsg[] = [...reqMessages, { role: "assistant", content: acc }];
          const next = { ...prev, [epId]: finalList };
          persistChats(next);
          return next;
        });
      }
    } finally {
      setQaStreaming(false);
    }
  };

  const stopChat = () => {
    qaAbortRef.current?.abort();
    setQaStreaming(false);
  };

  const clearChat = () => {
    qaAbortRef.current?.abort();
    setQaStreaming(false);
    setQaError("");
    setChats((prev) => {
      const next = { ...prev, [ep.id]: [] };
      persistChats(next);
      return next;
    });
  };

  const retryLastChat = () => {
    const list = chats[ep.id] ?? [];
    const lastUserIdx = [...list].map((m) => m.role).lastIndexOf("user");
    if (lastUserIdx < 0) return;
    const lastQuestion = list[lastUserIdx].content;
    const trimmed = list.slice(0, lastUserIdx);
    setChats((prev) => ({ ...prev, [ep.id]: trimmed }));
    setTimeout(() => sendChat(lastQuestion), 0);
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
  const epGuide = guides[ep.id] ?? "";
  const epChat = chats[ep.id] ?? [];

  return (
    <div className="flex flex-col gap-3 md:h-full md:gap-0">
      {/* 手机端顶部横向节目切换条（768px 以上使用左栏） */}
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

      {/* 桌面端（>=768px）完整复刻 SubCast 全高三栏独立滚动 + 真实拖拽分隔线 */}
      <div className="flex flex-col gap-4 md:min-h-0 md:flex-1 md:flex-row md:items-stretch md:gap-0">
        {/* ① 左栏：播客节目与单集列表 */}
        <aside
          data-pane="sidebar"
          style={isDesktop ? { width: pane.sideOpen ? pane.sidebar : 64 } : undefined}
          className="hidden shrink-0 flex-col overflow-y-auto rounded-2xl border border-line bg-white/90 p-3 md:flex md:h-full"
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

          <div className="mt-3 flex-1 space-y-4">
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
            <div className="mt-4 rounded-xl bg-cream p-3 text-[11px] leading-relaxed text-ink-soft">
              拖动竖线可调宽任意栏，双击恢复默认。AI 导读与问答基于整期完整简体逐字稿。
            </div>
          )}
        </aside>

        {/* 左-中全高拖拽分隔线 */}
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
        <section
          data-pane="stage"
          className="min-w-0 flex-1 space-y-4 md:h-full md:min-w-[280px] md:overflow-y-auto md:px-2 md:py-0.5"
        >
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

        {/* 中-右全高拖拽分隔线（拉宽右栏看大图「一图读懂」或长导读） */}
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

        {/* ③ 右栏：字幕 / 一图读懂 / AI 导读 / 流式 AI 问答 */}
        {pane.panelOpen && (
          <section
            data-pane="panel"
            style={isDesktop ? { width: pane.panel } : undefined}
            className="panel flex min-h-[580px] w-full shrink-0 flex-col bg-white p-4 sm:p-5 md:h-full md:min-h-0 md:overflow-hidden"
          >
            {/* 右栏顶部标签栏 */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
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
              <div className="flex items-center gap-1.5">
                {(rightTab === "subtitle" || rightTab === "guide") && (
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜关键词…"
                    className="w-24 rounded-lg border border-line bg-cream/60 px-2 py-1 text-xs outline-none focus:border-ink sm:w-28"
                  />
                )}
                <button
                  onClick={() => updatePane({ panelOpen: false })}
                  className="hidden cursor-pointer rounded-md px-1.5 py-1 text-xs font-bold text-ink-soft hover:bg-cream hover:text-ink md:inline-flex"
                  title="收起右栏"
                >
                  »
                </button>
              </div>
            </div>

            {/* Tab 1: 简体字幕（自动高亮并滚入视野） */}
            {rightTab === "subtitle" && (
              <div className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
                {audio.transcript ? (
                  audio.transcript
                    .filter((s) => !q || s.text.toLowerCase().includes(q))
                    .map((s, i) => {
                      const isNow = !q && i === audio.activeSegIndex;
                      return (
                        <button
                          key={i}
                          ref={isNow ? activeSubRef : undefined}
                          onClick={() => jumpTo(s.start)}
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
                          onClick={() => jumpTo(timeToSec(ch.time))}
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
              <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                <PodcastInfographic ep={ep} onSeek={jumpTo} />
              </div>
            )}

            {/* Tab 3: SubCast 体系 AI 导读（整期逐字稿 5 段精读 + 官方谣言对照） */}
            {rightTab === "guide" && (
              <div className="mt-3 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
                {/* AI 精读导读区 */}
                <div className="rounded-2xl border border-line bg-cream/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-ink">AI 结构化导读</p>
                      <p className="text-[11px] text-ink-soft">
                        通读整期 {audio.transcript?.length ?? allChapters.length} 段简体逐字稿 · 一句话总结 / 时间线 / 核心观点 / 原话 / 先听这几段
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {guideStreaming ? (
                        <button
                          onClick={stopGuide}
                          className="cursor-pointer rounded-lg border border-ink bg-white px-2.5 py-1 text-xs font-bold text-ink hover:bg-cream"
                        >
                          停止生成
                        </button>
                      ) : (
                        <button
                          onClick={generateGuide}
                          className="cursor-pointer rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent"
                        >
                          {epGuide ? "重新生成" : "生成 AI 导读"}
                        </button>
                      )}
                    </div>
                  </div>

                  {guideError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {guideError}
                    </div>
                  )}

                  {epGuide ? (
                    <div className="mt-3 border-t border-line/80 pt-3">
                      <PodcastMarkdown content={epGuide} onSeek={jumpTo} />
                      {guideStreaming && <span className="mt-1 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />}
                    </div>
                  ) : guideStreaming ? (
                    <p className="mt-3 text-xs text-ink-soft">正在通读整期逐字稿并提炼要点…</p>
                  ) : (
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">
                      点击右上角「生成 AI 导读」，按 SubCast 精读体系提炼 5 段导读，每条结论都附真实时间戳，点一下直接跳播，并自动缓存在本地。
                    </p>
                  )}
                </div>

                {/* 本站官方章节与谣言/身体图解对照 */}
                <details open className="space-y-3">
                  <summary className="cursor-pointer text-xs font-bold text-ink-soft hover:text-ink">
                    本期章节与本站谣言 / 身体图解对照（{allChapters.length} 段）
                  </summary>
                  <div className="space-y-4 pt-1">
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
                                      onClick={() => jumpTo(timeToSec(ch.time))}
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
                </details>
              </div>
            )}

            {/* Tab 4: SubCast 体系流式多轮 AI 问答 */}
            {rightTab === "qa" && (
              <div className="mt-3 flex min-h-0 flex-1 flex-col">
                {epChat.length > 0 && (
                  <div className="mb-2 flex shrink-0 items-center justify-between gap-2 text-xs text-ink-soft">
                    <span>依据整期逐字稿多轮对话 · 共 {Math.ceil(epChat.length / 2)} 轮</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowPresets((v) => !v)}
                        className="cursor-pointer rounded-md border border-line px-2 py-0.5 font-bold hover:border-ink hover:text-ink"
                      >
                        {showPresets ? "收起快捷问" : "快捷提问"}
                      </button>
                      {!qaStreaming && (
                        <>
                          <button
                            onClick={retryLastChat}
                            className="cursor-pointer rounded-md border border-line px-2 py-0.5 font-bold hover:border-ink hover:text-ink"
                          >
                            重试
                          </button>
                          <button
                            onClick={clearChat}
                            className="cursor-pointer rounded-md border border-line px-2 py-0.5 font-bold hover:border-ink hover:text-ink"
                          >
                            新对话
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {epChat.length > 0 && (
                    <div className="space-y-3 pb-2">
                      {epChat.map((m, idx) => {
                        const isLastAssistant = qaStreaming && idx === epChat.length - 1 && m.role === "assistant";
                        return m.role === "user" ? (
                          <div key={idx} className="ml-8 rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2.5 text-sm text-white">
                            {m.content}
                          </div>
                        ) : (
                          <div key={idx} className="rounded-2xl rounded-tl-sm border border-line bg-cream/45 p-3.5">
                            {m.content ? (
                              <PodcastMarkdown content={m.content} onSeek={jumpTo} />
                            ) : (
                              <p className="text-xs text-ink-soft">正在通读逐字稿思考中…</p>
                            )}
                            {isLastAssistant && <span className="mt-1 inline-block h-3.5 w-1.5 animate-pulse bg-accent align-middle" />}
                          </div>
                        );
                      })}
                      <div ref={qaEndRef} />
                    </div>
                  )}

                  {qaError && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      <span>{qaError}</span>
                      <button onClick={retryLastChat} className="cursor-pointer font-bold underline">
                        重试
                      </button>
                    </div>
                  )}

                  {(epChat.length === 0 || showPresets) && (
                    <div className="space-y-2 pb-2">
                      <p className="text-xs font-bold text-ink-soft">
                        问问这期节目（基于整期完整文字稿，引用处带时间码点一下就跳过去听）：
                      </p>
                      <div className="grid gap-2">
                        {orderedPresets.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => sendChat(p.prompt, p.id)}
                            disabled={qaStreaming}
                            className="cursor-pointer rounded-xl border border-line bg-white px-3.5 py-2.5 text-left transition hover:border-accent hover:bg-accent-soft/30 disabled:opacity-50"
                          >
                            <p className="text-sm font-bold text-ink">{p.title}</p>
                            <p className="mt-0.5 truncate text-xs text-ink-soft">{p.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (qaStreaming) stopChat();
                    else sendChat();
                  }}
                  className="mt-3 flex shrink-0 gap-2 border-t border-line pt-3"
                >
                  <input
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    placeholder="基于整期文字稿自由追问…"
                    className="min-w-0 flex-1 rounded-xl border border-line bg-cream/50 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                  {qaStreaming ? (
                    <button type="button" onClick={stopChat} className="cursor-pointer rounded-xl border border-ink bg-white px-3.5 py-2 text-xs font-bold text-ink">
                      停止
                    </button>
                  ) : (
                    <button type="submit" disabled={qaInput.trim().length < 2} className="btn !py-2 text-xs disabled:opacity-40">
                      提问
                    </button>
                  )}
                </form>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EPISODES, secToTime, timeToSec, type Chapter, type Episode } from "@/data/podcasts";
import { getCase } from "@/data/cases";
import { getBodyRole } from "@/data/body-pedia";

/* eslint-disable @next/next/no-img-element */

interface TranscriptSegment {
  start: number;
  end?: number;
  speaker?: string;
  text: string;
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

const STARTER_QS: Record<string, string[]> = {
  "pineapple-131": ["跑步和撸铁只能二选一怎么选？", "增肌要吃多少蛋白质？", "70 多岁爸妈还能练力量吗？"],
  "jingjuli-muscle": ["为什么散步练不出肌肉？", "在家怎么自测肌肉及不及格？", "每天要吃几个鸡蛋多少奶？"],
  "jingjuli-lipids": ["蛋黄到底能不能吃？", "拿到血脂化验单重点看哪两项？", "家常炒菜怎么避开反式脂肪？"],
};

export default function PodcastStudio() {
  const [epId, setEpId] = useState<string>(EPISODES[0].id);
  const [mediaMode, setMediaMode] = useState<"audio" | "video">("audio");
  const [rightTab, setRightTab] = useState<"subtitle" | "guide" | "qa">("subtitle");
  const [query, setQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [customVideos, setCustomVideos] = useState<Record<string, { platform: "bilibili" | "youtube"; id: string }>>({});
  const [videoDraft, setVideoDraft] = useState("");
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Record<string, QAItem[]>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  const ep: Episode = EPISODES.find((e) => e.id === epId) ?? EPISODES[0];
  const allChapters: Chapter[] = useMemo(() => ep.sections.flatMap((s) => s.chapters), [ep]);
  const activeVideo = customVideos[ep.id] ?? ep.video ?? null;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(VIDEO_KEY) || "{}");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCustomVideos(saved);
    } catch {}
  }, []);

  // 加载逐字稿 JSON（如果已转写）
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTranscript(null);
    fetch(`/transcripts/${ep.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && Array.isArray(d?.segments)) setTranscript(d.segments);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ep.id]);

  // 切换单集重置
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
    setPlaying(false);
  }, [ep.id]);

  const seekTo = (sec: number) => {
    setMediaMode("audio");
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = sec;
    a.play().catch(() => {});
    setPlaying(true);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const next = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

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

  const activeChapter = useMemo(() => {
    let best = allChapters[0];
    for (const ch of allChapters) {
      if (timeToSec(ch.time) <= currentTime + 1) best = ch;
    }
    return best;
  }, [allChapters, currentTime]);

  const activeSeg = useMemo(() => {
    if (!transcript) return null;
    return transcript.find((s) => currentTime >= s.start && (s.end ? currentTime < s.end : true)) ?? null;
  }, [transcript, currentTime]);

  const q = query.trim().toLowerCase();
  const epQA = qaHistory[ep.id] ?? [];

  /** 把回答里的 [MM:SS] 或 [HH:MM:SS] 渲染成可点击跳播的橙色按钮 */
  const renderWithTimestamps = (text: string) => {
    const parts = text.split(/(\[\d{1,2}:\d{2}(?::\d{2})?\])/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]$/);
      if (m) {
        return (
          <button
            key={i}
            onClick={() => seekTo(timeToSec(m[1]))}
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
    <div className="space-y-6">
      {/* 顶部带官方封面的单集切换条 */}
      <div className="grid gap-3 md:grid-cols-3">
        {EPISODES.map((item) => {
          const active = item.id === ep.id;
          return (
            <button
              key={item.id}
              onClick={() => setEpId(item.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] p-3 text-left transition ${
                active ? "border-ink bg-accent-soft/70" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <img
                src={item.cover}
                alt={item.show}
                className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-accent-dark">{item.show}</span>
                  <span className="text-ink-soft">{item.minutes} 分钟</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-ink">{item.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* SubCast 同款双栏布局：左侧 封面/视频 + 播控 + 简介；右侧 字幕 / 导读 / 问答 */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        {/* 左栏 */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="space-y-1">
            <p className="text-xs text-ink-soft">
              {ep.show} · {ep.pubDate} · {ep.minutes} 分钟
            </p>
            <h2 className="font-display text-2xl leading-snug text-ink">{ep.title}</h2>
            <p className="text-xs text-ink-soft">{ep.guest}</p>
          </div>

          {/* 视频 / 仅音频 切换（复刻 SubCast 右上角开关） */}
          <div className="flex items-center justify-between">
            <a href={ep.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-accent-dark hover:underline">
              在小宇宙打开 ↗
            </a>
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
          </div>

          {/* 16:9 媒体舞台：封面+叠加字幕 或 B站/YouTube 视频嵌入 */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-[1.5px] border-ink bg-ink">
            {mediaMode === "video" ? (
              activeVideo ? (
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
                  <p className="text-sm font-bold text-ink">粘贴本期 B站 BV 号或 YouTube 链接，即可站内看视频播客</p>
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
              )
            ) : (
              <>
                <img src={ep.cover} alt={ep.title} className="h-full w-full object-cover opacity-50 blur-[2px] scale-105" />
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5">
                  <img src={ep.cover} alt={ep.title} className="h-28 w-28 rounded-2xl border-2 border-white/80 object-cover shadow-lg sm:h-32 sm:w-32" />
                  <button
                    onClick={togglePlay}
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white text-xl font-black text-ink shadow-lg transition hover:scale-105"
                    aria-label={playing ? "暂停" : "播放"}
                  >
                    {playing ? "❚❚" : "▶"}
                  </button>
                </div>
                {/* 底部叠加当前句/当前章节字幕 */}
                <div className="pointer-events-none absolute inset-x-4 bottom-3 text-center">
                  <p className="inline-block rounded-lg bg-black/70 px-3 py-1 text-xs font-medium text-white">
                    {activeSeg ? activeSeg.text : activeChapter ? `[${activeChapter.time}] ${activeChapter.title}` : ep.title}
                  </p>
                </div>
              </>
            )}
          </div>

          <audio
            ref={audioRef}
            src={ep.audioUrl}
            preload="metadata"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || ep.minutes * 60)}
            onEnded={() => setPlaying(false)}
          />

          {/* SubCast 风格极简播放条 */}
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-2.5">
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
              aria-label={playing ? "暂停" : "播放"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <span className="shrink-0 font-mono text-xs text-ink-soft">{secToTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || ep.minutes * 60}
              value={currentTime}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCurrentTime(v);
                if (audioRef.current) audioRef.current.currentTime = v;
              }}
              aria-label="进度条"
              className="min-w-0 flex-1 accent-[#f97316]"
            />
            <span className="shrink-0 font-mono text-xs text-ink-soft">{secToTime(duration || ep.minutes * 60)}</span>
            <button onClick={cycleRate} className="shrink-0 cursor-pointer rounded-md border border-line px-2 py-0.5 font-mono text-xs font-bold hover:border-ink">
              {rate}x
            </button>
          </div>

          {/* 本集简介（可折叠） */}
          <details open className="rounded-2xl border border-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-ink">本集简介</summary>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{ep.hook}</p>
          </details>
        </aside>

        {/* 右栏：完全对齐 SubCast 的三大标签（字幕 / 导读 / 问答） */}
        <section className="panel min-h-[540px] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex gap-1">
              {(
                [
                  ["subtitle", "字幕"],
                  ["guide", "导读"],
                  ["qa", "问答"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-bold transition ${
                    rightTab === id ? "border-b-2 border-ink bg-cream text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {rightTab !== "qa" && (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜关键词…"
                className="w-36 rounded-lg border border-line bg-cream/60 px-2.5 py-1 text-xs outline-none focus:border-ink"
              />
            )}
          </div>

          {/* Tab 1: 字幕（有逐字稿显示逐句字幕，暂未转写显示官方时间轴，全部支持点击跳播 + 橙色高亮当前行） */}
          {rightTab === "subtitle" && (
            <div className="mt-3 max-h-[520px] space-y-1.5 overflow-y-auto pr-1">
              {transcript ? (
                transcript
                  .filter((s) => !q || s.text.toLowerCase().includes(q))
                  .map((s, i) => {
                    const isNow = currentTime >= s.start && (s.end ? currentTime < s.end : false);
                    return (
                      <button
                        key={i}
                        onClick={() => seekTo(s.start)}
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          isNow ? "border-accent/40 bg-accent-soft/60" : "border-transparent hover:bg-cream"
                        }`}
                      >
                        <span className={`mt-0.5 shrink-0 font-mono text-xs ${isNow ? "font-bold text-accent-dark" : "text-ink-soft"}`}>
                          {secToTime(s.start)}
                        </span>
                        <span className="flex-1 leading-relaxed text-ink">
                          {s.speaker && <b className="mr-1.5 text-xs text-ink-soft">{s.speaker}：</b>}
                          {s.text}
                        </span>
                      </button>
                    );
                  })
              ) : (
                <>
                  <p className="mb-2 rounded-xl bg-cream px-3 py-2 text-xs text-ink-soft">
                    当前为官方章节时间轴（点任意一行直接跳播）。写入 <code className="font-mono">OPENAI_API_KEY</code> 后运行转写脚本即可升级为逐句完整字幕。
                  </p>
                  {allChapters
                    .filter((ch) => !q || ch.title.toLowerCase().includes(q))
                    .map((ch) => {
                      const isNow = activeChapter?.time === ch.time;
                      return (
                        <button
                          key={ch.time}
                          onClick={() => seekTo(timeToSec(ch.time))}
                          className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                            isNow ? "border-accent/40 bg-accent-soft/60" : "border-transparent hover:bg-cream"
                          }`}
                        >
                          <span className={`mt-0.5 shrink-0 font-mono text-xs ${isNow ? "font-bold text-accent-dark" : "text-ink-soft"}`}>
                            {ch.time}
                          </span>
                          <span className="flex-1 leading-relaxed text-ink">{ch.title}</span>
                        </button>
                      );
                    })}
                </>
              )}
            </div>
          )}

          {/* Tab 2: 导读（分节结构 + 站内关联谣言与身体解剖图直达） */}
          {rightTab === "guide" && (
            <div className="mt-4 max-h-[520px] space-y-5 overflow-y-auto pr-1">
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
                                onClick={() => seekTo(timeToSec(ch.time))}
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

          {/* Tab 3: 问答（带可点击时间码的 AI 精读问答） */}
          {rightTab === "qa" && (
            <div className="mt-4 flex h-[480px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {epQA.length === 0 ? (
                  <div className="space-y-3 py-4">
                    <p className="text-xs font-bold text-ink-soft">点一个问题直接问 AI，回答里的时间码可以点着跳播：</p>
                    <div className="flex flex-col gap-2">
                      {(STARTER_QS[ep.id] ?? []).map((sq) => (
                        <button
                          key={sq}
                          onClick={() => askQA(sq)}
                          className="cursor-pointer rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-left text-sm font-medium text-ink transition hover:border-accent hover:bg-accent-soft/40"
                        >
                          {sq} →
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  epQA.map((item, idx) => (
                    <div key={idx} className="space-y-2 rounded-2xl border border-line bg-cream/40 p-3.5 text-sm">
                      <p className="font-bold text-ink">问：{item.q}</p>
                      <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">{renderWithTimestamps(item.a)}</p>
                    </div>
                  ))
                )}
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
                  placeholder="问这期播客里的任何观点…"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-cream/50 px-3 py-2 text-sm outline-none focus:border-ink"
                />
                <button type="submit" disabled={qaLoading || qaInput.trim().length < 2} className="btn !py-2 text-xs">
                  {qaLoading ? "思考中…" : "提问"}
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

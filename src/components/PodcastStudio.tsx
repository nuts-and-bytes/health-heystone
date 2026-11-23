"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EPISODES, secToTime, timeToSec, type Chapter, type Episode } from "@/data/podcasts";
import { getCase } from "@/data/cases";
import { getBodyRole } from "@/data/body-pedia";

interface TranscriptSegment {
  start: number;
  end?: number;
  speaker?: string;
  text: string;
}

interface NoteItem {
  id: string;
  time: number;
  text: string;
}

const NOTES_KEY = "health-podcast-notes-v1";

function loadNotes(): Record<string, NoteItem[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function PodcastStudio() {
  const [epId, setEpId] = useState<string>(EPISODES[0].id);
  const [rightTab, setRightTab] = useState<"chapters" | "transcript" | "notes">("chapters");
  const [query, setQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [notesByEp, setNotesByEp] = useState<Record<string, NoteItem[]>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const ep: Episode = EPISODES.find((e) => e.id === epId) ?? EPISODES[0];
  const allChapters: Chapter[] = useMemo(() => ep.sections.flatMap((s) => s.chapters), [ep]);

  // 加载本地笔记
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotesByEp(loadNotes());
  }, []);

  // 尝试加载该集已转写的逐字稿 JSON（如果存在 public/transcripts/<id>.json）
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

  // 切换单集重置播放状态
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

  const skip = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, a.currentTime + delta);
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const next = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    const item: NoteItem = { id: String(Date.now()), time: Math.floor(currentTime), text };
    const next = { ...notesByEp, [ep.id]: [item, ...(notesByEp[ep.id] ?? [])] };
    setNotesByEp(next);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch {}
    setNoteDraft("");
    setRightTab("notes");
  };

  const removeNote = (id: string) => {
    const next = { ...notesByEp, [ep.id]: (notesByEp[ep.id] ?? []).filter((n) => n.id !== id) };
    setNotesByEp(next);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch {}
  };

  // 当前播放到的章节索引
  const activeChapterTime = useMemo(() => {
    let best = "";
    for (const ch of allChapters) {
      if (timeToSec(ch.time) <= currentTime + 1) best = ch.time;
    }
    return best;
  }, [allChapters, currentTime]);

  const epNotes = notesByEp[ep.id] ?? [];
  const q = query.trim().toLowerCase();

  return (
    <div className="space-y-6">
      {/* 单集切换条 */}
      <div className="grid gap-3 md:grid-cols-3">
        {EPISODES.map((item) => {
          const active = item.id === ep.id;
          return (
            <button
              key={item.id}
              onClick={() => setEpId(item.id)}
              className={`cursor-pointer rounded-2xl border-[1.5px] p-4 text-left transition ${
                active ? "border-ink bg-accent-soft/70" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-accent-dark">{item.show}</span>
                <span className="text-ink-soft">{item.minutes} 分钟</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink">{item.title}</p>
            </button>
          );
        })}
      </div>

      {/* SubCast 风格双栏精读工作台：左侧播放 + 记笔记，右侧时间轴 / 逐字稿 / 笔记 */}
      <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
        {/* 左栏：吸顶播放器 + 单集信息 */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="panel-comic space-y-4 p-5">
            <div>
              <p className="text-xs font-bold text-accent-dark">
                {ep.show} · {ep.vol} · {ep.pubDate}
              </p>
              <h2 className="font-display mt-1 text-2xl leading-snug text-ink">{ep.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                嘉宾：{ep.guest}
                <br />
                主持：{ep.host}
              </p>
            </div>

            <audio
              ref={audioRef}
              src={ep.audioUrl}
              preload="metadata"
              onTimeUpdate={(e) => setCurrentTime(e.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || ep.minutes * 60)}
              onEnded={() => setPlaying(false)}
            />

            {/* 进度条 */}
            <div className="space-y-1">
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
                aria-label="音频进度"
                className="w-full accent-[#f97316]"
              />
              <div className="flex justify-between font-mono text-[11px] text-ink-soft">
                <span>{secToTime(currentTime)}</span>
                <span>{secToTime(duration || ep.minutes * 60)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => skip(-15)} className="cursor-pointer rounded-xl border border-line bg-cream px-2.5 py-1.5 text-xs font-bold hover:border-ink">
                -15s
              </button>
              <button onClick={togglePlay} className="btn flex-1 !py-2 text-sm">
                {playing ? "暂停播放" : "站内收听原声"}
              </button>
              <button onClick={() => skip(30)} className="cursor-pointer rounded-xl border border-line bg-cream px-2.5 py-1.5 text-xs font-bold hover:border-ink">
                +30s
              </button>
              <button onClick={cycleRate} className="cursor-pointer rounded-xl border border-line bg-white px-2 py-1.5 font-mono text-xs font-bold hover:border-ink" title="切换倍速">
                {rate}x
              </button>
            </div>

            {/* 记一条带当前时间点的精读笔记 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNote();
              }}
              className="border-t border-line pt-3"
            >
              <label className="block text-[11px] font-bold text-ink-soft">
                在 {secToTime(currentTime)} 记一条听后笔记（点时间可回跳）
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="写下有启发的观点…"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-cream/60 px-3 py-1.5 text-xs outline-none focus:border-ink"
                />
                <button type="submit" className="cursor-pointer rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white">
                  记下
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between border-t border-line pt-3 text-xs">
              <a href={ep.url} target="_blank" rel="noreferrer" className="font-bold text-accent-dark hover:underline">
                去小宇宙原页打开 ↗
              </a>
              <span className="text-ink-soft">直连小宇宙音频流</span>
            </div>
          </div>
        </aside>

        {/* 右栏：点句跳播时间轴 / 逐字稿 / 个人笔记 */}
        <section className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex gap-1.5">
              {(
                [
                  ["chapters", `时间轴精读（${allChapters.length}）`],
                  ["transcript", transcript ? `逐字稿（${transcript.length} 句）` : "逐字稿"],
                  ["notes", `我的笔记（${epNotes.length}）`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setRightTab(id)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    rightTab === id ? "bg-ink text-white" : "text-ink-soft hover:bg-cream hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜话题关键词…"
              className="w-40 rounded-lg border border-line bg-cream/60 px-2.5 py-1 text-xs outline-none focus:border-ink"
            />
          </div>

          {rightTab === "chapters" && (
            <div className="mt-4 space-y-6">
              {ep.sections.map((sec) => {
                const filtered = sec.chapters.filter((ch) => !q || ch.title.toLowerCase().includes(q));
                if (!filtered.length) return null;
                return (
                  <div key={sec.title}>
                    <h3 className="text-xs font-bold text-accent-dark">{sec.title}</h3>
                    <ol className="mt-2 divide-y divide-line">
                      {filtered.map((ch) => {
                        const isNow = activeChapterTime === ch.time && playing;
                        const c = ch.caseSlug ? getCase(ch.caseSlug) : undefined;
                        const r = ch.bodyRole ? getBodyRole(ch.bodyRole) : undefined;
                        return (
                          <li
                            key={ch.time}
                            className={`flex flex-wrap items-start gap-3 py-3 transition ${isNow ? "rounded-xl bg-accent-soft/50 px-2" : ""}`}
                          >
                            <button
                              onClick={() => seekTo(timeToSec(ch.time))}
                              className={`mt-0.5 shrink-0 cursor-pointer rounded-md border px-2 py-0.5 font-mono text-xs font-bold transition ${
                                isNow
                                  ? "border-accent bg-accent text-white"
                                  : "border-line bg-cream text-ink hover:border-accent hover:text-accent-dark"
                              }`}
                              title="点一下直接跳到这一秒播放"
                            >
                              ▶ {ch.time}
                            </button>
                            <div className="min-w-0 flex-1">
                              <button
                                onClick={() => seekTo(timeToSec(ch.time))}
                                className="cursor-pointer text-left text-sm font-medium text-ink hover:text-accent-dark"
                              >
                                {ch.title}
                              </button>
                              {(c || r) && (
                                <div className="mt-1.5 flex flex-wrap gap-2">
                                  {c && (
                                    <Link
                                      href={`/cases/${c.slug}`}
                                      className="rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-bold text-accent-dark hover:border-accent"
                                    >
                                      相关谣言：「{c.claim}」→
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
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}

          {rightTab === "transcript" && (
            <div className="mt-4">
              {transcript ? (
                <div className="max-h-[540px] space-y-2 overflow-y-auto pr-1">
                  {transcript
                    .filter((seg) => !q || seg.text.toLowerCase().includes(q))
                    .map((seg, i) => {
                      const isNow = currentTime >= seg.start && (seg.end ? currentTime < seg.end : true);
                      return (
                        <button
                          key={i}
                          onClick={() => seekTo(seg.start)}
                          className={`flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                            isNow ? "bg-accent-soft font-medium text-ink" : "hover:bg-cream"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0 font-mono text-xs text-accent-dark">{secToTime(seg.start)}</span>
                          <span className="flex-1 leading-relaxed text-ink">
                            {seg.speaker && <b className="mr-1.5 text-xs text-ink-soft">{seg.speaker}:</b>}
                            {seg.text}
                          </span>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line bg-cream/60 p-5 text-sm text-ink-soft">
                  <p className="font-bold text-ink">本集音频已就绪，逐字稿尚未转写</p>
                  <p className="mt-1.5 leading-relaxed">
                    我们绝不凭空编造嘉宾原话。因为当前环境未配置 <code className="rounded bg-white px-1 text-xs">OPENAI_API_KEY</code>，你可以先在左侧直接听原声 + 点时间轴跳播；配置 Key 后运行下面一行命令即可自动下载并转写出带时间码的逐字稿，页面会自动解锁「点一句跳一句」：
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-white p-3 font-mono text-xs text-ink">
                    {`OPENAI_API_KEY=你的key node scripts/transcribe-episode.mjs ${ep.id}`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {rightTab === "notes" && (
            <div className="mt-4 space-y-2">
              {epNotes.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-soft">还没有笔记——听的时候在左侧记一条，会自动带上当前时间码。</p>
              ) : (
                epNotes.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-xl border border-line bg-cream/50 p-3 text-sm">
                    <button
                      onClick={() => seekTo(n.time)}
                      className="shrink-0 cursor-pointer rounded-md border border-accent bg-white px-2 py-0.5 font-mono text-xs font-bold text-accent-dark"
                    >
                      ▶ {secToTime(n.time)}
                    </button>
                    <p className="flex-1 text-ink">{n.text}</p>
                    <button onClick={() => removeNote(n.id)} className="cursor-pointer text-xs text-ink-soft hover:text-red-dark">
                      删
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

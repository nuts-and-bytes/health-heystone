"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { EPISODES, secToTime, timeToSec, type Episode } from "@/data/podcasts";

/* eslint-disable @next/next/no-img-element */

export interface TranscriptSegment {
  start: number;
  end?: number;
  speaker?: string;
  text: string;
}

interface AudioCtxValue {
  episode: Episode;
  episodeId: string;
  selectEpisode: (id: string) => void;
  playing: boolean;
  currentTime: number;
  duration: number;
  rate: number;
  transcript: TranscriptSegment[] | null;
  activeSegIndex: number;
  togglePlay: () => void;
  seekTo: (sec: number, autoPlay?: boolean) => void;
  skip: (delta: number) => void;
  cycleRate: () => void;
  stopAndHide: () => void;
  hasStarted: boolean;
}

const AudioCtx = createContext<AudioCtxValue | null>(null);
const LAST_EPISODE_KEY = "health-podcast-last-episode-v1";
const PROGRESS_KEY = "health-podcast-progress-v1:";

function readPlaybackValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePlaybackValue(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function parsePosition(value: string | null): number {
  const seconds = value && /^\d+$/.test(value) ? Number(value) : 0;
  return Number.isSafeInteger(seconds) ? seconds : 0;
}

function PodcastPlaybackLocation({ onOpen }: { onOpen: (episode: string | null, time: string | null) => void }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const episode = params.get("episode");
  const time = params.get("t");

  useEffect(() => {
    if (pathname === "/podcasts") onOpen(episode, time);
  }, [pathname, episode, time, onOpen]);

  return null;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [episodeId, setEpisodeId] = useState<string>(EPISODES[0].id);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playback = useRef({ id: EPISODES[0].id, pendingTime: null as number | null, tracking: false });
  const progress = useRef(new Map<string, number>());
  const openedPodcasts = useRef(false);

  const episode = useMemo(() => EPISODES.find((e) => e.id === episodeId) ?? EPISODES[0], [episodeId]);

  // 加载当前单集逐字稿 JSON（如有）
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTranscript(null);
    fetch(`/transcripts/${episode.id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && Array.isArray(d?.segments)) setTranscript(d.segments);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [episode.id]);

  const rememberPosition = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return;
    const id = playback.current.id;
    const saved = Math.floor(seconds);
    if (progress.current.get(id) === saved) return;
    progress.current.set(id, saved);
    writePlaybackValue(PROGRESS_KEY + id, String(saved));
  }, []);

  const startTracking = useCallback(() => {
    if (playback.current.tracking) return;
    playback.current.tracking = true;
    writePlaybackValue(LAST_EPISODE_KEY, playback.current.id);
  }, []);

  const activateEpisode = useCallback(
    (id: string, position?: number) => {
      const item = EPISODES.find((entry) => entry.id === id);
      if (!item) return;
      const previous = playback.current;
      const switching = previous.id !== id;
      if (!switching && position === undefined) return;

      const a = audioRef.current;
      const mounted = a?.dataset.episodeId === previous.id;
      if (mounted && previous.tracking) rememberPosition(previous.pendingTime ?? a.currentTime);
      a?.pause();

      const saved = progress.current.get(id) ?? parsePosition(readPlaybackValue(PROGRESS_KEY + id));
      const requested = position ?? saved;
      const ready = mounted && !switching && Number.isFinite(a.duration);
      const visibleTime = Math.min(requested, ready ? a.duration : item.minutes * 60);
      playback.current = { id, pendingTime: ready ? null : requested, tracking: false };
      if (ready) a.currentTime = visibleTime;
      if (switching) {
        setEpisodeId(id);
        setDuration(0);
      }
      setCurrentTime(visibleTime);
      setPlaying(false);
    },
    [rememberPosition],
  );

  const selectEpisode = useCallback((id: string) => {
    if (id === playback.current.id || !EPISODES.some((entry) => entry.id === id)) return;
    const url = new URL(window.location.href);
    if (url.pathname === "/podcasts" && (url.searchParams.has("episode") || url.searchParams.has("t"))) {
      url.searchParams.delete("episode");
      url.searchParams.delete("t");
      window.history.replaceState(null, "", url);
    }
    writePlaybackValue(LAST_EPISODE_KEY, id);
    activateEpisode(id);
  }, [activateEpisode]);

  const openPlaybackLocation = useCallback((id: string | null, time: string | null) => {
    if (id && EPISODES.some((item) => item.id === id)) {
      openedPodcasts.current = true;
      activateEpisode(id, parsePosition(time));
      return;
    }
    if (openedPodcasts.current) return;
    openedPodcasts.current = true;
    const last = readPlaybackValue(LAST_EPISODE_KEY);
    const item = EPISODES.find((entry) => entry.id === last) ?? EPISODES[0];
    const position = parsePosition(readPlaybackValue(PROGRESS_KEY + item.id));
    activateEpisode(item.id, position);
  }, [activateEpisode]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.playbackRate = rate;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [rate]);

  const seekTo = useCallback(
    (sec: number, autoPlay = true) => {
      const a = audioRef.current;
      if (!a || !Number.isFinite(sec)) return;
      const ready = Number.isFinite(a.duration);
      const next = Math.max(0, Math.min(sec, ready ? a.duration : episode.minutes * 60));
      if (ready) {
        a.currentTime = next;
      } else {
        playback.current.pendingTime = next;
      }
      setCurrentTime(next);
      startTracking();
      rememberPosition(next);
      if (autoPlay) {
        a.playbackRate = rate;
        a.play().catch(() => {});
      }
    },
    [episode.minutes, rate, rememberPosition, startTracking],
  );

  const skip = useCallback((delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    seekTo((playback.current.pendingTime ?? a.currentTime) + delta, false);
  }, [seekTo]);

  const cycleRate = useCallback(() => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const next = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, [rate]);

  const stopAndHide = useCallback(() => {
    const a = audioRef.current;
    if (a) a.pause();
    setPlaying(false);
    setHasStarted(false);
  }, []);

  const activeSegIndex = useMemo(() => {
    if (!transcript || !transcript.length) return -1;
    let idx = 0;
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].start <= currentTime + 0.35) idx = i;
      else break;
    }
    return idx;
  }, [transcript, currentTime]);

  return (
    <AudioCtx.Provider
      value={{
        episode,
        episodeId,
        selectEpisode,
        playing,
        currentTime,
        duration: duration || episode.minutes * 60,
        rate,
        transcript,
        activeSegIndex,
        togglePlay,
        seekTo,
        skip,
        cycleRate,
        stopAndHide,
        hasStarted,
      }}
    >
      <Suspense fallback={null}>
        <PodcastPlaybackLocation onOpen={openPlaybackLocation} />
      </Suspense>
      <audio
        key={episode.id}
        ref={audioRef}
        data-episode-id={episode.id}
        src={episode.audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          if (a !== audioRef.current || playback.current.id !== episode.id) return;
          const length = Number.isFinite(a.duration) ? a.duration : episode.minutes * 60;
          setDuration(length);
          const pending = playback.current.pendingTime;
          if (pending === null) return;
          playback.current.pendingTime = null;
          const next = Math.min(pending, length);
          a.currentTime = next;
          setCurrentTime(next);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (a !== audioRef.current || playback.current.id !== episode.id || playback.current.pendingTime !== null) return;
          setCurrentTime(a.currentTime);
          if (playback.current.tracking) rememberPosition(a.currentTime);
        }}
        onPlay={(e) => {
          if (e.currentTarget !== audioRef.current || playback.current.id !== episode.id) return;
          startTracking();
          setPlaying(true);
          setHasStarted(true);
        }}
        onPause={(e) => {
          const a = e.currentTarget;
          if (a !== audioRef.current || playback.current.id !== episode.id) return;
          if (playback.current.tracking && playback.current.pendingTime === null) rememberPosition(a.currentTime);
          setPlaying(false);
        }}
        onEnded={(e) => {
          if (e.currentTarget !== audioRef.current || playback.current.id !== episode.id) return;
          if (playback.current.tracking) rememberPosition(0);
          playback.current.tracking = false;
          setPlaying(false);
        }}
      />
      {children}
      <FloatingMiniPlayer />
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}

/** 切到网站其他页面时，底部浮现迷你播放条，音频不断流 */
function FloatingMiniPlayer() {
  const path = usePathname();
  const a = useAudio();
  if (!a.hasStarted || path.startsWith("/podcasts")) return null;

  const allChapters = a.episode.sections.flatMap((s) => s.chapters);
  let fallbackLine = a.episode.title;
  for (const ch of allChapters) {
    if (timeToSec(ch.time) <= a.currentTime + 1) fallbackLine = ch.title;
  }
  const liveText = a.transcript && a.activeSegIndex >= 0 ? a.transcript[a.activeSegIndex].text : fallbackLine;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-2xl px-3 md:bottom-4">
      <div className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white/95 px-3.5 py-2.5 shadow-[0_8px_24px_rgba(28,25,23,0.16)] backdrop-blur">
        <img src={a.episode.cover} alt={a.episode.show} className="h-10 w-10 shrink-0 rounded-lg border border-line object-cover" />
        <Link href="/podcasts" className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-ink">{a.episode.show} · {secToTime(a.currentTime)}</p>
          <p className="truncate text-xs text-accent-dark">{liveText}</p>
        </Link>
        <button
          onClick={a.togglePlay}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
          aria-label={a.playing ? "暂停" : "播放"}
        >
          {a.playing ? "❚❚" : "▶"}
        </button>
        <button
          onClick={a.stopAndHide}
          className="cursor-pointer rounded-lg px-1.5 py-1 text-xs text-ink-soft hover:bg-cream hover:text-ink"
          aria-label="关闭迷你播放器"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

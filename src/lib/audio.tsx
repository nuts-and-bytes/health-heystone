"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [episodeId, setEpisodeId] = useState<string>(EPISODES[0].id);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const selectEpisode = useCallback(
    (id: string) => {
      if (id === episodeId) return;
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.currentTime = 0;
      }
      setEpisodeId(id);
      setCurrentTime(0);
      setDuration(0);
      setPlaying(false);
    },
    [episodeId],
  );

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.playbackRate = rate;
      a.play().catch(() => {});
      setPlaying(true);
      setHasStarted(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  }, [rate]);

  const seekTo = useCallback(
    (sec: number, autoPlay = true) => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = Math.max(0, sec);
      setCurrentTime(Math.max(0, sec));
      if (autoPlay) {
        a.playbackRate = rate;
        a.play().catch(() => {});
        setPlaying(true);
        setHasStarted(true);
      }
    },
    [rate],
  );

  const skip = useCallback((delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    const next = Math.max(0, a.currentTime + delta);
    a.currentTime = next;
    setCurrentTime(next);
  }, []);

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

  // 接入浏览器 Media Session API：支持手机锁屏封面/标题、蓝牙耳机线控、后退 15s / 快进 30s
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const coverAbs =
      typeof window !== "undefined" ? new URL(episode.cover, window.location.origin).href : episode.cover;
    try {
      ms.metadata = new MediaMetadata({
        title: episode.title,
        artist: episode.guest,
        album: `${episode.show} · 懂点健康`,
        artwork: [{ src: coverAbs, sizes: "512x512", type: "image/jpeg" }],
      });
      ms.setActionHandler("play", () => {
        const a = audioRef.current;
        if (!a) return;
        a.playbackRate = rate;
        a.play().catch(() => {});
      });
      ms.setActionHandler("pause", () => audioRef.current?.pause());
      ms.setActionHandler("seekbackward", (d) => skip(-(d.seekOffset ?? 15)));
      ms.setActionHandler("seekforward", (d) => skip(d.seekOffset ?? 30));
      ms.setActionHandler("seekto", (d) => {
        if (typeof d.seekTime === "number") seekTo(d.seekTime, false);
      });
    } catch {}
  }, [episode, rate, skip, seekTo]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    } catch {}
  }, [playing]);

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
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
        playsInline
        onPlay={() => {
          setPlaying(true);
          setHasStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || episode.minutes * 60)}
        onEnded={() => setPlaying(false)}
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

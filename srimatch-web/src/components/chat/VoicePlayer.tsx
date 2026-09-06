"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';

interface VoicePlayerProps {
  audioUrl: string;
  isMine: boolean;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exact duration calculation across all browsers (including WebM/Opus stream blobs)
  useEffect(() => {
    let isMounted = true;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.preload = "metadata";

    // 1. Fetch & decode via Web Audio API for 100% accurate duration on WebM audio
    fetch(audioUrl)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          ctx.decodeAudioData(arrayBuffer, (decoded) => {
            if (isMounted && decoded && decoded.duration > 0) {
              setDuration(decoded.duration);
              setIsLoadingAudio(false);
            }
            try { ctx.close(); } catch (e) {}
          }, () => {
            if (isMounted) setIsLoadingAudio(false);
          });
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingAudio(false);
      });

    const onLoadedMetadata = () => {
      if (isMounted && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        setIsLoadingAudio(false);
      }
    };

    const onDurationChange = () => {
      if (isMounted && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      if (isMounted) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0 && !duration) {
          setDuration(audio.duration);
        }
      }
    };

    const onEnded = () => {
      if (isMounted) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      isMounted = false;
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any other active audio instances across the app
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current) el.pause();
      });
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Voice playback error:", err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec) || !isFinite(sec)) return "0:00";
    const totalSecs = Math.round(sec);
    const mins = Math.floor(totalSecs / 60);
    const remainingSecs = totalSecs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Fixed visual wave bar distribution
  const barHeights = [
    25, 45, 70, 90, 60, 35, 75, 100, 85, 50,
    65, 95, 55, 30, 80, 60, 40, 75, 50, 30
  ];

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Decrement countdown while playing, total duration when paused
  const remainingSeconds = Math.max(0, duration - currentTime);

  return (
    <div className="flex items-center gap-3 py-1 min-w-[210px] sm:min-w-[240px]">
      {/* Play / Pause / Loading Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-sm ${
          isMine 
            ? "bg-white text-[#5c2a16] hover:bg-white/95" 
            : "bg-gradient-to-br from-[#74351b] to-[#994d2c] text-white hover:opacity-95"
        }`}
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
      >
        {isLoadingAudio && !duration ? (
          <Loader2 size={15} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={15} className="fill-current" />
        ) : (
          <Play size={15} className="fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Scrubber */}
      <div className="flex-1 flex flex-col gap-1.5 cursor-pointer select-none" onClick={handleSeek}>
        <div className="flex items-center gap-[2.5px] h-6">
          {barHeights.map((height, idx) => {
            const barPercent = (idx / barHeights.length) * 100;
            const isPlayed = barPercent <= progressPercent;

            return (
              <div
                key={idx}
                className={`w-[3px] rounded-full transition-all duration-150 ${
                  isMine
                    ? isPlayed ? "bg-white" : "bg-white/35"
                    : isPlayed ? "bg-[#8b4e2e]" : "bg-[#ecdcd5]"
                }`}
                style={{
                  height: `${height}%`,
                }}
              />
            );
          })}
        </div>

        {/* Decrement countdown display when playing, full duration when stopped */}
        <div className="flex items-center justify-between text-[0.68rem] font-mono leading-none">
          <span className={`font-semibold ${isMine ? "text-white/90" : "text-[#74351b]"}`}>
            {isPlaying ? `-${formatSeconds(remainingSeconds)}` : (duration > 0 ? formatSeconds(duration) : "0:00")}
          </span>
          <span className={`flex items-center gap-1 ${isMine ? "text-white/60" : "text-[#b09080]"}`}>
            <Volume2 size={11} />
            {duration > 0 ? formatSeconds(duration) : "0:00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoicePlayer;

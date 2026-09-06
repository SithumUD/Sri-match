"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoicePlayerProps {
  audioUrl: string;
  isMine: boolean;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
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
      // Pause any other playing audio on the page
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current) el.pause();
      });
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback error:", err);
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
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Fixed static waveform bar heights for clean visual representation
  const barHeights = [
    30, 60, 45, 90, 75, 40, 65, 100, 80, 50,
    70, 95, 60, 40, 85, 65, 45, 75, 55, 35
  ];

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-1 min-w-[200px] sm:min-w-[230px]">
      {/* Play / Pause Circular Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-sm ${
          isMine 
            ? "bg-white text-[#5c2a16] hover:bg-white/90" 
            : "bg-gradient-to-br from-[#74351b] to-[#994d2c] text-white hover:opacity-95"
        }`}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        {isPlaying ? <Pause size={15} className="fill-current" /> : <Play size={15} className="fill-current ml-0.5" />}
      </button>

      {/* Waveform & Scrubber */}
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

        {/* Time Progress Display */}
        <div className="flex items-center justify-between text-[0.66rem] font-medium leading-none">
          <span className={isMine ? "text-white/80" : "text-[#9a7060]"}>
            {isPlaying ? formatSeconds(currentTime) : (duration > 0 ? formatSeconds(duration) : "Voice")}
          </span>
          <span className={`flex items-center gap-1 ${isMine ? "text-white/60" : "text-[#b09080]"}`}>
            <Volume2 size={10} />
            {duration > 0 ? formatSeconds(duration) : "0:00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoicePlayer;

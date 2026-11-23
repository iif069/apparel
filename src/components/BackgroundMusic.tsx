'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  soundEnabled: boolean;
}

export function BackgroundMusic({ soundEnabled }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inisialisasi audio musik latar bebas lisensi (Purrple Cat - Coffee Jelly, CC BY 4.0)
    // Musik hanya berputar saat pengunjung mengklik tombol BGM secara langsung
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.22; // Volume lembut & elegan standar ambient lounge
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Jeda musik jika suara dinonaktifkan
  useEffect(() => {
    if (!audioRef.current) return;
    if (!soundEnabled && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [soundEnabled, isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      title={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
      aria-pressed={isPlaying}
      className={`press shrink-0 whitespace-nowrap select-none flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] h-11 px-3 sm:px-4 rounded-full bg-white/50 text-ink border transition-colors cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] hover:bg-white/80 ${
        isPlaying
          ? 'border-brand/40 shadow-soft'
          : 'border-white/75 hover:border-brand/40'
      }`}
      aria-label={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
    >
      {/* Visualizer Bar Equalizer berdenyut saat musik aktif */}
      {isPlaying ? (
        <div className="flex items-end gap-0.5 h-3.5 w-3.5 shrink-0">
          <span className="w-0.5 h-3 bg-brand rounded-full animate-music-bar-1" />
          <span className="w-0.5 h-2 bg-brand rounded-full animate-music-bar-2" />
          <span className="w-0.5 h-3 bg-brand rounded-full animate-music-bar-3" />
        </div>
      ) : (
        <Music className="w-4 h-4 text-muted shrink-0" />
      )}

      <span className="text-xs sm:text-[13px] font-bold text-ink">
        Musik
      </span>

      {/* Ikon Speaker Mute/Unmute */}
      <span className="text-muted transition-colors shrink-0">
        {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-brand" /> : <VolumeX className="w-3.5 h-3.5 text-muted" />}
      </span>
    </button>
  );
}

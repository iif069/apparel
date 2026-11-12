'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  soundEnabled: boolean;
}

export function BackgroundMusic({ soundEnabled }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    // Inisialisasi audio musik latar bebas lisensi (Purrple Cat - Coffee Jelly, CC BY 4.0)
    const audio = new Audio('/bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.22; // Volume lembut & elegan standar ambient lounge
    audioRef.current = audio;

    // Kebijakan browser (Autoplay Policy):
    // Musik akan mulai berputar lembut segera setelah pengguna menyentuh/klik halaman web
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (soundEnabledRef.current && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Abaikan jika browser membatasi
        });
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      audio.pause();
      audio.src = '';
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Sinkronkan pemutaran saat soundEnabled berubah
  useEffect(() => {
    if (!audioRef.current || !hasInteracted) return;
    if (soundEnabled) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [soundEnabled, hasInteracted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm transition-all duration-300 press-active ${
          isPlaying
            ? 'bg-white/90 border-[#7B29BA]/30 text-ink shadow-[0_4px_16px_rgba(123,41,186,0.15)] hover:bg-white'
            : 'bg-white/70 border-slate-200/80 text-ink/60 hover:text-ink hover:bg-white'
        }`}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
      >
        {/* Visualizer Bar Equalizer berdenyut saat musik aktif */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-1 bg-[#7B29BA] rounded-full animate-music-bar-1" />
            <span className="w-1 bg-[#7B29BA] rounded-full animate-music-bar-2" />
            <span className="w-1 bg-[#7B29BA] rounded-full animate-music-bar-3" />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-ink/50 group-hover:text-ink transition-colors" />
        )}

        <span className="text-[11.5px] font-semibold tracking-tight">
          {isPlaying ? 'Music' : 'BGM'}
        </span>

        {/* Ikon Speaker Mute/Unmute */}
        <span className="text-ink/40 group-hover:text-ink/80 transition-colors ml-0.5">
          {isPlaying ? <Volume2 className="w-3 h-3 text-[#7B29BA]" /> : <VolumeX className="w-3 h-3" />}
        </span>
      </button>
    </div>
  );
}

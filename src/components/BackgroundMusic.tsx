'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundMusicProps {
  soundEnabled: boolean;
  isDetailOpen?: boolean;
}

export function BackgroundMusic({ soundEnabled, isDetailOpen = false }: BackgroundMusicProps) {
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

  if (isDetailOpen) {
    // Sembunyikan widget musik saat membuka modal detail agar tampilan bersih
    return null;
  }

  return (
    <div className="fixed bottom-[84px] left-4 md:bottom-[84px] md:left-8 z-30 select-none">
      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
        className={`press flex items-center gap-2 h-9 px-3 rounded-full bg-surface/95 backdrop-blur-md border border-line hover:border-brand/40 shadow-xs text-ink transition-all cursor-pointer ${
          isPlaying ? 'border-brand/40 shadow-soft' : ''
        }`}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
      >
        {/* Visualizer Bar Equalizer berdenyut saat musik aktif */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-0.5 h-3 bg-brand rounded-full animate-music-bar-1" />
            <span className="w-0.5 h-2 bg-brand rounded-full animate-music-bar-2" />
            <span className="w-0.5 h-3 bg-brand rounded-full animate-music-bar-3" />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-muted group-hover:text-brand transition-colors" />
        )}

        <span className="text-[12px] font-bold text-ink">
          {isPlaying ? 'Music' : 'BGM'}
        </span>

        {/* Ikon Speaker Mute/Unmute */}
        <span className="text-muted transition-colors ml-0.5">
          {isPlaying ? <Volume2 className="w-3 h-3 text-brand" /> : <VolumeX className="w-3 h-3 text-muted" />}
        </span>
      </button>
    </div>
  );
}

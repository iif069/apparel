'use client';

import { useCallback, useRef } from 'react';

export function useSound(enabled: boolean = true) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback(
    (type: 'slide' | 'open' | 'click' | 'flip' | 'sway' = 'click') => {
      if (!enabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'click') {
        // Efek Suara Ketukan / Klik Produk (Crisp & Punchy Tactile Pop)
        // Layer 1: High crisp click transient
        const oscHigh = ctx.createOscillator();
        const gainHigh = ctx.createGain();
        oscHigh.type = 'sine';
        oscHigh.frequency.setValueAtTime(650, now);
        oscHigh.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
        gainHigh.gain.setValueAtTime(0.24, now);
        gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        oscHigh.connect(gainHigh);
        gainHigh.connect(ctx.destination);
        oscHigh.start(now);
        oscHigh.stop(now + 0.05);

        // Layer 2: Tactile body thud
        const oscBody = ctx.createOscillator();
        const gainBody = ctx.createGain();
        oscBody.type = 'triangle';
        oscBody.frequency.setValueAtTime(180, now);
        oscBody.frequency.exponentialRampToValueAtTime(75, now + 0.06);
        gainBody.gain.setValueAtTime(0.20, now);
        gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        oscBody.connect(gainBody);
        gainBody.connect(ctx.destination);
        oscBody.start(now);
        oscBody.stop(now + 0.06);
      } else if (type === 'open') {
        // Efek Suara Membuka Detail Produk / Keranjang (Uplifting Boutique Chime)
        const freqs = [380, 520, 780];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const delay = idx * 0.04;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.18 / (idx + 1), now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.22);
        });
      } else if (type === 'flip') {
        // Efek Suara Memutar / Membalik Baju 180° (Cloth Swish & Click)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.16);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'sway') {
        // Efek Suara Sentuhan Gantungan Baju di Kawat Butik (Gentle Chime Swish)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(420, now);
        osc1.frequency.exponentialRampToValueAtTime(220, now + 0.14);
        gain1.gain.setValueAtTime(0.16, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.14);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(280, now);
        osc2.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.12);
      } else if (type === 'slide') {
        // Efek Gesekan Gantungan / Ganti Kategori (Smooth Air Slide)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.14);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    },
    [enabled, getAudioContext]
  );

  return { playSound };
}

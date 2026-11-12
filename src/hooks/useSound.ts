'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useSound(enabled: boolean = true) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const whooshBufferRef = useRef<AudioBuffer | null>(null);

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

  // Preload and decode audio buffers for instant zero-latency playback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const loadBuffers = async () => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // Fetch click sound (creatorshome-mouse-click)
        fetch('/sounds/click.mp3')
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            if (isMounted) clickBufferRef.current = decoded;
          })
          .catch(() => {});

        // Fetch whoosh sound (dragon-studio-simple-whoosh)
        fetch('/sounds/whoosh.mp3')
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            if (isMounted) whooshBufferRef.current = decoded;
          })
          .catch(() => {});
      } catch {
        // Fallback to synthesized audio
      }
    };

    loadBuffers();

    return () => {
      isMounted = false;
    };
  }, [getAudioContext]);

  const playBuffer = useCallback(
    (buffer: AudioBuffer, volume: number = 0.5, rate: number = 1.0) => {
      const ctx = getAudioContext();
      if (!ctx) return;
      try {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        source.playbackRate.value = rate;
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
      } catch {
        // Ignore playback errors
      }
    },
    [getAudioContext]
  );

  const playSound = useCallback(
    (type: 'slide' | 'open' | 'click' | 'flip' | 'sway' = 'click') => {
      if (!enabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'click') {
        if (clickBufferRef.current) {
          playBuffer(clickBufferRef.current, 0.75, 1.0);
          return;
        }

        // Fallback Web Audio Synth
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

        const oscBody = ctx.createOscillator();
        const gainBody = ctx.createGain();
        oscBody.type = 'triangle';
        oscBody.frequency.setValueAtTime(180, now);
        oscBody.frequency.exponentialRampToValueAtTime(75, now + 0.06);
        gainBody.gain.setValueAtTime(0.2, now);
        gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        oscBody.connect(gainBody);
        gainBody.connect(ctx.destination);
        oscBody.start(now);
        oscBody.stop(now + 0.06);
      } else if (type === 'open') {
        if (whooshBufferRef.current) {
          playBuffer(whooshBufferRef.current, 0.6, 1.05);
          return;
        }
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
        if (whooshBufferRef.current) {
          playBuffer(whooshBufferRef.current, 0.55, 1.25);
          return;
        }
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
        if (clickBufferRef.current) {
          playBuffer(clickBufferRef.current, 0.45, 1.15);
          return;
        }
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
      } else if (type === 'slide') {
        if (whooshBufferRef.current) {
          playBuffer(whooshBufferRef.current, 0.45, 0.95);
          return;
        }
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
    [enabled, getAudioContext, playBuffer]
  );

  return { playSound };
}

import { useEffect, useRef, useState } from 'react';

function tone(ctx, frequency, duration, type = 'sine', gainValue = 0.05) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useAudioEngine() {
  const [enabled, setEnabled] = useState(true);
  const contextRef = useRef(null);
  const musicTimerRef = useRef(null);

  useEffect(() => () => window.clearInterval(musicTimerRef.current), []);

  function ensureContext() {
    if (!contextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return null;
      }
      contextRef.current = new AudioCtx();
    }
    return contextRef.current;
  }

  function playShot() {
    if (!enabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    tone(ctx, 520, 0.08, 'square', 0.025);
  }

  function playSuccess() {
    if (!enabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    tone(ctx, 660, 0.08, 'triangle', 0.03);
    window.setTimeout(() => tone(ctx, 880, 0.12, 'triangle', 0.03), 60);
  }

  function playError() {
    if (!enabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    tone(ctx, 220, 0.14, 'sawtooth', 0.035);
  }

  function playBoss() {
    if (!enabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    tone(ctx, 120, 0.3, 'square', 0.04);
    window.setTimeout(() => tone(ctx, 160, 0.3, 'square', 0.04), 180);
  }

  function startMusic() {
    if (!enabled || musicTimerRef.current) {
      return;
    }

    const ctx = ensureContext();
    if (!ctx) {
      return;
    }

    const melody = [330, 392, 440, 392];
    let index = 0;

    musicTimerRef.current = window.setInterval(() => {
      tone(ctx, melody[index % melody.length], 0.18, 'triangle', 0.015);
      index += 1;
    }, 520);
  }

  function stopMusic() {
    window.clearInterval(musicTimerRef.current);
    musicTimerRef.current = null;
  }

  return {
    enabled,
    setEnabled,
    playShot,
    playSuccess,
    playError,
    playBoss,
    startMusic,
    stopMusic,
  };
}

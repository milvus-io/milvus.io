import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Drives a step-based animation. `step` increments from 0 to `totalSteps`
 * at `intervalMs` per tick when playing. Auto-pauses on completion.
 */
export function useAnimationSteps(totalSteps: number, intervalMs = 30) {
  const [step, setStep] = useState(totalSteps);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setStep(totalSteps);
    setPlaying(false);
  }, [totalSteps]);

  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps) {
      setPlaying(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, totalSteps));
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [playing, step, totalSteps, intervalMs]);

  const play = useCallback(() => {
    setStep((s) => (s >= totalSteps ? 0 : s));
    setPlaying(true);
  }, [totalSteps]);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

  const finish = useCallback(() => {
    setPlaying(false);
    setStep(totalSteps);
  }, [totalSteps]);

  return { step, playing, play, pause, reset, finish, setStep };
}

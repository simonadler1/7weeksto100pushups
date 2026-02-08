import { useState, useEffect } from 'react';

interface RestTimerProps {
  duration: number;
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function RestTimer({ duration, visible, onComplete, onSkip }: RestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration);
    }
  }, [visible, duration]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigator.vibrate?.(200);
          setTimeout(onComplete, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center">
      <div className="bg-card-bg rounded-3xl p-8 flex flex-col items-center gap-6 min-w-[280px] border border-card-border">
        <span className="text-xl font-medium text-text-secondary tracking-widest">
          Rest
        </span>

        <div className="w-40 h-40 rounded-full border-4 border-accent flex items-center justify-center shadow-[0_0_16px_rgba(0,255,255,0.3)]">
          <span className="text-[64px] font-extralight text-accent">
            {timeRemaining}
          </span>
        </div>

        <button
          onClick={onSkip}
          className="py-3 px-8 rounded-lg border border-card-border text-text-muted active:opacity-70 transition-opacity"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

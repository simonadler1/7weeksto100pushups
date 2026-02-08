import { useState, useEffect } from 'react';

interface RepInputModalProps {
  visible: boolean;
  minReps: number;
  onSubmit: (reps: number) => void;
  onCancel: () => void;
}

export default function RepInputModal({ visible, minReps, onSubmit, onCancel }: RepInputModalProps) {
  const [reps, setReps] = useState(minReps);

  useEffect(() => {
    if (visible) {
      setReps(minReps);
    }
  }, [visible, minReps]);

  function increment() {
    setReps((prev) => prev + 1);
  }

  function decrement() {
    setReps((prev) => Math.max(minReps, prev - 1));
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center">
      <div className="bg-card-bg rounded-3xl p-8 flex flex-col items-center gap-5 min-w-[300px] border border-card-border">
        <span className="text-2xl font-light text-text-primary">
          How many reps?
        </span>

        <span className="text-sm text-text-muted">
          Minimum: {minReps}
        </span>

        <div className="flex items-center gap-6 py-4">
          <button
            onClick={decrement}
            className="w-14 h-14 rounded-full border border-accent flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <span className="text-[32px] font-light text-accent leading-none">
              &minus;
            </span>
          </button>

          <span className="text-5xl font-extralight min-w-[80px] text-center text-text-primary">
            {reps}
          </span>

          <button
            onClick={increment}
            className="w-14 h-14 rounded-full border border-accent flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <span className="text-[32px] font-light text-accent leading-none">
              +
            </span>
          </button>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl border border-card-border text-text-muted font-medium active:opacity-70 transition-opacity"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reps)}
            className="flex-1 py-3.5 rounded-xl bg-accent text-background font-semibold active:opacity-70 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

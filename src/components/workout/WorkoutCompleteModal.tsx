import { useEffect, useState } from 'react';

interface WorkoutCompleteModalProps {
  visible: boolean;
  onCompleted: () => void;
  onIncomplete: () => void;
}

export default function WorkoutCompleteModal({
  visible,
  onCompleted,
  onIncomplete,
}: WorkoutCompleteModalProps) {
  const [stage, setStage] = useState<'question' | 'instructions'>('question');

  useEffect(() => {
    if (visible) {
      setStage('question');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-6">
      <div className="bg-card-bg rounded-3xl p-8 flex flex-col items-center gap-5 min-w-[300px] max-w-[400px] border border-card-border">
        {stage === 'question' ? (
          <>
            <span className="text-2xl font-light text-text-primary text-center">
              Did you complete the workout?
            </span>

            <span className="text-sm text-text-muted text-center">
              Were you able to finish every set at the target reps?
            </span>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setStage('instructions')}
                className="flex-1 py-3.5 rounded-xl border border-card-border text-text-muted font-medium active:opacity-70 transition-opacity"
              >
                Not quite
              </button>
              <button
                onClick={onCompleted}
                className="flex-1 py-3.5 rounded-xl bg-accent text-background font-semibold active:opacity-70 transition-opacity"
              >
                Yes!
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-2xl font-light text-text-primary text-center">
              No problem!
            </span>

            <span className="text-sm text-text-secondary text-center leading-relaxed">
              Break the remaining push-ups into however many sets you need
              &mdash; rest as long as necessary between them &mdash; and
              complete them all now.
            </span>

            <span className="text-sm text-text-muted text-center leading-relaxed">
              Your schedule has been moved back one workout so you can build
              back up and complete every workout before moving forward.
            </span>

            <button
              onClick={onIncomplete}
              className="w-full py-3.5 rounded-xl bg-accent text-background font-semibold active:opacity-70 transition-opacity"
            >
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  );
}

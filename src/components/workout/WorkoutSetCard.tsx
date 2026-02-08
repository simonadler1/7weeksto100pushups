export type SetStatus = 'pending' | 'active' | 'completed';

interface WorkoutSetCardProps {
  setNumber: number;
  targetReps: number | string;
  isMinimum: boolean;
  status: SetStatus;
  onComplete?: () => void;
  actualReps?: number;
}

const containerStyles: Record<SetStatus, string> = {
  pending: 'bg-card-bg border-card-border',
  active: 'bg-accent-bg border-accent shadow-[0_0_16px_rgba(0,255,255,0.3)]',
  completed: 'bg-success-bg border-success',
};

const titleStyles: Record<SetStatus, string> = {
  pending: 'text-text-muted',
  active: 'text-text-primary',
  completed: 'text-success',
};

const repsStyles: Record<SetStatus, string> = {
  pending: 'text-text-muted',
  active: 'text-accent',
  completed: 'text-success',
};

export default function WorkoutSetCard({
  setNumber,
  targetReps,
  isMinimum,
  status,
  onComplete,
  actualReps,
}: WorkoutSetCardProps) {
  function displayReps(): string {
    if (status === 'completed' && actualReps !== undefined) {
      return `${actualReps} reps`;
    }
    return `${targetReps} push-ups`;
  }

  return (
    <div className={`rounded-2xl p-5 border ${containerStyles[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-base font-semibold ${titleStyles[status]}`}>
          Set {setNumber}
        </span>
        {status === 'completed' && (
          <span className="text-success text-lg">&#10003;</span>
        )}
      </div>

      <p className={`text-[28px] font-light ${repsStyles[status]}`}>
        {displayReps()}
      </p>

      {isMinimum && status !== 'completed' && (
        <span className="text-xs text-text-muted mt-1 block">
          Minimum - go to failure
        </span>
      )}

      {status === 'active' && onComplete && (
        <button
          onClick={onComplete}
          className="w-full mt-4 bg-accent text-background py-4 rounded-xl font-bold active:opacity-70 transition-opacity"
        >
          Complete Set
        </button>
      )}
    </div>
  );
}

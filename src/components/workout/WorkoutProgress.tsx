interface WorkoutProgressProps {
  currentSet: number;
  totalSets: number;
}

export default function WorkoutProgress({ currentSet, totalSets }: WorkoutProgressProps) {
  const progress = Math.min(currentSet / totalSets, 1);
  const displaySet = Math.min(currentSet, totalSets);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-center text-text-secondary">
        Set {displaySet} of {totalSets}
      </span>
      <div className="h-1 bg-card-border rounded-sm overflow-hidden">
        <div
          className="h-full bg-accent rounded-sm transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

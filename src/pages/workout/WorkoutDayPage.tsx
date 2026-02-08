import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import WorkoutSetCard, { type SetStatus } from '@/components/workout/WorkoutSetCard';
import WorkoutProgress from '@/components/workout/WorkoutProgress';
import RestTimer from '@/components/workout/RestTimer';
import RepInputModal from '@/components/workout/RepInputModal';
import {
  ActiveWorkout,
  CompletedSet,
  CompletedWorkout,
  saveActiveWorkout,
  clearActiveWorkout,
  addCompletedWorkout,
  getActiveWorkout,
} from '@/utils/storage';
import {
  loadWorkoutForDay,
  getRestBetweenSets,
  parseRepString,
  capitalizeDayName,
  generateWorkoutId,
  calculateTotalReps,
  DayOfWeek,
} from '@/utils/workout-helpers';

export default function WorkoutDayPage() {
  const { day } = useParams<{ day: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dayOfWeek = day as DayOfWeek;
  const week = parseInt(searchParams.get('week') || '1', 10);
  const programName = searchParams.get('program') || 'Beginner 1';
  const isResume = searchParams.get('resume') === 'true';

  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showRepInput, setShowRepInput] = useState(false);
  const [pendingSetReps, setPendingSetReps] = useState<number | null>(null);

  useEffect(() => {
    initializeWorkout();
  }, []);

  const initializeWorkout = () => {
    if (isResume) {
      const existingWorkout = getActiveWorkout();
      if (existingWorkout) {
        setWorkout(existingWorkout);
        return;
      }
    }

    const sets = loadWorkoutForDay(programName, week, dayOfWeek);
    const restTime = getRestBetweenSets(programName);

    const newWorkout: ActiveWorkout = {
      programName,
      week,
      day: dayOfWeek,
      restBetweenSets: restTime,
      sets,
      currentSetIndex: 0,
      startedAt: Date.now(),
      completedSets: [],
    };

    setWorkout(newWorkout);
    saveActiveWorkout(newWorkout);
  };

  const handleCompleteSet = () => {
    if (!workout) return;

    const currentSet = workout.sets[workout.currentSetIndex];

    if (currentSet.isMinimum) {
      const parsed = parseRepString(currentSet.targetReps);
      setPendingSetReps(parsed.value);
      setShowRepInput(true);
    } else {
      const reps =
        typeof currentSet.targetReps === 'number'
          ? currentSet.targetReps
          : parseRepString(currentSet.targetReps).value;
      completeSetWithReps(reps);
    }
  };

  const completeSetWithReps = (actualReps: number) => {
    if (!workout) return;

    navigator.vibrate?.(50);

    const currentSet = workout.sets[workout.currentSetIndex];
    const completedSet: CompletedSet = {
      setNumber: workout.currentSetIndex + 1,
      targetReps: currentSet.targetReps,
      actualReps,
      completedAt: Date.now(),
    };

    const updatedWorkout: ActiveWorkout = {
      ...workout,
      completedSets: [...workout.completedSets, completedSet],
      currentSetIndex: workout.currentSetIndex + 1,
    };

    setWorkout(updatedWorkout);
    saveActiveWorkout(updatedWorkout);

    if (updatedWorkout.currentSetIndex >= updatedWorkout.sets.length) {
      setTimeout(() => finishWorkout(updatedWorkout), 500);
    } else {
      setShowRestTimer(true);
    }
  };

  const finishWorkout = (completedWorkout: ActiveWorkout) => {
    navigator.vibrate?.(200);

    const duration = Math.floor((Date.now() - completedWorkout.startedAt) / 1000);
    const totalReps = calculateTotalReps(completedWorkout.completedSets);

    const workoutRecord: CompletedWorkout = {
      id: generateWorkoutId(),
      programName: completedWorkout.programName,
      week: completedWorkout.week,
      day: completedWorkout.day,
      completedAt: Date.now(),
      sets: completedWorkout.completedSets,
      totalReps,
      duration,
    };

    addCompletedWorkout(workoutRecord);
    clearActiveWorkout();

    navigate('/', { replace: true });
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
  };

  const handleSkipRest = () => {
    setShowRestTimer(false);
  };

  const handleRepInputSubmit = (reps: number) => {
    setShowRepInput(false);
    completeSetWithReps(reps);
  };

  const handleRepInputCancel = () => {
    setShowRepInput(false);
  };

  if (!workout) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <span className="text-text-primary text-lg text-center mt-[100px]">
          Loading workout...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="overflow-y-auto p-6 pt-[60px] flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="py-3 px-5 border border-accent rounded-lg active:opacity-70"
          >
            <span className="text-accent text-sm font-medium">&larr; Exit</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-text-muted text-sm font-semibold tracking-widest">
            WEEK {workout.week}
          </span>
          <span className="text-text-primary text-[32px] font-light">
            {capitalizeDayName(workout.day)}
          </span>
        </div>

        {/* Progress */}
        <WorkoutProgress
          currentSet={workout.currentSetIndex + 1}
          totalSets={workout.sets.length}
        />

        {/* Sets */}
        <div className="flex flex-col gap-3">
          {workout.sets.map((set, index) => {
            let status: SetStatus = 'pending';
            if (index < workout.currentSetIndex) {
              status = 'completed';
            } else if (index === workout.currentSetIndex) {
              status = 'active';
            }

            const completedSet = workout.completedSets.find(
              (cs) => cs.setNumber === index + 1
            );

            return (
              <WorkoutSetCard
                key={index}
                setNumber={set.setNumber}
                targetReps={set.targetReps}
                isMinimum={set.isMinimum}
                status={status}
                onComplete={status === 'active' ? handleCompleteSet : undefined}
                actualReps={completedSet?.actualReps}
              />
            );
          })}
        </div>
      </div>

      {/* Rest Timer and Rep Input - fixed overlays outside scroll */}
      <RestTimer
        visible={showRestTimer}
        duration={workout.restBetweenSets}
        onComplete={handleRestComplete}
        onSkip={handleSkipRest}
      />

      <RepInputModal
        visible={showRepInput}
        minReps={pendingSetReps || 0}
        onSubmit={handleRepInputSubmit}
        onCancel={handleRepInputCancel}
      />
    </div>
  );
}

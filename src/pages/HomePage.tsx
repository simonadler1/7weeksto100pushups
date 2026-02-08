import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdSettings } from 'react-icons/md';
import {
  getUserProgress,
  getWeekCompletionStatus,
  getActiveWorkout,
  getWorkoutHistory,
  saveUserProgress,
  clearActiveWorkout,
  UserProgress,
} from '@/utils/storage';
import { capitalizeDayName, DayOfWeek } from '@/utils/workout-helpers';

export default function HomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [weekCompletion, setWeekCompletion] = useState({
    monday: false,
    wednesday: false,
    friday: false,
    allCompleted: false,
  });
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false);
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<DayOfWeek | null>(null);
  const [totalReps, setTotalReps] = useState(0);

  useEffect(() => {
    loadData();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadData();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const loadData = () => {
    const userProgress = getUserProgress();
    setProgress(userProgress);

    if (userProgress) {
      const completion = getWeekCompletionStatus(userProgress.currentWeek);
      setWeekCompletion(completion);

      const active = getActiveWorkout();
      if (active) {
        const isCompleted = completion[active.day];
        setHasActiveWorkout(!isCompleted);
        setActiveWorkoutDay(!isCompleted ? active.day : null);
        if (isCompleted) {
          clearActiveWorkout();
        }
      } else {
        setHasActiveWorkout(false);
        setActiveWorkoutDay(null);
      }

      // Calculate total reps
      const history = getWorkoutHistory();
      const total = history.workouts.reduce((sum, w) => sum + w.totalReps, 0);
      setTotalReps(total);
    }
  };

  const handleStartWorkout = (day: DayOfWeek) => {
    if (!progress) return;
    navigate(
      `/workout/${day}?week=${progress.currentWeek}&program=${encodeURIComponent(progress.currentProgram)}`
    );
  };

  const handleResumeWorkout = () => {
    const active = getActiveWorkout();
    if (active) {
      navigate(
        `/workout/${active.day}?week=${active.week}&program=${encodeURIComponent(active.programName)}&resume=true`
      );
    }
  };

  const handleAdvanceWeek = () => {
    if (progress && progress.currentWeek < 10) {
      const newProgress: UserProgress = {
        ...progress,
        currentWeek: progress.currentWeek + 1,
      };
      saveUserProgress(newProgress);
      setProgress(newProgress);
      loadData();
    }
  };

  const getEarliestUncompletedDay = (): DayOfWeek | null => {
    if (!weekCompletion.monday) return 'monday';
    if (!weekCompletion.wednesday) return 'wednesday';
    if (!weekCompletion.friday) return 'friday';
    return null;
  };

  const days: DayOfWeek[] = ['monday', 'wednesday', 'friday'];
  const progressPercent = progress ? (progress.currentWeek / 10) * 100 : 0;

  if (!progress) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <span className="text-text-primary text-lg text-center mt-[100px]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background relative">
      {/* Settings Button */}
      <button
        onClick={() => navigate('/settings')}
        className="absolute top-[60px] right-6 z-10 w-11 h-11 rounded-full bg-card-bg border border-card-border flex items-center justify-center active:opacity-70"
      >
        <MdSettings size={24} className="text-text-muted" />
      </button>

      <div className="overflow-y-auto p-6 flex flex-col gap-6 pt-[100px]">
        {/* Hero Card with Week Progress */}
        <div className="bg-card-bg rounded-2xl p-7 shadow-[0_0_24px_rgba(0,255,255,0.15)] flex flex-col gap-5">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-text-secondary text-sm font-semibold tracking-widest mr-2">
              WEEK
            </span>
            <span className="text-accent text-[64px] font-light">{progress.currentWeek}</span>
            <span className="text-text-muted text-[28px] font-light">/10</span>
          </div>
          <div className="h-1 bg-card-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-accent rounded-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Resume Workout Button */}
        {hasActiveWorkout && (
          <button
            onClick={handleResumeWorkout}
            className="bg-warning py-4 rounded-xl text-center active:opacity-70"
          >
            <span className="text-text-primary text-base font-semibold">Resume Workout</span>
          </button>
        )}

        {/* Workout Day Cards */}
        <div className="flex flex-col gap-2.5">
          {days.map((day) => {
            const isCompleted = weekCompletion[day];
            const isNextUp = !hasActiveWorkout && day === getEarliestUncompletedDay();
            const isInProgress = activeWorkoutDay === day;

            return (
              <button
                key={day}
                onClick={() =>
                  isInProgress ? handleResumeWorkout() : handleStartWorkout(day)
                }
                className={`flex items-center justify-between p-[18px] rounded-[14px] border active:opacity-70 ${
                  isCompleted
                    ? 'border-accent bg-accent-bg'
                    : isInProgress
                      ? 'border-warning bg-warning-bg shadow-[0_0_12px_rgba(255,149,0,0.3)]'
                      : isNextUp
                        ? 'border-accent bg-card-bg shadow-[0_0_12px_rgba(0,255,255,0.25)]'
                        : 'bg-card-bg border-card-border'
                }`}
              >
                <div className="flex-1 flex flex-col gap-1 text-left">
                  <span
                    className={`text-base font-medium ${
                      isCompleted
                        ? 'text-accent'
                        : isNextUp || isInProgress
                          ? 'text-text-primary'
                          : 'text-text-dim'
                    }`}
                  >
                    {capitalizeDayName(day)}
                  </span>
                  {isInProgress && (
                    <span className="text-warning text-[10px] font-bold tracking-wider">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                {isCompleted && (
                  <span className="text-accent text-lg font-semibold">&#10003;</span>
                )}
                {isNextUp && <span className="text-accent text-xl">&rarr;</span>}
                {isInProgress && <span className="text-warning text-base">&#9654;</span>}
              </button>
            );
          })}
        </div>

        {/* Week Complete Banner */}
        {weekCompletion.allCompleted && progress.currentWeek < 10 && (
          <div className="bg-card-bg rounded-2xl p-5 border border-accent flex flex-col items-center gap-3">
            <span className="text-accent text-lg font-semibold">
              Week {progress.currentWeek} Complete!
            </span>
            <button
              onClick={handleAdvanceWeek}
              className="bg-accent py-3.5 px-6 rounded-[10px] active:opacity-70"
            >
              <span className="text-background text-sm font-bold">
                Advance to Week {progress.currentWeek + 1}
              </span>
            </button>
          </div>
        )}

        {/* Total Stats */}
        <div className="flex flex-col items-center gap-1 py-2">
          <span className="text-text-primary text-4xl font-light">{totalReps}</span>
          <span className="text-text-secondary text-sm">push-ups</span>
        </div>

        {/* Start Button for Next Workout */}
        {!weekCompletion.allCompleted && !hasActiveWorkout && (
          <button
            onClick={() => {
              const nextDay = getEarliestUncompletedDay();
              if (nextDay) handleStartWorkout(nextDay);
            }}
            className="border border-accent py-4 rounded-xl text-center active:opacity-70"
          >
            <span className="text-accent text-base font-medium">
              Start {capitalizeDayName(getEarliestUncompletedDay() || 'monday')}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

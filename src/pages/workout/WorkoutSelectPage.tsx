import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProgress, isWorkoutCompleted } from '@/utils/storage';
import {
  getAvailableWeeks,
  getWorkoutSummary,
  capitalizeDayName,
  DayOfWeek,
} from '@/utils/workout-helpers';

export default function WorkoutSelectPage() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weeks, setWeeks] = useState<number[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const programName = 'Beginner 1';

  useEffect(() => {
    const progress = getUserProgress();
    if (progress) {
      setCurrentWeek(progress.currentWeek);
      setExpandedWeek(progress.currentWeek);
    }
    const availableWeeks = getAvailableWeeks(programName);
    setWeeks(availableWeeks);
  }, []);

  const days: DayOfWeek[] = ['monday', 'wednesday', 'friday'];

  const handleStartWorkout = (week: number, day: DayOfWeek) => {
    navigate(
      `/workout/${day}?week=${week}&program=${encodeURIComponent(programName)}`
    );
  };

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div className="min-h-dvh bg-background overflow-y-auto">
      <div className="p-6 pt-[60px] flex flex-col gap-3">
        <h1 className="text-[28px] font-light text-text-primary mb-4">Select Workout</h1>

        {weeks.map((week) => {
          const isCurrentWeek = week === currentWeek;
          const isExpanded = expandedWeek === week;

          return (
            <div
              key={week}
              className="bg-card-bg rounded-2xl overflow-hidden border border-card-border"
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week)}
                className={`w-full flex items-center justify-between p-[18px] active:opacity-70 ${
                  isCurrentWeek ? 'border-l-[3px] border-l-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-medium ${
                      isCurrentWeek ? 'text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    Week {week}
                  </span>
                  {isCurrentWeek && (
                    <span className="text-xs font-semibold text-accent px-2 py-0.5 rounded border border-accent">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xl text-text-muted">
                  {isExpanded ? '\u2212' : '+'}
                </span>
              </button>

              {/* Expanded Days */}
              {isExpanded && (
                <div className="p-4 pt-0 flex flex-col gap-2.5">
                  {days.map((day) => {
                    const summary = getWorkoutSummary(programName, week, day);
                    const completed = isWorkoutCompleted(week, day);

                    return (
                      <button
                        key={day}
                        onClick={() => handleStartWorkout(week, day)}
                        className={`w-full text-left bg-background rounded-xl p-4 border active:opacity-70 ${
                          completed
                            ? 'border-success bg-success-bg'
                            : 'border-card-border'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-base font-medium ${
                              completed ? 'text-success' : 'text-text-primary'
                            }`}
                          >
                            {capitalizeDayName(day)}
                          </span>
                          {completed && (
                            <span className="text-lg text-success font-semibold">
                              &#10003;
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-text-muted">
                          {summary.totalSets} sets &middot; {summary.restTime}s rest
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

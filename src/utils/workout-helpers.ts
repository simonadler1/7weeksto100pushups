import { WorkoutSet, CompletedSet, WorkoutHistory } from '@/utils/storage';
import workoutPrograms from '@/constants/workoutprograms.json';

export type DayOfWeek = 'monday' | 'wednesday' | 'friday';

// Load workout data for a specific day
export function loadWorkoutForDay(
  programName: string,
  week: number,
  day: DayOfWeek
): WorkoutSet[] {
  try {
    const program = workoutPrograms.programs.find(p => p.name === programName);
    if (!program) {
      throw new Error(`Program ${programName} not found`);
    }

    const weekData = program.weeks.find(w => w.week === week);
    if (!weekData) {
      throw new Error(`Week ${week} not found in program ${programName}`);
    }

    const dayWorkout = weekData[day];
    if (!dayWorkout) {
      throw new Error(`Day ${day} not found in week ${week}`);
    }

    return dayWorkout.map((reps, index) => {
      const parsed = parseRepString(reps);
      return {
        setNumber: index + 1,
        targetReps: reps,
        isMinimum: parsed.isMinimum,
      };
    });
  } catch (error) {
    console.error('Error loading workout:', error);
    return [];
  }
}

// Get rest time between sets for a program
export function getRestBetweenSets(programName: string): number {
  const program = workoutPrograms.programs.find(p => p.name === programName);
  return program?.restBetweenSets || 60;
}

// Parse rep string (handles both numbers and "X+" format)
export function parseRepString(rep: number | string): {
  value: number;
  isMinimum: boolean;
} {
  if (typeof rep === 'number') {
    return { value: rep, isMinimum: false };
  }

  // Handle "X+" format
  const match = rep.match(/^(\d+)\+$/);
  if (match) {
    return { value: parseInt(match[1], 10), isMinimum: true };
  }

  // Fallback for unexpected format
  console.warn(`Unexpected rep format: ${rep}`);
  return { value: 0, isMinimum: false };
}

// Calculate total reps from completed sets
export function calculateTotalReps(sets: CompletedSet[]): number {
  return sets.reduce((sum, set) => sum + set.actualReps, 0);
}

// Format duration in seconds to MM:SS
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate a simple UUID
export function generateWorkoutId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check if a workout is completed
export function isWorkoutCompletedHelper(
  week: number,
  day: DayOfWeek,
  history: WorkoutHistory
): boolean {
  return history.workouts.some(w => w.week === week && w.day === day);
}

// Get workout summary for display
export function getWorkoutSummary(
  programName: string,
  week: number,
  day: DayOfWeek
): {
  totalSets: number;
  repsPreview: string;
  restTime: number;
} {
  const sets = loadWorkoutForDay(programName, week, day);
  const restTime = getRestBetweenSets(programName);

  const repsPreview = sets.map(set => {
    if (typeof set.targetReps === 'string') {
      return set.targetReps;
    }
    return set.targetReps.toString();
  }).join(', ');

  return {
    totalSets: sets.length,
    repsPreview,
    restTime,
  };
}

// Get all available weeks for a program
export function getAvailableWeeks(programName: string): number[] {
  const program = workoutPrograms.programs.find(p => p.name === programName);
  if (!program) return [];
  return program.weeks.map(w => w.week);
}

// Get program name (for now just returns the first/only program)
export function getDefaultProgramName(): string {
  return workoutPrograms.programs[0]?.name || 'Beginner 1';
}

// Capitalize day name
export function capitalizeDayName(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

// Get short day name
export function getShortDayName(day: DayOfWeek): string {
  const map: Record<DayOfWeek, string> = {
    monday: 'Mon',
    wednesday: 'Wed',
    friday: 'Fri',
  };
  return map[day];
}

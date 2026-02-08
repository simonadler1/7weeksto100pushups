// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  WORKOUT_HISTORY: 'workout_history',
  ACTIVE_WORKOUT: 'active_workout',
} as const;

// Types
export interface UserProgress {
  currentProgram: string;
  currentWeek: number;
  startDate: number;
}

export interface CompletedSet {
  setNumber: number;
  targetReps: number | string;
  actualReps: number;
  completedAt: number;
}

export interface CompletedWorkout {
  id: string;
  programName: string;
  week: number;
  day: 'monday' | 'wednesday' | 'friday';
  completedAt: number;
  sets: CompletedSet[];
  totalReps: number;
  duration: number;
}

export interface WorkoutHistory {
  workouts: CompletedWorkout[];
}

export interface WorkoutSet {
  setNumber: number;
  targetReps: number | string;
  isMinimum: boolean;
}

export interface ActiveWorkout {
  programName: string;
  week: number;
  day: 'monday' | 'wednesday' | 'friday';
  restBetweenSets: number;
  sets: WorkoutSet[];
  currentSetIndex: number;
  startedAt: number;
  completedSets: CompletedSet[];
}

// User Progress functions
export function getUserProgress(): UserProgress | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (!data) return null;
    return JSON.parse(data) as UserProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

export function initializeDefaultProgress(): void {
  const existing = getUserProgress();
  if (!existing) {
    const defaultProgress: UserProgress = {
      currentProgram: 'Beginner 1',
      currentWeek: 1,
      startDate: Date.now(),
    };
    saveUserProgress(defaultProgress);
  }
}

// Workout History functions
export function getWorkoutHistory(): WorkoutHistory {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    if (!data) return { workouts: [] };
    return JSON.parse(data) as WorkoutHistory;
  } catch (error) {
    console.error('Error getting workout history:', error);
    return { workouts: [] };
  }
}

export function addCompletedWorkout(workout: CompletedWorkout): void {
  try {
    const history = getWorkoutHistory();

    // Remove existing workout for same week/day if redoing
    const filteredWorkouts = history.workouts.filter(
      w => !(w.week === workout.week && w.day === workout.day)
    );

    // Add new workout
    filteredWorkouts.push(workout);

    // Sort by completion date (newest first)
    filteredWorkouts.sort((a, b) => b.completedAt - a.completedAt);

    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify({ workouts: filteredWorkouts }));
  } catch (error) {
    console.error('Error adding completed workout:', error);
  }
}

export function getCompletedWorkout(
  week: number,
  day: 'monday' | 'wednesday' | 'friday'
): CompletedWorkout | null {
  try {
    const history = getWorkoutHistory();
    return history.workouts.find(w => w.week === week && w.day === day) || null;
  } catch (error) {
    console.error('Error getting completed workout:', error);
    return null;
  }
}

export function isWorkoutCompleted(week: number, day: 'monday' | 'wednesday' | 'friday'): boolean {
  return getCompletedWorkout(week, day) !== null;
}

export function getWeekCompletionStatus(week: number): {
  monday: boolean;
  wednesday: boolean;
  friday: boolean;
  allCompleted: boolean;
} {
  const monday = isWorkoutCompleted(week, 'monday');
  const wednesday = isWorkoutCompleted(week, 'wednesday');
  const friday = isWorkoutCompleted(week, 'friday');

  return {
    monday,
    wednesday,
    friday,
    allCompleted: monday && wednesday && friday,
  };
}

// Active Workout functions
export function getActiveWorkout(): ActiveWorkout | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (!data) return null;
    return JSON.parse(data) as ActiveWorkout;
  } catch (error) {
    console.error('Error getting active workout:', error);
    return null;
  }
}

export function saveActiveWorkout(workout: ActiveWorkout): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
  } catch (error) {
    console.error('Error saving active workout:', error);
  }
}

export function clearActiveWorkout(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  } catch (error) {
    console.error('Error clearing active workout:', error);
  }
}

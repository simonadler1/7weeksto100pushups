import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { WorkoutSetCard, SetStatus } from "@/react native/components/workout/workout-set-card";
import { WorkoutProgress } from "@/react native/components/workout/workout-progress";
import { RestTimer } from "@/react native/components/workout/rest-timer";
import { RepInputModal } from "@/react native/components/workout/rep-input-modal";
import { colors } from "@/react native/constants/colors";
import {
  ActiveWorkout,
  CompletedSet,
  CompletedWorkout,
  saveActiveWorkout,
  clearActiveWorkout,
  addCompletedWorkout,
  getActiveWorkout,
} from "@/utils/workout-storage";
import {
  loadWorkoutForDay,
  getRestBetweenSets,
  parseRepString,
  capitalizeDayName,
  generateWorkoutId,
  calculateTotalReps,
  DayOfWeek,
} from "@/utils/workout-helpers";
import * as Haptics from "expo-haptics";

export default function WorkoutDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const day = params.day as DayOfWeek;
  const week = parseInt(params.week as string, 10);
  const programName = params.program as string;
  const isResume = params.resume === "true";

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

    const sets = loadWorkoutForDay(programName, week, day);
    const restTime = getRestBetweenSets(programName);

    const newWorkout: ActiveWorkout = {
      programName,
      week,
      day,
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
        typeof currentSet.targetReps === "number" ? currentSet.targetReps : parseRepString(currentSet.targetReps).value;
      completeSetWithReps(reps);
    }
  };

  const completeSetWithReps = (actualReps: number) => {
    if (!workout) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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

    router.dismissAll();
    router.replace("/(tabs)");
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.backButtonText}>← Exit</Text>
          </Pressable>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>WEEK {workout.week}</Text>
          <Text style={styles.headerTitle}>{capitalizeDayName(workout.day)}</Text>
        </View>

        {/* Progress */}
        <WorkoutProgress currentSet={workout.currentSetIndex + 1} totalSets={workout.sets.length} />

        {/* Sets */}
        <View style={styles.setsContainer}>
          {workout.sets.map((set, index) => {
            let status: SetStatus = "pending";
            if (index < workout.currentSetIndex) {
              status = "completed";
            } else if (index === workout.currentSetIndex) {
              status = "active";
            }

            const completedSet = workout.completedSets.find((cs) => cs.setNumber === index + 1);

            return (
              <WorkoutSetCard
                key={index}
                setNumber={set.setNumber}
                targetReps={set.targetReps}
                isMinimum={set.isMinimum}
                status={status}
                onComplete={status === "active" ? handleCompleteSet : undefined}
                actualReps={completedSet?.actualReps}
              />
            );
          })}
        </View>
      </ScrollView>

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    gap: 24,
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  headerLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "300",
  },
  setsContainer: {
    gap: 12,
  },
});

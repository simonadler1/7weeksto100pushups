import { StyleSheet, Pressable, View, ScrollView, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";

import { colors } from "@/react native/constants/colors";
import {
  getUserProgress,
  getWeekCompletionStatus,
  getActiveWorkout,
  getWorkoutHistory,
  saveUserProgress,
  clearActiveWorkout,
  UserProgress,
} from "@/utils/workout-storage";
import { capitalizeDayName, DayOfWeek } from "@/utils/workout-helpers";

export default function HomeScreen() {
  const router = useRouter();
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

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
    router.push(`/workout/${day}?week=${progress.currentWeek}&program=${encodeURIComponent(progress.currentProgram)}`);
  };

  const handleResumeWorkout = () => {
    const active = getActiveWorkout();
    if (active) {
      router.push(
        `/workout/${active.day}?week=${active.week}&program=${encodeURIComponent(active.programName)}&resume=true`,
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
    if (!weekCompletion.monday) return "monday";
    if (!weekCompletion.wednesday) return "wednesday";
    if (!weekCompletion.friday) return "friday";
    return null;
  };

  const days: DayOfWeek[] = ["monday", "wednesday", "friday"];
  const progressPercent = progress ? (progress.currentWeek / 10) * 100 : 0;

  if (!progress) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Settings Button */}
      <Pressable
        onPress={() => router.push("/settings")}
        style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}
      >
        <MaterialIcons name="settings" size={24} color={colors.textMuted} />
      </Pressable>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Hero Card with Week Progress */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>WEEK</Text>
            <Text style={styles.heroWeek}>{progress.currentWeek}</Text>
            <Text style={styles.heroTotal}>/10</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Resume Workout Button */}
        {hasActiveWorkout && (
          <Pressable
            onPress={handleResumeWorkout}
            style={({ pressed }) => [styles.resumeButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.resumeButtonText}>Resume Workout</Text>
          </Pressable>
        )}

        {/* Workout Day Cards - Minimal */}
        <View style={styles.cardsContainer}>
          {days.map((day) => {
            const isCompleted = weekCompletion[day];
            const isNextUp = !hasActiveWorkout && day === getEarliestUncompletedDay();
            const isInProgress = activeWorkoutDay === day;

            return (
              <Pressable
                key={day}
                onPress={() => (isInProgress ? handleResumeWorkout() : handleStartWorkout(day))}
                style={({ pressed }) => [
                  styles.dayCard,
                  isCompleted && styles.dayCardDone,
                  isNextUp && styles.dayCardNext,
                  isInProgress && styles.dayCardInProgress,
                  pressed && styles.buttonPressed,
                ]}
              >
                <View style={styles.dayCardContent}>
                  <Text
                    style={[
                      styles.dayText,
                      isCompleted && styles.dayTextDone,
                      isNextUp && styles.dayTextNext,
                      isInProgress && styles.dayTextInProgress,
                    ]}
                  >
                    {capitalizeDayName(day)}
                  </Text>
                  {isInProgress && <Text style={styles.inProgressBadge}>IN PROGRESS</Text>}
                </View>
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                {isNextUp && <Text style={styles.arrow}>→</Text>}
                {isInProgress && <Text style={styles.resumeArrow}>▶</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Week Complete Banner */}
        {weekCompletion.allCompleted && progress.currentWeek < 10 && (
          <View style={styles.completeBanner}>
            <Text style={styles.completeText}>Week {progress.currentWeek} Complete!</Text>
            <Pressable
              onPress={handleAdvanceWeek}
              style={({ pressed }) => [styles.advanceButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.advanceButtonText}>Advance to Week {progress.currentWeek + 1}</Text>
            </Pressable>
          </View>
        )}

        {/* Total Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsValue}>{totalReps}</Text>
          <Text style={styles.statsLabel}>push-ups</Text>
        </View>

        {/* Start Button for Next Workout */}
        {!weekCompletion.allCompleted && !hasActiveWorkout && (
          <Pressable
            onPress={() => {
              const nextDay = getEarliestUncompletedDay();
              if (nextDay) handleStartWorkout(nextDay);
            }}
            style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.actionText}>Start {capitalizeDayName(getEarliestUncompletedDay() || "monday")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  heroCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 28,
    gap: 20,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 4,
  },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    marginRight: 8,
  },
  heroWeek: {
    color: colors.accent,
    fontSize: 64,
    fontWeight: "300",
  },
  heroTotal: {
    color: colors.textMuted,
    fontSize: 28,
    fontWeight: "300",
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.cardBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  resumeButton: {
    backgroundColor: "#ff9500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resumeButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  cardsContainer: {
    gap: 10,
  },
  dayCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dayCardDone: {
    borderColor: colors.accent,
    backgroundColor: colors.accentBg,
  },
  dayCardNext: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  dayText: {
    color: colors.textDim,
    fontSize: 16,
    fontWeight: "500",
  },
  dayTextDone: {
    color: colors.accent,
  },
  dayTextNext: {
    color: colors.textPrimary,
  },
  checkmark: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "600",
  },
  arrow: {
    color: colors.accent,
    fontSize: 20,
  },
  dayCardInProgress: {
    borderColor: colors.warning,
    backgroundColor: "#1a1408",
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  dayCardContent: {
    flex: 1,
    gap: 4,
  },
  dayTextInProgress: {
    color: colors.textPrimary,
  },
  inProgressBadge: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  resumeArrow: {
    color: colors.warning,
    fontSize: 16,
  },
  completeBanner: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  completeText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "600",
  },
  advanceButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  advanceButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "700",
  },
  statsContainer: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  statsValue: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "300",
  },
  statsLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  actionText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

import { ScrollView, StyleSheet, Pressable, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  getUserProgress,
  isWorkoutCompleted,
} from '@/utils/workout-storage';
import {
  getAvailableWeeks,
  getWorkoutSummary,
  capitalizeDayName,
  DayOfWeek,
} from '@/utils/workout-helpers';

export default function SelectWorkoutScreen() {
  const router = useRouter();
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
    router.push(`/workout/${day}?week=${week}&program=${encodeURIComponent(programName)}`);
  };

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Select Workout</Text>

      {weeks.map(week => {
        const isCurrentWeek = week === currentWeek;
        const isExpanded = expandedWeek === week;

        return (
          <View key={week} style={styles.weekCard}>
            <Pressable
              onPress={() => toggleWeek(week)}
              style={({ pressed }) => [
                styles.weekHeader,
                isCurrentWeek && styles.weekHeaderCurrent,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={styles.weekHeaderContent}>
                <Text style={[styles.weekTitle, isCurrentWeek && styles.weekTitleCurrent]}>
                  Week {week}
                </Text>
                {isCurrentWeek && (
                  <Text style={styles.currentBadge}>Current</Text>
                )}
              </View>
              <Text style={styles.chevron}>{isExpanded ? '−' : '+'}</Text>
            </Pressable>

            {isExpanded && (
              <View style={styles.daysContainer}>
                {days.map(day => {
                  const summary = getWorkoutSummary(programName, week, day);
                  const completed = isWorkoutCompleted(week, day);

                  return (
                    <Pressable
                      key={day}
                      onPress={() => handleStartWorkout(week, day)}
                      style={({ pressed }) => [
                        styles.dayCard,
                        completed && styles.dayCardCompleted,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <View style={styles.dayHeader}>
                        <Text style={[styles.dayName, completed && styles.dayNameCompleted]}>
                          {capitalizeDayName(day)}
                        </Text>
                        {completed && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={styles.workoutSummary}>
                        {summary.totalSets} sets · {summary.restTime}s rest
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
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
    gap: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  weekCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  weekHeaderCurrent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  weekHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  weekTitleCurrent: {
    color: colors.textPrimary,
  },
  currentBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.accent,
    overflow: 'hidden',
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
  daysContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 10,
  },
  dayCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dayCardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dayNameCompleted: {
    color: colors.success,
  },
  checkmark: {
    fontSize: 18,
    color: colors.success,
    fontWeight: '600',
  },
  workoutSummary: {
    fontSize: 14,
    color: colors.textMuted,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

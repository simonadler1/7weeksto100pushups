import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WeeklyCalendarProps {
  week: number;
  completedDays: {
    monday: boolean;
    wednesday: boolean;
    friday: boolean;
  };
}

export function WeeklyCalendar({ week, completedDays }: WeeklyCalendarProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const days: Array<{ key: 'monday' | 'wednesday' | 'friday'; label: string }> = [
    { key: 'monday', label: 'Mon' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'friday', label: 'Fri' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>
        Week {week} Schedule
      </ThemedText>
      <View style={styles.daysContainer}>
        {days.map(day => (
          <ThemedView
            key={day.key}
            style={[
              styles.dayCard,
              completedDays[day.key] && { backgroundColor: '#4CAF50' },
            ]}
          >
            <ThemedText
              style={[
                styles.dayLabel,
                completedDays[day.key] && { color: '#FFFFFF' },
              ]}
            >
              {day.label}
            </ThemedText>
            {completedDays[day.key] && (
              <IconSymbol name="checkmark.circle.fill" size={24} color="#FFFFFF" />
            )}
          </ThemedView>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    marginBottom: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dayCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 80,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

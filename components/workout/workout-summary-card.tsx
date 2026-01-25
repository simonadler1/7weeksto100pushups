import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WorkoutSummaryCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  completed?: boolean;
}

export function WorkoutSummaryCard({
  title,
  subtitle,
  onPress,
  completed = false,
}: WorkoutSummaryCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2a2a' }, 'background');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </ThemedView>
      {completed && (
        <ThemedText style={[styles.badge, { color: '#4CAF50' }]}>
          ✓
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  badge: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.7,
  },
});

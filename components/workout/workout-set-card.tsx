import { StyleSheet, Pressable, View, Text } from 'react-native';
import { colors } from '@/constants/colors';

export type SetStatus = 'pending' | 'active' | 'completed';

interface WorkoutSetCardProps {
  setNumber: number;
  targetReps: number | string;
  isMinimum: boolean;
  status: SetStatus;
  onComplete?: () => void;
  actualReps?: number;
}

export function WorkoutSetCard({
  setNumber,
  targetReps,
  isMinimum,
  status,
  onComplete,
  actualReps,
}: WorkoutSetCardProps) {
  const displayReps = () => {
    if (status === 'completed' && actualReps) {
      return `${actualReps} reps`;
    }
    if (typeof targetReps === 'string') {
      return `${targetReps} push-ups`;
    }
    return `${targetReps} push-ups`;
  };

  const getCardStyle = () => {
    if (status === 'completed') return styles.cardCompleted;
    if (status === 'active') return styles.cardActive;
    return styles.cardPending;
  };

  const getTextStyle = () => {
    if (status === 'completed') return styles.textCompleted;
    if (status === 'active') return styles.textActive;
    return styles.textPending;
  };

  return (
    <View style={[styles.container, getCardStyle()]}>
      <View style={styles.header}>
        <Text style={[styles.setNumber, getTextStyle()]}>
          Set {setNumber}
        </Text>
        {status === 'completed' && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>

      <Text style={[styles.reps, getTextStyle()]}>
        {displayReps()}
      </Text>

      {isMinimum && status !== 'completed' && (
        <Text style={[styles.minLabel, status === 'active' ? styles.textActive : styles.textPending]}>
          Minimum - go to failure
        </Text>
      )}

      {status === 'active' && onComplete && (
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Complete Set</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
  },
  cardPending: {
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
  },
  cardActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  cardCompleted: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  textPending: {
    color: colors.textMuted,
  },
  textActive: {
    color: colors.textPrimary,
  },
  textCompleted: {
    color: colors.success,
  },
  checkmark: {
    color: colors.success,
    fontSize: 20,
    fontWeight: '600',
  },
  reps: {
    fontSize: 28,
    fontWeight: '300',
  },
  minLabel: {
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

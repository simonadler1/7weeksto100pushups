import { StyleSheet, Pressable, Modal, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { colors } from '@/constants/colors';

interface RepInputModalProps {
  visible: boolean;
  minReps: number;
  onSubmit: (reps: number) => void;
  onCancel: () => void;
}

export function RepInputModal({ visible, minReps, onSubmit, onCancel }: RepInputModalProps) {
  const [reps, setReps] = useState(minReps);

  useEffect(() => {
    if (visible) {
      setReps(minReps);
    }
  }, [visible, minReps]);

  const increment = () => setReps(prev => prev + 1);
  const decrement = () => setReps(prev => Math.max(minReps, prev - 1));

  const handleSubmit = () => {
    onSubmit(reps);
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>How many reps?</Text>

          <Text style={styles.minLabel}>Minimum: {minReps}</Text>

          <View style={styles.counterContainer}>
            <Pressable
              onPress={decrement}
              style={({ pressed }) => [
                styles.counterButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </Pressable>

            <Text style={styles.repsDisplay}>{reps}</Text>

            <Pressable
              onPress={increment}
              style={({ pressed }) => [
                styles.counterButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.button,
                styles.submitButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.submitButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    minWidth: 300,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.textPrimary,
  },
  minLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  counterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.accent,
  },
  repsDisplay: {
    fontSize: 48,
    fontWeight: '200',
    minWidth: 80,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
  submitButton: {
    backgroundColor: colors.accent,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

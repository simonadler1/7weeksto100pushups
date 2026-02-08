import { StyleSheet, Pressable, Modal, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { colors } from "@/react native/constants/colors";
import * as Haptics from "expo-haptics";

interface RestTimerProps {
  duration: number;
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ duration, visible, onComplete, onSkip }: RestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (visible) {
      setTimeRemaining(duration);
    }
  }, [visible, duration]);

  useEffect(() => {
    if (!visible || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(onComplete, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, timeRemaining, onComplete]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Rest</Text>

          <View style={styles.timerContainer}>
            <View style={styles.timerRing}>
              <Text style={styles.timeText}>{timeRemaining}</Text>
            </View>
          </View>

          <Pressable onPress={onSkip} style={({ pressed }) => [styles.skipButton, pressed && styles.buttonPressed]}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 24,
    minWidth: 280,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  timeText: {
    fontSize: 64,
    fontWeight: "200",
    color: colors.accent,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

import { StyleSheet, Pressable, View, Text, ScrollView, Modal } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { colors } from "@/react native/constants/colors";
import { getUserProgress, saveUserProgress, UserProgress } from "@/utils/workout-storage";
import { storage } from "@/utils/mmkv";

export default function SettingsScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [maxWeek, setMaxWeek] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const userProgress = getUserProgress();
    setProgress(userProgress);
    if (userProgress) {
      setMaxWeek(userProgress.currentWeek);
    }
  };

  const handleWeekChange = (newWeek: number) => {
    if (!progress || newWeek > maxWeek) return;
    const updated: UserProgress = { ...progress, currentWeek: newWeek };
    saveUserProgress(updated);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    storage.clearAll();
    setShowResetModal(false);
    router.dismissAll();
    router.replace("/onboarding/welcome");
  };

  const weeks = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Current Program Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROGRAM</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Current Program</Text>
          <Text style={styles.settingValue}>{progress?.currentProgram || "Beginner 1"}</Text>
        </View>
      </View>

      {/* Week Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>WEEK</Text>
        <View style={styles.weekGrid}>
          {weeks.map((week) => {
            const isDisabled = week > maxWeek;
            const isActive = progress?.currentWeek === week;
            return (
              <Pressable
                key={week}
                onPress={() => !isDisabled && handleWeekChange(week)}
                disabled={isDisabled}
                style={({ pressed }) => [
                  styles.weekButton,
                  isActive && styles.weekButtonActive,
                  isDisabled && styles.weekButtonDisabled,
                  pressed && !isDisabled && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.weekButtonText,
                    isActive && styles.weekButtonTextActive,
                    isDisabled && styles.weekButtonTextDisabled,
                  ]}
                >
                  {week}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>
        <Pressable
          onPress={handleResetProgress}
          style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.dangerButtonContent}>
            <MaterialIcons name="warning" size={20} color="#ff4444" />
            <Text style={styles.dangerButtonText}>Reset All Progress</Text>
          </View>
        </Pressable>
        <Text style={styles.dangerWarning}>
          This will permanently delete all workout history and start the onboarding process again.
        </Text>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>

      {/* Reset Confirmation Modal */}
      <Modal visible={showResetModal} transparent animationType="fade" onRequestClose={() => setShowResetModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="warning" size={48} color="#ff4444" />
            <Text style={styles.modalTitle}>Reset All Progress?</Text>
            <Text style={styles.modalMessage}>
              This will permanently delete all workout history. You will need to complete the initial test again. This
              action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowResetModal(false)}
                style={({ pressed }) => [styles.modalButton, styles.modalCancelButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmReset}
                style={({ pressed }) => [styles.modalButton, styles.modalResetButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.modalResetText}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  settingRow: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  settingValue: {
    color: colors.textMuted,
    fontSize: 16,
  },
  weekGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  weekButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  weekButtonActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
  },
  weekButtonText: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: "500",
  },
  weekButtonTextActive: {
    color: colors.accent,
  },
  weekButtonDisabled: {
    opacity: 0.3,
  },
  weekButtonTextDisabled: {
    color: colors.textDim,
  },
  dangerButton: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  dangerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
  dangerWarning: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 16,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "600",
  },
  modalMessage: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: colors.cardBorder,
  },
  modalCancelText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  modalResetButton: {
    backgroundColor: "#ff4444",
  },
  modalResetText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

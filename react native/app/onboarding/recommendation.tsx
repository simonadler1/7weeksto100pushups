import { StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/react native/constants/colors";
import { findProgramForPushupCount } from "@/utils/program-matcher";
import { saveUserProgress } from "@/utils/workout-storage";

export default function RecommendationScreen() {
  const router = useRouter();
  const { count } = useLocalSearchParams<{ count: string }>();
  const pushupCount = parseInt(count || "1", 10);

  const program = findProgramForPushupCount(pushupCount);

  const getRangeText = () => {
    if (program.initialTestMax === null) {
      return `${program.initialTestMin}+ push-ups`;
    }
    return `${program.initialTestMin}-${program.initialTestMax} push-ups`;
  };

  const handleStartTraining = () => {
    saveUserProgress({
      currentProgram: program.name,
      currentWeek: 1,
      startDate: Date.now(),
    });
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.textMuted} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.resultCard}>
          <Text style={styles.yourResult}>Your result</Text>
          <Text style={styles.resultNumber}>{pushupCount}</Text>
          <Text style={styles.resultLabel}>push-ups</Text>
        </View>

        <View style={styles.programCard}>
          <Text style={styles.recommendedLabel}>RECOMMENDED PROGRAM</Text>
          <Text style={styles.programName}>{program.name}</Text>
          <Text style={styles.programDescription}>{program.description}</Text>
          <View style={styles.rangeContainer}>
            <MaterialIcons name="people" size={16} color={colors.textMuted} />
            <Text style={styles.rangeText}>Designed for people who can do {getRangeText()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={handleStartTraining}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Start Training</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  resultCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  yourResult: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resultNumber: {
    color: colors.textPrimary,
    fontSize: 64,
    fontWeight: "200",
    marginVertical: 4,
  },
  resultLabel: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  programCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  recommendedLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  programName: {
    color: colors.accent,
    fontSize: 32,
    fontWeight: "600",
  },
  programDescription: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  rangeText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

import { StyleSheet, View, Text } from "react-native";
import { colors } from "@/react native/constants/colors";

interface WorkoutProgressProps {
  currentSet: number;
  totalSets: number;
}

export function WorkoutProgress({ currentSet, totalSets }: WorkoutProgressProps) {
  const progress = Math.min(currentSet / totalSets, 1);
  const displaySet = Math.min(currentSet, totalSets);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Set {displaySet} of {totalSets}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: colors.textSecondary,
  },
  progressBar: {
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
});

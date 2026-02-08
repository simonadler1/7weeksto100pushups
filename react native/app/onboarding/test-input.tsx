import { StyleSheet, View, Text, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/react native/constants/colors";

export default function TestInputScreen() {
  const router = useRouter();
  const [count, setCount] = useState(1);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(1, prev - 1));

  const handleContinue = () => {
    router.push(`/onboarding/recommendation?count=${count}`);
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
        <Text style={styles.title}>How many did you do?</Text>
        <Text style={styles.subtitle}>Enter your max push-up count</Text>

        <View style={styles.counterCard}>
          <View style={styles.counterContainer}>
            <Pressable
              onPress={decrement}
              style={({ pressed }) => [styles.counterButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </Pressable>

            <Text style={styles.countDisplay}>{count}</Text>

            <Pressable
              onPress={increment}
              style={({ pressed }) => [styles.counterButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.quickButtons}>
            {[5, 10, 15, 20].map((num) => (
              <Pressable
                key={num}
                onPress={() => setCount(num)}
                style={({ pressed }) => [
                  styles.quickButton,
                  count === num && styles.quickButtonActive,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={[styles.quickButtonText, count === num && styles.quickButtonTextActive]}>{num}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleContinue} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Continue</Text>
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
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  counterCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    width: "100%",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  counterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: {
    fontSize: 36,
    fontWeight: "300",
    color: colors.accent,
  },
  countDisplay: {
    fontSize: 72,
    fontWeight: "200",
    minWidth: 100,
    textAlign: "center",
    color: colors.accent,
  },
  quickButtons: {
    flexDirection: "row",
    gap: 12,
  },
  quickButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.cardBorder,
  },
  quickButtonActive: {
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  quickButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  quickButtonTextActive: {
    color: colors.accent,
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

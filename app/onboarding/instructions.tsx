import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '@/constants/colors';

export default function InstructionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.textMuted} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="fitness-center" size={48} color={colors.accent} />
        </View>

        <Text style={styles.title}>Initial Test</Text>
        <Text style={styles.subtitle}>
          Let's find the right program for you
        </Text>

        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Get into push-up position
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Do as many push-ups as you can with proper form
            </Text>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Stop when you can't complete another rep
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push('/onboarding/test-input')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>I'm Ready</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accentBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  instructionsList: {
    gap: 16,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  numberText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    color: colors.textSecondary,
    fontSize: 16,
    flex: 1,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

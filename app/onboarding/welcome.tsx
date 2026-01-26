import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.weekNumber}>100</Text>
          <Text style={styles.title}>Push-ups</Text>
          <Text style={styles.subtitle}>in 7 weeks</Text>
        </View>

        <Text style={styles.description}>
          A proven program to build your strength, one push-up at a time.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push('/onboarding/instructions')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
    paddingTop: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  heroSection: {
    alignItems: 'center',
  },
  weekNumber: {
    color: colors.accent,
    fontSize: 96,
    fontWeight: '200',
    lineHeight: 96,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '600',
    marginTop: -8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '400',
    marginTop: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

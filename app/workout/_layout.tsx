import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="select"
        options={{
          title: 'Select Workout',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="[day]"
        options={{
          headerShown: false,
          presentation: 'card',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack>
  );
}

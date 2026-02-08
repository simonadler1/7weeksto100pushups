# Convert React Native App to React Vite PWA

## Context
The "7 Weeks to 100 Push-ups" fitness app currently lives in the `react native/` subfolder as an Expo/React Native project. The goal is to create a new React + Vite + TypeScript PWA in the project root, converting all screens, components, and data logic from React Native to web. The app should follow Vercel/React best practices and be deployable as a standalone PWA.

## Tech Stack
- **React 19 + TypeScript** (strict mode)
- **Vite** with `@vitejs/plugin-react`
- **React Router v7** (`react-router-dom`) for routing
- **Tailwind CSS v4** via `@tailwindcss/vite` (CSS-first config)
- **vite-plugin-pwa** for service worker + manifest
- **react-icons** for Material Design icons (replaces `@expo/vector-icons`)
- **localStorage** for persistence (replaces MMKV)

## Project Structure
```
/ (root)
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
├── vercel.json
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── apple-touch-icon.png
└── src/
    ├── main.tsx
    ├── App.tsx                          # Router + onboarding redirect
    ├── index.css                        # Tailwind v4 + theme tokens
    ├── pages/
    │   ├── HomePage.tsx                 # ← app/(tabs)/index.tsx
    │   ├── SettingsPage.tsx             # ← app/settings.tsx
    │   ├── onboarding/
    │   │   ├── WelcomePage.tsx          # ← app/onboarding/welcome.tsx
    │   │   ├── InstructionsPage.tsx     # ← app/onboarding/instructions.tsx
    │   │   ├── TestInputPage.tsx        # ← app/onboarding/test-input.tsx
    │   │   └── RecommendationPage.tsx   # ← app/onboarding/recommendation.tsx
    │   └── workout/
    │       ├── WorkoutDayPage.tsx       # ← app/workout/[day].tsx
    │       └── WorkoutSelectPage.tsx    # ← app/workout/select.tsx
    ├── components/workout/
    │   ├── WorkoutSetCard.tsx
    │   ├── WorkoutProgress.tsx
    │   ├── RestTimer.tsx
    │   └── RepInputModal.tsx
    ├── utils/
    │   ├── storage.ts                   # localStorage adapter + all types/functions
    │   ├── workout-helpers.ts           # Pure logic (mostly copy, update imports)
    │   └── program-matcher.ts           # Pure logic (copy, update imports)
    └── constants/
        └── workoutprograms.json         # Exact copy
```

---

## Implementation Steps

### Step 1: Scaffold & Configure
- Run `npm create vite@latest . -- --template react-ts` in root
- Install deps: `react-router-dom@7`, `tailwindcss@4`, `@tailwindcss/vite`, `vite-plugin-pwa`, `react-icons`
- Configure `vite.config.ts` with React, Tailwind, and PWA plugins
- Set up `@` path alias in both vite config and tsconfig
- Create `vercel.json` with SPA rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

### Step 2: Tailwind Theme & Global Styles
Create `src/index.css` with Tailwind v4 CSS-first config mapping the dark theme from `react native/constants/colors.ts`:

```css
@import "tailwindcss";

@theme {
  --color-background: #0c0c0c;
  --color-card-bg: #141418;
  --color-card-border: #1f1f24;
  --color-accent: #00ffff;
  --color-accent-bg: #0c1414;
  --color-success: #22c55e;
  --color-success-bg: #0c140c;
  --color-warning: #ff9500;
  --color-danger: #ff4444;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-muted: #999999;
  --color-text-dim: #777777;
  --color-overlay: rgba(0, 0, 0, 0.85);
}
```

This enables usage like `bg-background`, `text-accent`, `border-card-border`, etc.

### Step 3: Storage Layer
Create `src/utils/storage.ts` — replace MMKV with localStorage adapter:

**Source reference**: `react native/utils/workout-storage.ts`

Keep all type interfaces identical:
- `UserProgress` — `{ currentProgram: string; currentWeek: number; startDate: number }`
- `CompletedSet` — `{ setNumber: number; targetReps: number | string; actualReps: number; completedAt: number }`
- `CompletedWorkout` — `{ id: string; programName: string; week: number; day: 'monday' | 'wednesday' | 'friday'; completedAt: number; sets: CompletedSet[]; totalReps: number; duration: number }`
- `WorkoutHistory` — `{ workouts: CompletedWorkout[] }`
- `WorkoutSet` — `{ setNumber: number; targetReps: number | string; isMinimum: boolean }`
- `ActiveWorkout` — `{ programName: string; week: number; day: ...; restBetweenSets: number; sets: WorkoutSet[]; currentSetIndex: number; startedAt: number; completedSets: CompletedSet[] }`

Keep all functions with same signatures. Only change the underlying calls:
- `storage.getString(key)` → `localStorage.getItem(key)`
- `storage.set(key, value)` → `localStorage.setItem(key, value)`
- `storage.delete(key)` → `localStorage.removeItem(key)`
- `storage.clearAll()` → `localStorage.clear()`

Storage keys: `'user_progress'`, `'workout_history'`, `'active_workout'`

### Step 4: Copy Pure Utility Files
- Copy `react native/constants/workoutprograms.json` verbatim to `src/constants/workoutprograms.json`
- Adapt `react native/utils/workout-helpers.ts` → `src/utils/workout-helpers.ts` — update import paths only (no RN deps)
- Adapt `react native/utils/program-matcher.ts` → `src/utils/program-matcher.ts` — update import paths only (no RN deps)

### Step 5: App Shell & Routing
Create `src/App.tsx` with React Router v7:

| RN Route | Web Route | Component |
|---|---|---|
| `app/(tabs)/index.tsx` | `/` | `HomePage` |
| `app/onboarding/welcome.tsx` | `/onboarding/welcome` | `WelcomePage` |
| `app/onboarding/instructions.tsx` | `/onboarding/instructions` | `InstructionsPage` |
| `app/onboarding/test-input.tsx` | `/onboarding/test-input` | `TestInputPage` |
| `app/onboarding/recommendation.tsx` | `/onboarding/recommendation` | `RecommendationPage` |
| `app/workout/[day].tsx` | `/workout/:day` | `WorkoutDayPage` |
| `app/workout/select.tsx` | `/workout/select` | `WorkoutSelectPage` |
| `app/settings.tsx` | `/settings` | `SettingsPage` |

Root redirects to `/onboarding/welcome` if no `UserProgress` in localStorage.

Create `src/main.tsx` entry point that renders `<App />` into `#root`, importing `index.css`.

### Step 6: Convert Onboarding Pages (4 pages)

**General conversion rules for all pages:**
- `<View>` → `<div>`, `<Text>` → `<span>`/`<p>`/`<h1>`, `<Pressable>` → `<button>`, `<ScrollView>` → `<div className="overflow-y-auto">`
- `useRouter()` → `useNavigate()`, `router.push()` → `navigate()`, `router.back()` → `navigate(-1)`
- `useLocalSearchParams()` → `useParams()` + `useSearchParams()`
- `StyleSheet.create()` → Tailwind utility classes
- `MaterialIcons name="X"` → `<MdX />` from `react-icons/md`

**Pages to convert:**
1. **WelcomePage** ← `react native/app/onboarding/welcome.tsx` (90 lines)
   - Hero: "100" large accent, "Push-ups" title, "in 7 weeks" subtitle
   - "Get Started" button → navigates to `/onboarding/instructions`

2. **InstructionsPage** ← `react native/app/onboarding/instructions.tsx` (153 lines)
   - Back button, fitness icon, 3 numbered instruction items
   - "I'm Ready" button → navigates to `/onboarding/test-input`

3. **TestInputPage** ← `react native/app/onboarding/test-input.tsx` (188 lines)
   - Counter with +/- buttons, quick select (5/10/15/20)
   - "Continue" → navigates to `/onboarding/recommendation?count=${count}`

4. **RecommendationPage** ← `react native/app/onboarding/recommendation.tsx` (174 lines)
   - Uses `useSearchParams()` to get `count`
   - Shows recommended program card
   - "Start Training" saves progress → `navigate("/", { replace: true })`

### Step 7: Convert Workout Components (4 components)

1. **WorkoutProgress** ← `react native/components/workout/workout-progress.tsx`
   - Simple progress bar: track `bg-card-border`, fill `bg-accent` with inline width

2. **WorkoutSetCard** ← `react native/components/workout/workout-set-card.tsx`
   - Status-based styling: pending (gray), active (cyan border + glow), completed (green border)
   - "Complete Set" button on active, checkmark on completed

3. **RestTimer** ← `react native/components/workout/rest-timer.tsx`
   - RN `<Modal>` → fixed overlay div (`fixed inset-0 bg-overlay z-50`)
   - Circular timer ring, countdown display, skip button
   - Replace `Haptics.notificationAsync()` → `navigator.vibrate?.(200)`

4. **RepInputModal** ← `react native/components/workout/rep-input-modal.tsx`
   - Fixed overlay, counter with +/- buttons, submit/cancel

### Step 8: Convert Main Pages (4 pages)

1. **HomePage** ← `react native/app/(tabs)/index.tsx` (433 lines — largest page)
   - Week hero card with progress bar
   - 3 day cards (Mon/Wed/Fri) with status indicators
   - Resume workout button, total reps counter
   - Week completion banner with advance button
   - Replace `useFocusEffect` → `useEffect` (+ optional `visibilitychange` listener for PWA)
   - Settings gear button → `navigate("/settings")`

2. **WorkoutDayPage** ← `react native/app/workout/[day].tsx` (285 lines — most complex workflow)
   - `useParams()` for `:day`, `useSearchParams()` for `week`, `program`, `resume`
   - Orchestrates WorkoutSetCard + RestTimer + RepInputModal
   - Saves progress after each set, completes workout on finish
   - `router.dismissAll(); router.replace("/(tabs)")` → `navigate("/", { replace: true })`

3. **WorkoutSelectPage** ← `react native/app/workout/select.tsx` (200 lines)
   - Accordion week cards, read program from `getUserProgress()` (not hardcoded)
   - Day cards with completion checkmarks

4. **SettingsPage** ← `react native/app/settings.tsx` (342 lines)
   - Week selector: `grid grid-cols-5 gap-2` with 10 buttons
   - Reset confirmation: RN `<Modal>` → fixed overlay div
   - Reset action: `localStorage.clear()` → `navigate("/onboarding/welcome", { replace: true })`

### Step 9: PWA Setup
- Generate icons from existing `react native/assets/images/icon.png` → `public/`
- `index.html` meta tags: `theme-color=#0c0c0c`, `apple-mobile-web-app-capable=yes`, `viewport-fit=cover`
- PWA manifest in vite-plugin-pwa config: `display: standalone`, `orientation: portrait`
- Workbox precaches all static assets for offline support

### Step 10: Polish & Mobile Optimization
- `max-w-md mx-auto` wrapper for centered mobile layout on desktop
- `min-h-dvh` for full-height pages
- `user-scalable=no` in viewport meta to prevent pinch-zoom during workouts
- Safe area padding via `env(safe-area-inset-top)` for PWA standalone mode
- Active states on buttons: `active:opacity-70`
- Smooth transitions on modals/overlays

---

## Files NOT Being Converted
These are Expo boilerplate/template files unused by the actual app:
- `app/(tabs)/explore.tsx`, `app/modal.tsx`
- `components/external-link.tsx`, `components/haptic-tab.tsx`, `components/hello-wave.tsx`, `components/parallax-scroll-view.tsx`
- `components/themed-text.tsx`, `components/themed-view.tsx` (replaced by Tailwind)
- `components/ui/collapsible.tsx`, `components/ui/icon-symbol.tsx`
- All hooks in `hooks/` (replaced by Tailwind dark mode)

## Conversion Reference

| React Native | Web Equivalent |
|---|---|
| `<View>` | `<div>` |
| `<Text>` | `<span>`, `<p>`, `<h1>`-`<h6>` |
| `<ScrollView>` | `<div className="overflow-y-auto">` |
| `<Pressable onPress={fn}>` | `<button onClick={fn}>` |
| `<Modal visible={bool}>` | Conditional fixed overlay div |
| `StyleSheet.create()` | Tailwind classes |
| `MaterialIcons name="X"` | `<MdX />` from `react-icons/md` |
| `expo-haptics` | `navigator.vibrate?.()` |
| `useRouter()` | `useNavigate()` |
| `router.push(path)` | `navigate(path)` |
| `router.back()` | `navigate(-1)` |
| `router.replace(path)` | `navigate(path, { replace: true })` |
| `router.dismissAll()` + `router.replace()` | `navigate(path, { replace: true })` |
| `useFocusEffect` | `useEffect` |
| `useLocalSearchParams()` | `useParams()` + `useSearchParams()` |
| MMKV `storage.getString()` | `localStorage.getItem()` |
| MMKV `storage.set()` | `localStorage.setItem()` |
| MMKV `storage.delete()` | `localStorage.removeItem()` |
| MMKV `storage.clearAll()` | `localStorage.clear()` |

## Verification
1. `npm run dev` — app loads at localhost
2. Full onboarding flow: Welcome → Instructions → Test Input → Recommendation → Home
3. Home page: correct week, day completion status, total reps
4. Workout execution: start → complete sets → rest timer → rep input for "X+" → finish → saves
5. Resume: interrupt workout → return → resume from saved state
6. Settings: change week, reset all progress, redirects to onboarding
7. `npm run build && npm run preview` — production build works
8. Lighthouse PWA audit passes
9. Offline: works after first load
10. Responsive: correct on mobile (375-428px), centered on desktop

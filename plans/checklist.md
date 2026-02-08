# Development Checklist

> Track progress on converting the React Native app to a React Vite PWA.
> Mark items with `[x]` when complete. Add notes if needed.

## Step 1: Scaffold & Configure
- [x] Run `npm create vite@latest . -- --template react-ts`
- [x] Install dependencies: `react-router-dom@7`, `tailwindcss@4`, `@tailwindcss/vite`, `vite-plugin-pwa`, `react-icons`
- [x] Configure `vite.config.ts` (React + Tailwind + PWA plugins + `@` alias)
- [x] Configure `tsconfig.json` / `tsconfig.app.json` (strict mode + `@` path alias)
- [x] Create `vercel.json` with SPA rewrite
- [x] Create `index.html` with PWA meta tags
- [x] Verify: `npm run dev` starts without errors

## Step 2: Tailwind Theme & Global Styles
- [x] Create `src/index.css` with Tailwind v4 `@theme` block
- [x] Map all colors from `react native/constants/colors.ts`
- [x] Verify: theme tokens work (e.g., `bg-background` renders `#0c0c0c`)

## Step 3: Storage Layer
- [x] Create `src/utils/storage.ts` with localStorage adapter
- [x] Port all type interfaces (`UserProgress`, `CompletedSet`, `CompletedWorkout`, `WorkoutHistory`, `WorkoutSet`, `ActiveWorkout`)
- [x] Port all storage functions (`getUserProgress`, `saveUserProgress`, `getWorkoutHistory`, `addCompletedWorkout`, `getCompletedWorkout`, `isWorkoutCompleted`, `getWeekCompletionStatus`, `getActiveWorkout`, `saveActiveWorkout`, `clearActiveWorkout`, `initializeDefaultProgress`)
- [x] Verify: can save and retrieve data from localStorage

## Step 4: Copy Pure Utility Files
- [x] Copy `workoutprograms.json` to `src/constants/`
- [x] Adapt `workout-helpers.ts` to `src/utils/` (update imports)
- [x] Adapt `program-matcher.ts` to `src/utils/` (update imports)
- [x] Verify: imports resolve, no RN dependencies remain

## Step 5: App Shell & Routing
- [x] Create `src/main.tsx` entry point
- [x] Create `src/App.tsx` with React Router v7 routes
- [x] Implement onboarding redirect logic (no UserProgress → `/onboarding/welcome`)
- [x] Verify: all routes render placeholder content, navigation works

## Step 6: Convert Onboarding Pages
- [x] `WelcomePage.tsx` — hero text, "Get Started" button
- [x] `InstructionsPage.tsx` — back button, fitness icon, 3 instructions, "I'm Ready"
- [x] `TestInputPage.tsx` — counter +/-, quick select buttons, "Continue"
- [x] `RecommendationPage.tsx` — program card, "Start Training" saves & redirects
- [x] Verify: full onboarding flow works end-to-end, data saved to localStorage

## Step 7: Convert Workout Components
- [x] `WorkoutProgress.tsx` — progress bar
- [x] `WorkoutSetCard.tsx` — status-based styling (pending/active/completed)
- [x] `RestTimer.tsx` — fixed overlay, countdown, skip button
- [x] `RepInputModal.tsx` — fixed overlay, counter, submit/cancel
- [x] Verify: components render correctly in isolation

## Step 8: Convert Main Pages
- [x] `HomePage.tsx` — week hero, day cards, resume button, stats, advance week
- [x] `WorkoutDayPage.tsx` — set tracking, rest timer, rep input orchestration
- [x] `WorkoutSelectPage.tsx` — accordion week cards, day cards
- [x] `SettingsPage.tsx` — week selector grid, reset with confirmation, about
- [x] Verify: all pages functional, data flows correctly

## Step 9: PWA Setup
- [x] Generate PWA icons from `react native/assets/images/icon.png`
- [x] Place icons in `public/` (favicon.png, pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png)
- [x] Verify: PWA manifest loads correctly
- [x] Verify: service worker registers
- [ ] Verify: Lighthouse PWA audit passes

## Step 10: Polish & Mobile Optimization
- [x] Add `max-w-md mx-auto` wrapper for desktop centering
- [x] Add safe area padding for PWA standalone mode
- [x] Add `active:opacity-70` on all interactive elements
- [x] Test on mobile viewport (375-428px)
- [ ] Test offline functionality
- [x] Verify: `npm run build && npm run preview` works

## Final Verification
- [x] Onboarding flow complete
- [x] Workout execution complete (all set types)
- [ ] Workout resume works
- [ ] Week advancement works
- [ ] Settings reset works
- [x] PWA installable
- [ ] Offline capable
- [x] No TypeScript errors
- [x] No console errors
- [x] Production build succeeds

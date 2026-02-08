import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUserProgress } from '@/utils/storage'
import HomePage from '@/pages/HomePage'
import WelcomePage from '@/pages/onboarding/WelcomePage'
import InstructionsPage from '@/pages/onboarding/InstructionsPage'
import TestInputPage from '@/pages/onboarding/TestInputPage'
import RecommendationPage from '@/pages/onboarding/RecommendationPage'
import WorkoutDayPage from '@/pages/workout/WorkoutDayPage'
import WorkoutSelectPage from '@/pages/workout/WorkoutSelectPage'
import SettingsPage from '@/pages/SettingsPage'

function RedirectGuard({ children }: { children: React.ReactNode }) {
  const progress = getUserProgress()
  if (!progress) {
    return <Navigate to="/onboarding/welcome" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-dvh relative">
        <Routes>
          <Route path="/" element={<RedirectGuard><HomePage /></RedirectGuard>} />
          <Route path="/onboarding/welcome" element={<WelcomePage />} />
          <Route path="/onboarding/instructions" element={<InstructionsPage />} />
          <Route path="/onboarding/test-input" element={<TestInputPage />} />
          <Route path="/onboarding/recommendation" element={<RecommendationPage />} />
          <Route path="/workout/select" element={<WorkoutSelectPage />} />
          <Route path="/workout/:day" element={<WorkoutDayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWarning } from 'react-icons/md';
import { getUserProgress, saveUserProgress, UserProgress } from '@/utils/storage';

export default function SettingsPage() {
  const navigate = useNavigate();
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

  const confirmReset = () => {
    localStorage.clear();
    setShowResetModal(false);
    navigate('/onboarding/welcome', { replace: true });
  };

  const weeks = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-dvh bg-background overflow-y-auto">
      <div className="p-6 pt-[60px] flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card-bg border border-card-border flex items-center justify-center active:opacity-70"
          >
            <span className="text-text-primary text-lg">&times;</span>
          </button>
          <span className="text-text-primary text-xl font-semibold">Settings</span>
          <div className="w-10" />
        </div>

        {/* Program Section */}
        <div className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold tracking-widest">
            PROGRAM
          </span>
          <div className="bg-card-bg rounded-xl p-4 flex justify-between items-center border border-card-border">
            <span className="text-text-primary text-base">Current Program</span>
            <span className="text-text-muted text-base">
              {progress?.currentProgram || 'Beginner 1'}
            </span>
          </div>
        </div>

        {/* Week Section */}
        <div className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold tracking-widest">
            WEEK
          </span>
          <div className="grid grid-cols-5 gap-2">
            {weeks.map((week) => {
              const isDisabled = week > maxWeek;
              const isActive = progress?.currentWeek === week;

              return (
                <button
                  key={week}
                  onClick={() => !isDisabled && handleWeekChange(week)}
                  disabled={isDisabled}
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center active:opacity-70 ${
                    isActive
                      ? 'bg-accent-bg border-accent'
                      : isDisabled
                        ? 'bg-card-bg border-card-border opacity-30 cursor-not-allowed'
                        : 'bg-card-bg border-card-border'
                  }`}
                >
                  <span
                    className={`text-lg font-medium ${
                      isActive
                        ? 'text-accent'
                        : isDisabled
                          ? 'text-text-dim'
                          : 'text-text-muted'
                    }`}
                  >
                    {week}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Section */}
        <div className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold tracking-widest">
            DATA
          </span>
          <button
            onClick={() => setShowResetModal(true)}
            className="bg-card-bg rounded-xl p-4 border border-danger flex items-center justify-center gap-2 active:opacity-70"
          >
            <MdWarning size={20} className="text-danger" />
            <span className="text-danger font-medium">Reset All Progress</span>
          </button>
          <p className="text-text-dim text-xs text-center leading-[18px]">
            This will permanently delete all workout history and start the onboarding
            process again.
          </p>
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-3">
          <span className="text-text-muted text-xs font-semibold tracking-widest">
            ABOUT
          </span>
          <div className="bg-card-bg rounded-xl p-4 flex justify-between items-center border border-card-border">
            <span className="text-text-primary text-base">Version</span>
            <span className="text-text-muted text-base">1.0.0</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-6">
          <div className="bg-card-bg rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-xs border border-card-border">
            <MdWarning size={48} className="text-danger" />
            <span className="text-text-primary text-xl font-semibold">
              Reset All Progress?
            </span>
            <p className="text-text-muted text-sm text-center leading-5">
              This will permanently delete all workout history. You will need to complete
              the initial test again. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-2 w-full">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3.5 rounded-xl bg-card-border text-text-primary font-medium text-center active:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-3.5 rounded-xl bg-danger text-text-primary font-semibold text-center active:opacity-70"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

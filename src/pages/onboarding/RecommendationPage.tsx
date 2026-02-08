import { useNavigate, useSearchParams } from "react-router-dom";
import { MdArrowBack, MdPeople } from "react-icons/md";
import { findProgramForPushupCount } from "@/utils/program-matcher";
import { saveUserProgress } from "@/utils/storage";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pushupCount = parseInt(searchParams.get("count") || "1", 10);

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
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 pt-[60px]">
      <button
        onClick={() => navigate(-1)}
        className="w-11 h-11 rounded-full bg-card-bg border border-card-border flex items-center justify-center active:opacity-70 transition-opacity"
      >
        <MdArrowBack size={24} className="text-text-muted" />
      </button>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="bg-card-bg rounded-[20px] p-6 border border-card-border flex flex-col items-center">
          <span className="text-text-muted text-sm font-medium tracking-wider uppercase">
            Your result
          </span>
          <span className="text-text-primary text-[64px] font-extralight my-1 leading-none">
            {pushupCount}
          </span>
          <span className="text-text-secondary text-base">push-ups</span>
        </div>

        <div className="bg-card-bg rounded-[20px] p-7 border border-accent shadow-[0_0_16px_rgba(0,255,255,0.2)] flex flex-col items-center gap-3">
          <span className="text-text-muted text-xs font-semibold tracking-[2px]">
            RECOMMENDED PROGRAM
          </span>
          <span className="text-accent text-[32px] font-semibold">
            {program.name}
          </span>
          <p className="text-text-secondary text-base text-center">
            {program.description}
          </p>
          <div className="flex flex-row items-center gap-2 mt-2">
            <MdPeople size={16} className="text-text-muted" />
            <span className="text-text-muted text-sm">
              Designed for people who can do {getRangeText()}
            </span>
          </div>
        </div>
      </div>

      <div className="pb-10">
        <button
          onClick={handleStartTraining}
          className="w-full bg-accent py-[18px] rounded-xl active:opacity-70 transition-opacity"
        >
          <span className="text-background text-lg font-semibold">
            Start Training
          </span>
        </button>
      </div>
    </div>
  );
}

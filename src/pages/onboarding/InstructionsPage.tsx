import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdFitnessCenter } from "react-icons/md";

export default function InstructionsPage() {
  const navigate = useNavigate();

  const instructions = [
    "Get into push-up positiontest",
    "Do as many push-ups as you can with proper form",
    "Stop when you can't complete another rep",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 pt-[60px]">
      <button
        onClick={() => navigate(-1)}
        className="w-11 h-11 rounded-full bg-card-bg border border-card-border flex items-center justify-center active:opacity-70 transition-opacity"
      >
        <MdArrowBack size={24} className="text-text-muted" />
      </button>

      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <div className="w-[100px] h-[100px] rounded-full bg-accent-bg border border-accent flex items-center justify-center">
          <MdFitnessCenter size={48} className="text-accent" />
        </div>

        <h1 className="text-text-primary text-[32px] font-semibold">Initial Test</h1>
        <p className="text-text-muted text-base text-center">Let's find the right program for you</p>

        <div className="flex flex-col gap-4 px-2 mt-4">
          {instructions.map((text, index) => (
            <div key={index} className="flex flex-row items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-card-bg border border-card-border flex items-center justify-center shrink-0">
                <span className="text-accent text-sm font-semibold">{index + 1}</span>
              </div>
              <span className="text-text-secondary text-base flex-1">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-10">
        <button
          onClick={() => navigate("/onboarding/test-input")}
          className="w-full border border-accent py-[18px] rounded-xl active:opacity-70 transition-opacity"
        >
          <span className="text-accent text-lg font-semibold">I'm Ready</span>
        </button>
      </div>
    </div>
  );
}

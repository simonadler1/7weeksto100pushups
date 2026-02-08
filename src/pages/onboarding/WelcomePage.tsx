import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 pt-20">
      <div className="flex-1 flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-accent text-[96px] font-extralight leading-[96px]">
            100
          </span>
          <h1 className="text-text-primary text-4xl font-semibold -mt-2">
            Push-ups
          </h1>
          <span className="text-text-muted text-xl font-normal mt-1">
            in 7 weeks
          </span>
        </div>

        <p className="text-text-secondary text-base text-center leading-6 px-5">
          A proven program to build your strength, one push-up at a time.
        </p>
      </div>

      <div className="pb-10">
        <button
          onClick={() => navigate("/onboarding/instructions")}
          className="w-full bg-accent py-[18px] rounded-xl active:opacity-70 transition-opacity"
        >
          <span className="text-background text-lg font-semibold">
            Get Started
          </span>
        </button>
      </div>
    </div>
  );
}

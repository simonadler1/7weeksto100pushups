import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

export default function TestInputPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(1, prev - 1));

  const handleContinue = () => {
    navigate(`/onboarding/recommendation?count=${count}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 pt-[60px]">
      <button
        onClick={() => navigate(-1)}
        className="w-11 h-11 rounded-full bg-card-bg border border-card-border flex items-center justify-center active:opacity-70 transition-opacity"
      >
        <MdArrowBack size={24} className="text-text-muted" />
      </button>

      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <h1 className="text-text-primary text-[28px] font-semibold text-center">
          How many did you do?
        </h1>
        <p className="text-text-muted text-base text-center mb-4">
          Enter your max push-up count
        </p>

        <div className="w-full bg-card-bg rounded-3xl p-8 border border-card-border flex flex-col items-center gap-6">
          <div className="flex flex-row items-center gap-8">
            <button
              onClick={decrement}
              className="w-16 h-16 rounded-full border border-accent flex items-center justify-center active:opacity-70 transition-opacity"
            >
              <span className="text-accent text-4xl font-light leading-none">
                −
              </span>
            </button>

            <span className="text-accent text-[72px] font-extralight min-w-[100px] text-center leading-none">
              {count}
            </span>

            <button
              onClick={increment}
              className="w-16 h-16 rounded-full border border-accent flex items-center justify-center active:opacity-70 transition-opacity"
            >
              <span className="text-accent text-4xl font-light leading-none">
                +
              </span>
            </button>
          </div>

          <div className="flex flex-row gap-3">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`py-2.5 px-[18px] rounded-[10px] active:opacity-70 transition-opacity ${
                  count === num
                    ? "bg-accent-bg border border-accent"
                    : "bg-card-border"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    count === num ? "text-accent" : "text-text-muted"
                  }`}
                >
                  {num}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-10">
        <button
          onClick={handleContinue}
          className="w-full bg-accent py-[18px] rounded-xl active:opacity-70 transition-opacity"
        >
          <span className="text-background text-lg font-semibold">
            Continue
          </span>
        </button>
      </div>
    </div>
  );
}

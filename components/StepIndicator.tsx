import { Check } from "lucide-react";

const steps = ["Recipient", "Amount", "Review"];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                isDone
                  ? "bg-green-500 text-white"
                  : isActive
                  ? "bg-safepay-purple text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isDone ? <Check size={14} /> : stepNumber}
            </div>
            <span
              className={`text-sm ${
                isActive ? "text-safepay-purple font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {stepNumber !== steps.length && (
              <div className="w-6 h-px bg-gray-200 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
type RiskType =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | "INFO"
  | "REVIEW"
  | "HIGH RISK";

const styles: Record<RiskType, string> = {
  LOW: "bg-green-50 text-green-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-orange-50 text-orange-600",
  CRITICAL: "bg-red-50 text-red-600",
  INFO: "bg-blue-50 text-blue-600",
  REVIEW: "bg-yellow-50 text-yellow-700",
  "HIGH RISK": "bg-red-50 text-red-600",
};

export default function RiskBadge({ type }: { type: RiskType }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[type]}`}
    >
      {type}
    </span>
  );
}
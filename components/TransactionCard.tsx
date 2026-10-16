import RiskBadge from "./RiskBadge";
import type { Transaction } from "@/lib/sample-data";

export default function TransactionCard({ tx }: { tx: Transaction }) {
  const isReceived = tx.direction === "received";

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 text-safepay-purple text-sm font-semibold flex items-center justify-center">
          {tx.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{tx.name}</p>
            {tx.riskTag && <RiskBadge type={tx.riskTag} />}
          </div>
          <p className="text-xs text-gray-400">
            @{tx.upiId} · {tx.time}
          </p>
        </div>
      </div>

      <p
        className={`text-sm font-semibold ${
          isReceived ? "text-green-600" : "text-gray-900"
        }`}
      >
        {isReceived ? "+" : ""}₹{tx.amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
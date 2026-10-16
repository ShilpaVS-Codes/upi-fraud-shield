"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { currentUser } from "@/lib/sample-data";

export default function BalanceCard() {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl p-6 text-white shadow-lg shadow-purple-200">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-sm">Total Balance</p>
        <button onClick={() => setHidden(!hidden)}>
          {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p className="text-3xl font-bold mt-2">
        {hidden ? "₹••••••" : `₹${currentUser.totalBalance.toLocaleString("en-IN")}.00`}
      </p>

      <div className="flex items-center gap-1.5 mt-2 text-sm text-white/80">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        AI Shield Active · 0 threats today
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-white/15 rounded-2xl px-4 py-3">
          <p className="text-xs text-white/70">UPI ID</p>
          <p className="text-sm font-medium mt-0.5">{currentUser.upiId}</p>
        </div>
        <div className="bg-white/15 rounded-2xl px-4 py-3">
          <p className="text-xs text-white/70">This Month</p>
          <p className="text-sm font-medium mt-0.5">
            ₹{currentUser.monthSpent.toLocaleString("en-IN")} spent
          </p>
        </div>
      </div>
    </div>
  );
}
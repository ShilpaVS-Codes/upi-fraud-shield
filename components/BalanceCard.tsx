
"use client";

import { useCurrentUser } from "@/lib/use-current-user";

export default function BalanceCard() {
  const { user, loading, error } = useCurrentUser();

  return (
    <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl p-6 text-white shadow-lg shadow-purple-200">
      <div className="flex items-center justify-between">
        <p className="text-white/80 text-sm">
          Bank Balance
        </p>

        <span className="text-xs bg-white/15 px-3 py-1 rounded-full">
          Demo Account
        </span>
      </div>

      <p className="text-3xl font-bold mt-2">
        Not linked
      </p>

      <p className="text-sm text-white/80 mt-2">
        SafePay does not access real bank balances.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-white/15 rounded-2xl px-4 py-3 min-w-0">
          <p className="text-xs text-white/70">
            UPI ID
          </p>

          <p className="text-sm font-medium mt-0.5 break-all">
            {loading
              ? "Loading..."
              : error
                ? "Unavailable"
                : user?.upiId ?? "Not available"}
          </p>
        </div>

        <div className="bg-white/15 rounded-2xl px-4 py-3">
          <p className="text-xs text-white/70">
            Account Status
          </p>

          <p className="text-sm font-medium mt-0.5">
            {loading
              ? "Checking..."
              : user
                ? "Demo Account Active"
                : "Unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

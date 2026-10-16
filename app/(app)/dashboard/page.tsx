import Link from "next/link";
import { Send, QrCode, History, AlertTriangle } from "lucide-react";
import TopBar from "@/components/TopBar";
import BalanceCard from "@/components/BalanceCard";
import QuickActionButton from "@/components/QuickActionButton";
import TransactionCard from "@/components/TransactionCard";
import { sampleTransactions, currentUser } from "@/lib/sample-data";

export default function DashboardPage() {
  const recentTransactions = sampleTransactions.slice(0, 5);
  const usedPercent = Math.round(
    (currentUser.monthSpent / currentUser.monthlyLimit) * 100
  );

  return (
    <div>
      <TopBar title="Dashboard" />

      <BalanceCard />

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <QuickActionButton
          href="/send-money"
          label="Send Money"
          icon={Send}
          color="bg-purple-100 text-safepay-purple"
        />
        <QuickActionButton
          href="/scan-pay"
          label="Scan & Pay"
          icon={QrCode}
          color="bg-green-100 text-green-600"
        />
        <QuickActionButton
          href="/transactions"
          label="History"
          icon={History}
          color="bg-blue-100 text-blue-600"
        />
        <QuickActionButton
          href="/fraud-alerts"
          label="Alerts"
          icon={AlertTriangle}
          color="bg-red-100 text-red-600"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Recent transactions */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
            <Link href="/transactions" className="text-sm text-safepay-purple font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

        {/* AI Fraud Shield panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">AI Fraud Shield</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-red-500">12</p>
                <p className="text-xs text-gray-400">Threats Blocked</p>
              </div>
              <div>
                <p className="text-lg font-bold text-safepay-purple">94</p>
                <p className="text-xs text-gray-400">Risk Score</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">847</p>
                <p className="text-xs text-gray-400">Safe Transactions</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-red-600">1 Active Alert</p>
              <Link href="/fraud-alerts" className="text-xs text-red-500 underline">
                Suspicious QR code detected. Tap to review
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Monthly Limit</p>
              <p className="text-xs text-gray-400">
                ₹{currentUser.monthSpent.toLocaleString("en-IN")} / ₹
                {currentUser.monthlyLimit.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-safepay-purple rounded-full"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{usedPercent}% of monthly limit used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
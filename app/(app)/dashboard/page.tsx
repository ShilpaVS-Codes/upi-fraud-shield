
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Send, QrCode, History, AlertTriangle } from "lucide-react";

import TopBar from "@/components/TopBar";
import BalanceCard from "@/components/BalanceCard";
import QuickActionButton from "@/components/QuickActionButton";
import TransactionCard from "@/components/TransactionCard";
import type { Transaction } from "@/lib/sample-data";

type ApiTransaction = {
  referenceId: string;
  receiverUpiId: string;
  amount: number;
  currency: string;
  transactionTime: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  decision: string;
};

function convertTransaction(tx: ApiTransaction): Transaction {
  const parsedDate = new Date(tx.transactionTime);

  const riskTag: Transaction["riskTag"] =
    tx.decision === "BLOCKED" || tx.riskLevel === "HIGH"
      ? "HIGH RISK"
      : tx.decision === "REVIEW" || tx.riskLevel === "MEDIUM"
        ? "REVIEW"
        : undefined;

  return {
    id: tx.referenceId,
    name: tx.receiverUpiId.split("@")[0] || "Recipient",
    upiId: tx.receiverUpiId,
    time: Number.isNaN(parsedDate.getTime())
      ? "Unknown date"
      : parsedDate.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    amount: Number(tx.amount),
    direction: "sent",
    category: "Transfer",
    riskTag,
  };
}

export default function DashboardPage() {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionError, setTransactionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiUrl) {
          throw new Error("Backend API URL is not configured.");
        }

        const [recentResponse, historyResponse] = await Promise.all([
          fetch(`${apiUrl}/api/demo/transactions/recent`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${apiUrl}/api/demo/transactions/history`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (!recentResponse.ok || !historyResponse.ok) {
          if (recentResponse.status === 401 || historyResponse.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error("Unable to load transaction data.");
        }

        const recentData: ApiTransaction[] = await recentResponse.json();
        const historyData: ApiTransaction[] = await historyResponse.json();

        if (!Array.isArray(recentData) || !Array.isArray(historyData)) {
          throw new Error("Invalid transaction response.");
        }

        if (!cancelled) {
          setRecentTransactions(recentData.slice(0, 5).map(convertTransaction));
          setHistory(historyData);
        }
      } catch (error) {
        if (!cancelled) {
          setTransactionError(
            error instanceof Error
              ? error.message
              : "Unable to load transactions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const approved = history.filter((tx) => tx.decision === "APPROVED");
  const underReview = history.filter((tx) => tx.decision === "REVIEW");
  const blocked = history.filter((tx) => tx.decision === "BLOCKED");

  const now = new Date();
  const monthlyApproved = approved
    .filter((tx) => {
      const date = new Date(tx.transactionTime);
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div>
      <TopBar title="Dashboard" />

      <BalanceCard />

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
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <Link
              href="/transactions"
              className="text-sm text-safepay-purple font-medium"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="py-6 text-sm text-gray-500">
              Loading transactions...
            </p>
          ) : transactionError ? (
            <p role="alert" className="py-6 text-sm text-red-600">
              {transactionError}
            </p>
          ) : recentTransactions.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">
              No transactions yet. Your demo payments will appear here.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <TransactionCard key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-1">
              Fraud Shield
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Recorded demo transaction results
            </p>

            {loading ? (
              <p className="text-sm text-gray-500">Loading statistics...</p>
            ) : transactionError ? (
              <p className="text-sm text-red-600">
                Statistics unavailable
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-red-500">
                    {blocked.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Blocked
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-safepay-purple">
                    {underReview.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Under Review
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {approved.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Approved
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-red-600">
                Fraud Analysis
              </p>
              <Link
                href="/fraud-alerts"
                className="text-xs text-red-500 underline"
              >
                View recorded fraud alerts
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm font-medium text-gray-900 mb-2">
              This Month&apos;s Approved Demo Payments
            </p>
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : transactionError ? (
              <p className="text-sm text-red-600">
                Amount unavailable
              </p>
            ) : (
              <>
                <p className="text-xl font-bold text-safepay-purple">
                  {"\u20B9"}{monthlyApproved.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Approved simulated payments only. No real money transferred.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

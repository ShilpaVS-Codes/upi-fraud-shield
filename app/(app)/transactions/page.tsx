
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import TopBar from "@/components/TopBar";
import TransactionCard from "@/components/TransactionCard";
import type { Transaction } from "@/lib/sample-data";

type Tab = "All" | "Sent" | "Received" | "Flagged" | "Blocked";

const tabs: Tab[] = [
  "All",
  "Sent",
  "Received",
  "Flagged",
  "Blocked",
];

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

type HistoryTransaction = Transaction & {
  decision: string;
  riskLevel: string;
};

function convertTransaction(
  tx: ApiTransaction
): HistoryTransaction {
  const date = new Date(tx.transactionTime);

  const riskTag: Transaction["riskTag"] =
    tx.decision === "BLOCKED" || tx.riskLevel === "HIGH"
      ? "HIGH RISK"
      : tx.riskLevel === "MEDIUM" ||
          tx.decision === "REVIEW"
        ? "REVIEW"
        : undefined;

  return {
    id: tx.referenceId,
    name: tx.receiverUpiId.split("@")[0] || "Recipient",
    upiId: tx.receiverUpiId,
    time: Number.isNaN(date.getTime())
      ? "Unknown date"
      : date.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    amount: Number(tx.amount),
    direction: "sent",
    category: "Transfer",
    riskTag,
    decision: tx.decision,
    riskLevel: tx.riskLevel,
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<
    HistoryTransaction[]
  >([]);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiUrl) {
          throw new Error("Backend API URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl}/api/demo/transactions/history`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Session expired. Please log in again."
            );
          }

          throw new Error(
            "Unable to load transaction history."
          );
        }

        const data: ApiTransaction[] =
          await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid transaction response.");
        }

        if (!cancelled) {
          setTransactions(data.map(convertTransaction));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    "All Categories",
    ...Array.from(
      new Set(transactions.map((tx) => tx.category))
    ),
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Sent"
          ? tx.direction === "sent"
          : activeTab === "Received"
            ? tx.direction === "received"
            : activeTab === "Flagged"
              ? tx.riskTag !== undefined &&
                tx.decision !== "BLOCKED"
              : tx.decision === "BLOCKED";

    const matchesSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.upiId.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      tx.category === category;

    return matchesTab && matchesSearch && matchesCategory;
  });

  // Only approved demo transactions count as sent.
  const totalSent = transactions
    .filter((tx) => tx.decision === "APPROVED")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const flaggedCount = transactions.filter(
    (tx) =>
      tx.riskTag !== undefined &&
      tx.decision !== "BLOCKED"
  ).length;

  const blockedCount = transactions.filter(
    (tx) => tx.decision === "BLOCKED"
  ).length;

  return (
    <div>
      <TopBar title="Transaction History" />

      {/* Real transaction summary */}
      <div className="bg-white rounded-2xl shadow-sm grid grid-cols-3 divide-x divide-gray-100 mb-6">
        <div className="p-4">
          <p className="text-lg font-bold text-gray-900">
            ₹{totalSent.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400">
            Approved Demo Payments
          </p>
        </div>

        <div className="p-4">
          <p className="text-lg font-bold text-gray-900">
            {flaggedCount}
          </p>
          <p className="text-xs text-gray-400">
            Flagged Transactions
          </p>
        </div>

        <div className="p-4">
          <p className="text-lg font-bold text-red-500">
            {blockedCount}
          </p>
          <p className="text-xs text-gray-400">
            Blocked Transactions
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? "bg-safepay-purple text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and category filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 py-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white rounded-2xl shadow-sm px-4 py-3 text-sm text-gray-700 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction list */}
      <div className="bg-white rounded-2xl shadow-sm px-4 divide-y divide-gray-100">
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-8">
            Loading transaction history...
          </p>
        ) : error ? (
          <p
            role="alert"
            className="text-center text-sm text-red-600 py-8"
          >
            {error}
          </p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            {activeTab === "Received"
              ? "Incoming demo payments are not supported yet."
              : "No transactions found."}
          </p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id}>
              <TransactionCard tx={tx} />
              {tx.decision === "BLOCKED" && (
                <p className="text-xs text-red-600 pb-2 pl-12">
                  Blocked by fraud detection — no payment executed
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        SafePay records simulated transactions only.
        No real money is transferred.
      </p>
    </div>
  );
}

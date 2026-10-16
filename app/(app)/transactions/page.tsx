"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import TopBar from "@/components/TopBar";
import TransactionCard from "@/components/TransactionCard";
import { sampleTransactions } from "@/lib/sample-data";

type Tab = "All" | "Sent" | "Received" | "Flagged" | "Blocked";

const tabs: Tab[] = ["All", "Sent", "Received", "Flagged", "Blocked"];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  // Build the category dropdown options from the sample data itself
  const categories = [
    "All Categories",
    ...Array.from(new Set(sampleTransactions.map((tx) => tx.category))),
  ];

  const filteredTransactions = sampleTransactions.filter((tx) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Sent"
        ? tx.direction === "sent"
        : activeTab === "Received"
        ? tx.direction === "received"
        : activeTab === "Flagged"
        ? tx.riskTag === "REVIEW"
        : tx.riskTag === "HIGH RISK"; // Blocked

    const matchesSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.upiId.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || tx.category === category;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const flaggedCount = sampleTransactions.filter((tx) => tx.riskTag).length;

  return (
    <div>
      <TopBar title="Transaction History" />

      {/* Summary stats — demo values matching the design, same pattern as
          the Dashboard's AI Fraud Shield stats panel */}
      <div className="bg-white rounded-2xl shadow-sm grid grid-cols-3 divide-x divide-gray-100 mb-6">
        <div className="p-4">
          <p className="text-lg font-bold text-gray-900">₹5,804</p>
          <p className="text-xs text-gray-400">Total Sent</p>
          <p className="text-xs text-red-500 mt-1">-12.4% vs last month</p>
        </div>
        <div className="p-4">
          <p className="text-lg font-bold text-gray-900">₹68,000</p>
          <p className="text-xs text-gray-400">Total Received</p>
          <p className="text-xs text-green-600 mt-1">+34% vs last month</p>
        </div>
        <div className="p-4">
          <p className="text-lg font-bold text-red-500">{flaggedCount}</p>
          <p className="text-xs text-gray-400">Flagged Txns</p>
          <p className="text-xs text-gray-400 mt-1">needs review</p>
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

      {/* Search + category filter */}
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
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">
            No transactions found
          </p>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))
        )}
      </div>
    </div>
  );
}
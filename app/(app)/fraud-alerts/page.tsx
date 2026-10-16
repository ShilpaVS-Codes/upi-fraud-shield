"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Ban,
  ChevronDown,
  ChevronRight,
  FileWarning,
  Headset,
  Info,
  Lock,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import RiskBadge from "@/components/RiskBadge";
import {
  sampleAlerts,
  currentUser,
  monthlyRisks,
  initialUnreadAlertIds,
  type FraudAlert,
} from "@/lib/sample-data";

type Severity = FraudAlert["severity"];
type FilterTab = "All" | Severity;
type Notice = { type: "success" | "info"; text: string } | null;

const filterTabs: FilterTab[] = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

// Icon + color per severity, kept consistent with RiskBadge's own colors
const severityStyles: Record<Severity, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  CRITICAL: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  HIGH: { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
  MEDIUM: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
  LOW: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  INFO: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
};

// Bar and number colors for "This Month's Risks" (matched by the id in sample-data)
const riskStyles: Record<string, { bar: string; text: string }> = {
  phishing: { bar: "bg-red-500", text: "text-red-500" },
  qr: { bar: "bg-orange-500", text: "text-orange-500" },
  logins: { bar: "bg-blue-500", text: "text-blue-500" },
  blocked: { bar: "bg-safepay-purple", text: "text-safepay-purple" },
};
const defaultRiskStyle = { bar: "bg-gray-400", text: "text-gray-500" };

// Security Actions list. Every action is demo-only for now.
const securityActions = [
  {
    label: "Change UPI PIN",
    icon: Lock,
    color: "text-orange-500",
    message: "Demo only: changing the UPI PIN will work once the backend is connected.",
  },
  {
    label: "Block Card Temporarily",
    icon: Ban,
    color: "text-red-500",
    message: "Demo only: no card was blocked.",
  },
  {
    label: "Report Fraud",
    icon: FileWarning,
    color: "text-red-500",
    message: "Demo only: no fraud report was filed.",
  },
  {
    label: "Contact Support",
    icon: Headset,
    color: "text-blue-500",
    message: "Demo only: support is not connected in this prototype.",
  },
];

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  return "At risk";
}

export default function FraudAlertsPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>(sampleAlerts);
  const [unreadIds, setUnreadIds] = useState<string[]>(initialUnreadAlertIds);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesTab = activeTab === "All" || alert.severity === activeTab;
    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Only count unread alerts that are still on the list
  const unreadCount = alerts.filter((alert) => unreadIds.includes(alert.id)).length;

  const score = currentUser.trustScore;
  const maxRiskCount = Math.max(...monthlyRisks.map((risk) => risk.count));

  const showDemoNotice = (text: string) => {
    setNotice({ type: "info", text });
  };

  const handleToggle = (id: string) => {
    const isOpening = expandedId !== id;
    setExpandedId(isOpening ? id : null);
    if (isOpening) {
      // Opening an alert marks it as read
      setUnreadIds(unreadIds.filter((unreadId) => unreadId !== id));
    }
  };

  const handleMarkAllRead = () => {
    setUnreadIds([]);
    setNotice({ type: "success", text: "All alerts marked as read." });
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    setExpandedId(null);
  };

  return (
    <div>
      <TopBar title="Fraud Alerts" />

      {/* Feedback message (sticky so it stays visible while scrolling) */}
      {notice && (
        <div
          className={`sticky top-2 z-30 flex items-start justify-between gap-3 rounded-2xl px-4 py-3 mb-6 text-sm shadow-sm ${
            notice.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      <p className="bg-purple-50 text-safepay-purple text-xs rounded-2xl px-4 py-3 mb-6">
        Demo data: the alerts, scores and counts on this page are samples. The
        buttons do not contact any bank or change any real account.
      </p>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        {/* LEFT: alerts */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-sm text-gray-500">
              AI-powered threat intelligence · Real-time monitoring
            </p>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={`text-sm font-medium whitespace-nowrap ${
                unreadCount === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-safepay-purple"
              }`}
            >
              Mark all read ({unreadCount})
            </button>
          </div>

          {/* Summary header */}
          <div className="bg-white rounded-2xl shadow-sm px-5 py-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
          </div>

          {/* Severity filter tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-safepay-purple text-white"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                {tab === "All" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 py-3 mb-6">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Alert list */}
          {alerts.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              subtitle="No active fraud alerts."
            />
          ) : filteredAlerts.length === 0 ? (
            <EmptyState
              title="No matching alerts"
              subtitle="Try a different search or filter."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {filteredAlerts.map((alert) => {
                const { icon: Icon, color, bg } = severityStyles[alert.severity];
                const isExpanded = expandedId === alert.id;
                const isUnread = unreadIds.includes(alert.id);

                return (
                  <div
                    key={alert.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => handleToggle(alert.id)}
                      className="w-full flex items-start gap-3 px-5 py-4 text-left"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={color} size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            {alert.title}
                            {isUnread && (
                              <span
                                className="w-2 h-2 rounded-full bg-safepay-purple shrink-0"
                                aria-label="Unread"
                              />
                            )}
                          </p>
                          <RiskBadge type={alert.severity} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                        {!isExpanded && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {alert.description}
                          </p>
                        )}
                      </div>

                      <ChevronDown
                        size={18}
                        className={`text-gray-400 shrink-0 mt-1 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-gray-600 mb-4">
                          {alert.description}
                        </p>

                        {alert.whatToDo && alert.whatToDo.length > 0 && (
                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-400 mb-2">
                              WHAT TO DO
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                              {alert.whatToDo.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Only the critical alert has these two buttons, as in the design */}
                        {alert.severity === "CRITICAL" && (
                          <div className="flex flex-col sm:flex-row gap-3 mb-3">
                            <button
                              onClick={() =>
                                showDemoNotice(
                                  "Demo only: your account was not changed. In the full system this step would be handled by the backend."
                                )
                              }
                              className="flex-1 py-3 rounded-2xl font-semibold text-white bg-red-500"
                            >
                              Secure Account Now
                            </button>
                            <button
                              onClick={() =>
                                showDemoNotice(
                                  "Demo only: no bank was contacted and no report was filed."
                                )
                              }
                              className="flex-1 py-3 rounded-2xl font-semibold text-gray-700 bg-white border border-gray-200"
                            >
                              Report to Bank
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: score, monthly risks, security actions */}
        <div className="flex flex-col gap-6">
          {/* AI Safety Score */}
          <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl p-5 text-white shadow-lg shadow-purple-200">
            <p className="text-sm text-white/80">AI Safety Score</p>
            <p className="text-5xl font-bold mt-2">{score}</p>
            <p className="text-xs text-white/80 mt-1">
              out of 100 · {getScoreLabel(score)}
            </p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* This Month's Risks */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">This Month&apos;s Risks</h2>
            <div className="space-y-4">
              {monthlyRisks.map((risk) => {
                const style = riskStyles[risk.id] ?? defaultRiskStyle;
                return (
                  <div key={risk.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{risk.label}</span>
                      <span className={`font-semibold ${style.text}`}>{risk.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${style.bar}`}
                        style={{ width: `${(risk.count / maxRiskCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Security Actions</h2>
            <div className="divide-y divide-gray-100">
              {securityActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => showDemoNotice(action.message)}
                    className="w-full flex items-center justify-between gap-3 py-3 text-left"
                  >
                    <span className="flex items-center gap-3 text-sm text-gray-700">
                      <Icon size={18} className={action.color} />
                      {action.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
        <ShieldCheck className="text-green-500" size={26} />
      </div>
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
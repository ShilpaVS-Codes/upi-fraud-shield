"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Lock,
  LogOut,
  Shield,
  X,
  type LucideIcon,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import SettingsToggle from "@/components/SettingsToggle";
import {
  defaultSettings,
  startingLimits,
  defaultNewLimits,
  dailyLimitOptions,
  perTransactionLimitOptions,
  type UserSettings,
  type Limits,
} from "@/lib/sample-data";

type Section = "security" | "notifications" | "privacy" | "limits";
type ToggleItem = { key: keyof UserSettings; label: string; description: string };
type Notice = { type: "success" | "info"; text: string } | null;

const sections: {
  id: Section;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    id: "security",
    label: "Security & Fraud Protection",
    subtitle: "Customize your security & fraud protection preferences",
    icon: Shield,
    color: "text-blue-500",
  },
  {
    id: "notifications",
    label: "Notifications",
    subtitle: "Customize your notifications preferences",
    icon: Bell,
    color: "text-yellow-500",
  },
  {
    id: "privacy",
    label: "Privacy",
    subtitle: "Customize your privacy preferences",
    icon: Lock,
    color: "text-orange-500",
  },
  {
    id: "limits",
    label: "Payment Limits",
    subtitle: "Customize your payment limits preferences",
    icon: CreditCard,
    color: "text-blue-600",
  },
];

const securityToggles: ToggleItem[] = [
  {
    key: "aiFraudShield",
    label: "AI Fraud Shield",
    description: "Real-time AI analysis on every transaction",
  },
  {
    key: "autoBlockHighRisk",
    label: "Auto-block High Risk",
    description: "Automatically block transactions flagged as high risk",
  },
  {
    key: "qrVerification",
    label: "QR Code Verification",
    description: "Verify merchant identity before each QR payment",
  },
  {
    key: "biometricAuth",
    label: "Biometric Auth",
    description: "Use fingerprint or face ID to confirm payments",
  },
];

const notificationToggles: ToggleItem[] = [
  {
    key: "fraudAlerts",
    label: "Fraud Alerts",
    description: "Instant push notifications for suspicious activity",
  },
  {
    key: "transactionAlerts",
    label: "Transaction Alerts",
    description: "Notify on every send and receive",
  },
  {
    key: "monthlySecurityReport",
    label: "Monthly Security Report",
    description: "Get a summary of your account security each month",
  },
  {
    key: "offersPromotions",
    label: "Offers & Promotions",
    description: "Cashback and reward notifications",
  },
];

const privacyToggles: ToggleItem[] = [
  {
    key: "hideBalance",
    label: "Hide Balance by Default",
    description: "Mask account balance on home screen",
  },
  {
    key: "incognitoPayments",
    label: "Incognito Payments",
    description: "Hide your name in recipient payment notes",
  },
  {
    key: "analyticsSharing",
    label: "Analytics Data Sharing",
    description: "Share anonymised data to improve fraud detection",
  },
];

const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("security");
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // "currentLimits" = limits in use, "newLimits" = what the dropdowns show
  const [currentLimits, setCurrentLimits] = useState<Limits>(startingLimits);
  const [newLimits, setNewLimits] = useState<Limits>(defaultNewLimits);
  const [limitError, setLimitError] = useState("");

  const [isBlocked, setIsBlocked] = useState(false);
  const [confirming, setConfirming] = useState<"block" | "reset" | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const activeInfo =
    sections.find((section) => section.id === activeSection) ?? sections[0];
  const ActiveIcon = activeInfo.icon;

  const limitsChanged =
    newLimits.daily !== currentLimits.daily ||
    newLimits.perTransaction !== currentLimits.perTransaction;

  const updateSetting = (key: keyof UserSettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveLimits = () => {
    if (newLimits.perTransaction > newLimits.daily) {
      setLimitError("Per transaction limit can't be higher than the daily limit.");
      return;
    }
    setLimitError("");
    setCurrentLimits(newLimits);
    setNotice({
      type: "success",
      text: `Limits updated: ${rupees(newLimits.daily)} per day, ${rupees(
        newLimits.perTransaction
      )} per transaction (demo only).`,
    });
  };

  const handleBlockClick = () => {
    if (isBlocked) {
      setIsBlocked(false);
      setNotice({ type: "info", text: "Demo only: account unblocked in this prototype." });
    } else {
      setConfirming("block");
    }
  };

  const handleConfirm = () => {
    if (confirming === "block") {
      setIsBlocked(true);
      setNotice({
        type: "info",
        text: "Demo only: account marked as paused in this prototype. No real UPI activity was affected.",
      });
    }
    if (confirming === "reset") {
      setSettings(defaultSettings);
      setCurrentLimits(startingLimits);
      setNewLimits(defaultNewLimits);
      setLimitError("");
      setNotice({ type: "success", text: "All settings restored to their defaults." });
    }
    setConfirming(null);
  };

  const renderToggles = (items: ToggleItem[]) => (
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <SettingsToggle
          key={item.key}
          label={item.label}
          description={item.description}
          enabled={settings[item.key]}
          onChange={(value) => updateSetting(item.key, value)}
        />
      ))}
    </div>
  );

  // Sign Out + version, shown under the menu on desktop and under the content on mobile
  const accountFooter = (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm font-medium text-red-500"
      >
        <LogOut size={16} />
        Sign Out
      </Link>
      <p className="text-xs text-gray-400 mt-3">SafePay v4.2.1 · Build 8472</p>
    </div>
  );

  return (
    <div>
      <TopBar title="Settings" />

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
        Prototype note: these settings only change this page while it is open.
        They do not affect real account security or other pages, and they reset
        when you refresh.
      </p>

      <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        {/* Section menu: vertical on desktop, scrolling pills on mobile */}
        <div className="md:w-60 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap text-left ${
                    isActive
                      ? "bg-purple-50 text-safepay-purple"
                      : "bg-white text-gray-600 md:bg-transparent hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} className={section.color} />
                  {section.label}
                </button>
              );
            })}
          </nav>
          <div className="hidden md:block">{accountFooter}</div>
        </div>

        {/* Active section */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <ActiveIcon className={activeInfo.color} size={22} />
              <div>
                <h2 className="font-semibold text-gray-900">{activeInfo.label}</h2>
                <p className="text-xs text-gray-400">{activeInfo.subtitle}</p>
              </div>
            </div>

            {/* SECURITY */}
            {activeSection === "security" && (
              <div>
                {renderToggles(securityToggles)}

                <div className="flex items-center justify-between gap-4 py-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Change UPI PIN</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Update your 6-digit payment PIN
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setNotice({
                        type: "info",
                        text: "Demo only: changing the PIN will work once the backend is connected.",
                      })
                    }
                    className="text-sm text-safepay-purple font-medium whitespace-nowrap"
                  >
                    Change →
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && renderToggles(notificationToggles)}

            {/* PRIVACY */}
            {activeSection === "privacy" && renderToggles(privacyToggles)}

            {/* PAYMENT LIMITS */}
            {activeSection === "limits" && (
              <div>
                <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Daily UPI Limit</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Current: {rupees(currentLimits.daily)}
                    </p>
                  </div>
                  <select
                    value={newLimits.daily}
                    onChange={(e) =>
                      setNewLimits({ ...newLimits, daily: Number(e.target.value) })
                    }
                    className="bg-purple-50 text-safepay-purple font-medium rounded-xl px-3 py-2 text-sm outline-none"
                  >
                    {dailyLimitOptions.map((option) => (
                      <option key={option} value={option}>
                        {rupees(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Per Transaction Limit
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Current: {rupees(currentLimits.perTransaction)}
                    </p>
                  </div>
                  <select
                    value={newLimits.perTransaction}
                    onChange={(e) =>
                      setNewLimits({
                        ...newLimits,
                        perTransaction: Number(e.target.value),
                      })
                    }
                    className="bg-purple-50 text-safepay-purple font-medium rounded-xl px-3 py-2 text-sm outline-none"
                  >
                    {perTransactionLimitOptions.map((option) => (
                      <option key={option} value={option}>
                        {rupees(option)}
                      </option>
                    ))}
                  </select>
                </div>

                {limitError && (
                  <p className="text-xs text-red-500 mb-3">{limitError}</p>
                )}

                <button
                  onClick={handleSaveLimits}
                  disabled={!limitsChanged}
                  className={`w-full py-3 rounded-2xl font-semibold text-white ${
                    limitsChanged
                      ? "bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
                      : "bg-purple-200 cursor-not-allowed"
                  }`}
                >
                  Update Limits
                </button>
              </div>
            )}
          </div>

          {/* DANGER ZONE (Security section only, as in the design) */}
          {activeSection === "security" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mt-6">
              <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>

              <div className="flex items-center justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-medium text-red-600">
                    Temporarily Block Account
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">
                    {isBlocked
                      ? "UPI transactions are paused for 24 hours (demo)"
                      : "Pause all UPI transactions for 24 hours"}
                  </p>
                </div>
                <button
                  onClick={handleBlockClick}
                  className="px-4 py-1.5 rounded-full border border-red-200 bg-white text-xs font-semibold text-red-600"
                >
                  {isBlocked ? "Unblock" : "Block"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-medium text-red-600">Reset All Settings</p>
                  <p className="text-xs text-red-500 mt-0.5">
                    Restore factory defaults for all preferences
                  </p>
                </div>
                <button
                  onClick={() => setConfirming("reset")}
                  className="px-4 py-1.5 rounded-full border border-red-200 bg-white text-xs font-semibold text-red-600"
                >
                  Reset
                </button>
              </div>

              {confirming && (
                <div className="bg-white rounded-xl p-4 mt-3">
                  <p className="text-sm text-gray-700 mb-3">
                    {confirming === "block"
                      ? "Pause all UPI transactions for 24 hours? (Demo only: nothing is actually blocked.)"
                      : "Restore all preferences and limits to their defaults?"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirming(null)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-red-500"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="md:hidden">{accountFooter}</div>
        </div>
      </div>
    </div>
  );
}
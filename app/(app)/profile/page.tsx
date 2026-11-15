
"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Circle,
  FileText,
  Gift,
  Pencil,
  Plus,
  Scale,
  Trash2,
  X,
} from "lucide-react";

import TopBar from "@/components/TopBar";
import { useCurrentUser } from "@/lib/use-current-user";

type Notice = {
  type: "info";
  text: string;
} | null;

const kycSteps = [
  { id: "aadhaar", label: "Aadhaar Verification" },
  { id: "pan", label: "PAN Card Linked" },
  { id: "face", label: "Face Verification" },
  { id: "video", label: "Video KYC" },
];

const accountActions = [
  {
    label: "Download Statement",
    icon: FileText,
    style: "bg-purple-50 text-safepay-purple",
    message:
      "Demo only: statement downloads are not available yet.",
  },
  {
    label: "Referral Code",
    icon: Gift,
    style: "bg-pink-50 text-pink-500",
    message:
      "Demo only: referral codes are not available yet.",
  },
  {
    label: "Raise Dispute",
    icon: Scale,
    style: "bg-yellow-50 text-yellow-600",
    message:
      "Demo only: dispute management is not available yet.",
  },
  {
    label: "Delete Account",
    icon: Trash2,
    style: "bg-red-50 text-red-500",
    message:
      "Demo only: account deletion is disabled. Nothing was deleted.",
  },
];

export default function ProfilePage() {
  const { user, loading, error } = useCurrentUser();
  const [notice, setNotice] = useState<Notice>(null);

  const showDemoNotice = (text: string) => {
    setNotice({ type: "info", text });
  };

  if (loading) {
    return (
      <div>
        <TopBar title="My Profile" />
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <TopBar title="My Profile" />
        <div className="bg-red-50 rounded-2xl p-6">
          <p className="text-red-600">
            {error || "Unable to load your account."}
          </p>
        </div>
      </div>
    );
  }

  const initials =
    user.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("") || "?";

  return (
    <div>
      <TopBar title="My Profile" />

      {/* Information notice */}
      {notice && (
        <div className="sticky top-2 z-30 flex items-start justify-between gap-3 rounded-2xl px-4 py-3 mb-6 text-sm shadow-sm bg-blue-50 text-blue-700">
          <span>{notice.text}</span>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl p-6 text-white shadow-lg shadow-purple-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">
              {user.fullName}
            </h2>

            <p className="text-sm text-white/80 break-all">
              {user.upiId}
            </p>

            <p className="flex items-center gap-1 text-xs text-white/80 mt-1">
              <BadgeCheck size={14} />
              SafePay Demo Account - KYC Not Verified
            </p>
          </div>
        </div>

        {/* Account summary */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">
              Not configured
            </p>
            <p className="text-xs text-white/70">
              UPI Limit
            </p>
          </div>

          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">
              Demo User
            </p>
            <p className="text-xs text-white/70">
              Account Type
            </p>
          </div>

          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">
              Not calculated
            </p>
            <p className="text-xs text-white/70">
              Trust Score
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal information */}
        <div className="bg-white rounded-2xl shadow-sm p-5 self-start">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Personal Info
            </h2>

            <button
              type="button"
              onClick={() =>
                showDemoNotice(
                  "Profile editing is not available yet. Your account details are stored in PostgreSQL."
                )
              }
              className="flex items-center gap-1 text-sm text-safepay-purple font-medium"
            >
              <Pencil size={14} />
              Edit (Demo Only)
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            <ReadOnlyRow
              label="Full Name"
              value={user.fullName}
            />

            <ReadOnlyRow
              label="Mobile"
              value={user.mobile}
            />

            <ReadOnlyRow
              label="Email"
              value={user.email || "Not provided"}
            />

            <ReadOnlyRow
              label="Date of Birth"
              value="Not provided"
            />

            <ReadOnlyRow
              label="Gender"
              value="Not provided"
            />

            <ReadOnlyRow
              label="City"
              value={user.city}
            />

            <ReadOnlyRow
              label="UPI ID"
              value={user.upiId}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* KYC status */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">
                KYC Status
              </h2>

              <span className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                0%
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: "0%" }}
              />
            </div>

            <p className="text-xs text-gray-400 mb-4">
              KYC verification is not implemented in this
              academic demo.
            </p>

            <div className="space-y-3">
              {kycSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Circle
                      size={20}
                      className="text-gray-300 shrink-0"
                    />

                    <span className="text-sm text-gray-400">
                      {step.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showDemoNotice(
                        `${step.label} is not available in this demo.`
                      )
                    }
                    className="text-xs text-safepay-purple font-medium"
                  >
                    Complete →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Linked accounts */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                Linked Accounts
              </h2>

              <button
                type="button"
                onClick={() =>
                  showDemoNotice(
                    "Demo only: bank account linking is not available."
                  )
                }
                className="flex items-center gap-1 text-sm text-safepay-purple font-medium"
              >
                <Plus size={14} />
                Add Bank
              </button>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-center">
              <p className="text-sm font-medium text-gray-700">
                No bank accounts linked
              </p>

              <p className="text-xs text-gray-400 mt-1">
                This prototype does not connect to real
                banks or UPI networks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Account Actions (Demo Only)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accountActions.map(
            ({ label, icon: Icon, style, message }) => (
              <button
                type="button"
                key={label}
                onClick={() => showDemoNotice(message)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-4 hover:bg-gray-50"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${style}`}
                >
                  <Icon size={18} />
                </span>

                <span
                  className={`text-xs font-medium ${
                    label === "Delete Account"
                      ? "text-red-500"
                      : "text-gray-700"
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable profile information row
function ReadOnlyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}

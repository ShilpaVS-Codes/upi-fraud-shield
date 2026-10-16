"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Check,
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
import { currentUser, kycSteps, linkedAccounts } from "@/lib/sample-data";

// The three fields the user is allowed to edit
type ProfileForm = {
  name: string;
  email: string;
  city: string;
};
type Field = keyof ProfileForm;
type FormErrors = Partial<Record<Field, string>>;
type Notice = { type: "success" | "info"; text: string } | null;

export default function ProfilePage() {
  // "profile" = saved values, "draft" = what the user is typing while editing
  const [profile, setProfile] = useState<ProfileForm>({
    name: currentUser.name,
    email: currentUser.email,
    city: currentUser.city,
  });
  const [draft, setDraft] = useState<ProfileForm>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState<Notice>(null);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const doneSteps = kycSteps.filter((step) => step.done).length;
  const kycPercent = Math.round((doneSteps / kycSteps.length) * 100);

  const startEditing = () => {
    setDraft(profile);
    setErrors({});
    setNotice(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (field: Field, value: string) => {
    setDraft({ ...draft, [field]: value });
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (draft.name.trim().length < 2) {
      newErrors.name = "Enter your full name (at least 2 characters).";
    }
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!draft.city.trim()) {
      newErrors.city = "Enter your city.";
    }
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setProfile({
      name: draft.name.trim(),
      email: draft.email.trim(),
      city: draft.city.trim(),
    });
    setErrors({});
    setIsEditing(false);
    setNotice({ type: "success", text: "Profile updated successfully." });
  };

  // Used by buttons that are only UI for now (no real feature behind them)
  const showDemoNotice = (text: string) => {
    setNotice({ type: "info", text });
  };

  const accountActions = [
    {
      label: "Download Statement",
      icon: FileText,
      style: "bg-purple-50 text-safepay-purple",
      message: "Demo only: statement download will work once the backend is connected.",
    },
    {
      label: "Referral Code",
      icon: Gift,
      style: "bg-pink-50 text-pink-500",
      message: "Demo only: referral codes will be available once the backend is connected.",
    },
    {
      label: "Raise Dispute",
      icon: Scale,
      style: "bg-yellow-50 text-yellow-600",
      message: "Demo only: disputes will be available once the backend is connected.",
    },
    {
      label: "Delete Account",
      icon: Trash2,
      style: "bg-red-50 text-red-500",
      message: "Demo only: account deletion is disabled in this prototype. Nothing was deleted.",
    },
  ];

  return (
    <div>
      <TopBar title="My Profile" />

      {/* Success / info message (sticky so it stays visible while scrolling) */}
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

      {/* Header card */}
      <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl p-6 text-white shadow-lg shadow-purple-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">{profile.name}</h2>
            <p className="text-sm text-white/80">{currentUser.upiId}</p>
            <p className="flex items-center gap-1 text-xs text-white/80 mt-1">
              <BadgeCheck size={14} />
              Verified · Full KYC · Premium Member
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">{currentUser.upiLimit}</p>
            <p className="text-xs text-white/70">UPI Limit</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">{currentUser.memberSince}</p>
            <p className="text-xs text-white/70">Member Since</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-3 py-3 text-center">
            <p className="text-sm sm:text-base font-semibold">{currentUser.trustScore}/100</p>
            <p className="text-xs text-white/70">Trust Score</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm p-5 self-start">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Personal Info</h2>
            {!isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1 text-sm text-safepay-purple font-medium"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <EditableField
                label="Full Name"
                value={draft.name}
                error={errors.name}
                onChange={(value) => handleChange("name", value)}
              />
              <ReadOnlyRow label="Mobile" value={currentUser.mobile} />
              <EditableField
                label="Email"
                type="email"
                value={draft.email}
                error={errors.email}
                onChange={(value) => handleChange("email", value)}
              />
              <ReadOnlyRow label="Date of Birth" value={currentUser.dob} />
              <ReadOnlyRow label="Gender" value={currentUser.gender} />
              <EditableField
                label="City"
                value={draft.city}
                error={errors.city}
                onChange={(value) => handleChange("city", value)}
              />

              <p className="text-xs text-gray-400">
                Mobile, date of birth and gender can&apos;t be changed here.
              </p>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={cancelEditing}
                  className="flex-1 py-3 rounded-2xl font-semibold text-gray-700 border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <ReadOnlyRow label="Full Name" value={profile.name} />
              <ReadOnlyRow label="Mobile" value={currentUser.mobile} />
              <ReadOnlyRow label="Email" value={profile.email} />
              <ReadOnlyRow label="Date of Birth" value={currentUser.dob} />
              <ReadOnlyRow label="Gender" value={currentUser.gender} />
              <ReadOnlyRow label="City" value={profile.city} />
            </div>
          )}
        </div>

        {/* Right column: KYC + Linked Accounts */}
        <div className="flex flex-col gap-6">
          {/* KYC Status */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">KYC Status</h2>
              <span className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                {kycPercent}%
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${kycPercent}%` }}
              />
            </div>

            <div className="space-y-3">
              {kycSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.done ? (
                      <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Check size={12} />
                      </span>
                    ) : (
                      <Circle size={20} className="text-gray-300" />
                    )}
                    <span
                      className={`text-sm ${
                        step.done ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!step.done && (
                    <button
                      onClick={() =>
                        showDemoNotice("Demo only: Video KYC will be available once the backend is connected.")
                      }
                      className="text-xs text-safepay-purple font-medium"
                    >
                      Complete →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Linked Accounts</h2>
              <button
                onClick={() =>
                  showDemoNotice("Demo only: adding a bank will work once the backend is connected.")
                }
                className="flex items-center gap-1 text-sm text-safepay-purple font-medium"
              >
                <Plus size={14} />
                Add Bank
              </button>
            </div>

            <div className="space-y-3">
              {linkedAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 border ${
                    account.isPrimary
                      ? "border-safepay-purple"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-safepay-purple-dark text-white text-sm font-semibold flex items-center justify-center">
                      {account.bankName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {account.bankName}
                        </p>
                        {account.isPrimary && (
                          <span className="text-[10px] font-semibold bg-safepay-purple text-white px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        ****{account.accountEnding} · {account.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{account.balance.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">Account Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accountActions.map(({ label, icon: Icon, style, message }) => (
            <button
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
                  label === "Delete Account" ? "text-red-500" : "text-gray-700"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Plain label + value row (used in view mode, and for locked fields in edit mode)
function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}

// Label + input + error message (used only in edit mode)
function EditableField({
  label,
  value,
  error,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl px-4 py-3 text-sm text-gray-900 outline-none border ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-safepay-purple"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
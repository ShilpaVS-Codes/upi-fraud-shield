"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import {
  DEMO_USER_MOBILE,
  DEMO_USER_PIN,
  digitsOnly,
  formatMobile,
  isValidMobile,
} from "@/lib/demo-auth";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number (it should start with 6, 7, 8 or 9).");
      return;
    }
    // The number is passed to the PIN page in the URL
    router.push(`/pin?mobile=${mobile}`);
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="text-safepay-purple text-sm mt-1">
        Enter your mobile number to continue
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleContinue();
        }}
      >
        <label className="block text-sm font-medium text-gray-900 mt-8 mb-2">
          Mobile Number
        </label>
        <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
          <span className="text-safepay-purple font-semibold">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(digitsOnly(e.target.value, 10));
              setError("");
            }}
            placeholder="98765 43210"
            className="flex-1 outline-none text-gray-900 text-lg tracking-wide placeholder:text-gray-300"
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={mobile.length !== 10}
          className={`w-full mt-8 py-4 rounded-2xl font-semibold text-white transition ${
            mobile.length === 10
              ? "bg-gradient-to-r from-safepay-purple to-safepay-purple-dark shadow-lg shadow-purple-300"
              : "bg-purple-200 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        New to SafePay?{" "}
        <Link href="/register" className="text-safepay-purple font-medium">
          Create an account
        </Link>
      </p>

      <p className="text-center text-sm text-safepay-purple mt-6">or sign in with</p>

      {/* Google sign-in is shown as in the design, but disabled in this demo */}
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="w-full mt-4 py-3 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 font-medium text-gray-400 cursor-not-allowed"
      >
        <span className="text-lg font-bold text-blue-400">G</span>
        Continue with Google
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">
        Unavailable in this demo. Real sign-in will be added in the backend phase.
      </p>

      <div className="bg-purple-50 rounded-xl px-4 py-3 mt-6 text-xs text-gray-600">
        <p className="font-semibold text-safepay-purple mb-1">Demo login (fictional)</p>
        <p>
          Mobile: {formatMobile(DEMO_USER_MOBILE)} · PIN: {DEMO_USER_PIN}
        </p>
      </div>
    </AuthLayout>
  );
}
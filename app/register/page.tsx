"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Info } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import {
  digitsOnly,
  formatMobile,
  isValidMobile,
  isValidPin,
  registerAccount,
} from "@/lib/demo-auth";

export default function RegisterPage() {
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [createdMobile, setCreatedMobile] = useState<string | null>(null);

  const handleCreate = () => {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number (it should start with 6, 7, 8 or 9).");
      return;
    }
    if (!isValidPin(pin)) {
      setError("Your demo PIN must be exactly 6 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setError("The two PINs do not match. Please enter the same PIN in both boxes.");
      return;
    }
    if (!registerAccount(mobile, pin)) {
      setError("This number already has a demo account. Please log in instead.");
      return;
    }
    setError("");
    setCreatedMobile(mobile);
  };

  // Success screen
  if (createdMobile) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Demo account created</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your demo SafePay account for {formatMobile(createdMobile)} is ready.
            Now log in with the PIN you just created.
          </p>
          <Link
            href={`/pin?mobile=${createdMobile}`}
            className="block w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
          >
            Continue to Log In
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Demo only: this account exists in this browser tab only.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Link href="/login" className="flex items-center gap-1 text-gray-500 text-sm">
        <ChevronLeft size={18} />
        Back to login
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">Create your account</h2>
      <p className="text-safepay-purple text-sm mt-1">
        Set up a demo SafePay account
      </p>

      <div className="flex items-start gap-2 bg-purple-50 text-gray-600 text-xs rounded-xl px-4 py-3 mt-5">
        <Info size={16} className="text-safepay-purple shrink-0 mt-0.5" />
        <p>
          This is a demo account. Create a made-up 6-digit SafePay PIN. It is
          not a bank or UPI PIN, so never enter your real one.
        </p>
      </div>

      <form
        className="space-y-4 mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <AuthInput
          label="Mobile number"
          placeholder="98765 43210"
          maxLength={10}
          value={mobile}
          onChange={(value) => {
            setMobile(digitsOnly(value, 10));
            setError("");
          }}
        />
        <AuthInput
          label="Create demo PIN (6 digits)"
          secret
          maxLength={6}
          value={pin}
          onChange={(value) => {
            setPin(digitsOnly(value, 6));
            setError("");
          }}
        />
        <AuthInput
          label="Confirm demo PIN"
          secret
          maxLength={6}
          value={confirmPin}
          onChange={(value) => {
            setConfirmPin(digitsOnly(value, 6));
            setError("");
          }}
        />

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
        >
          Create Demo Account
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have a demo account?{" "}
        <Link href="/login" className="text-safepay-purple font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
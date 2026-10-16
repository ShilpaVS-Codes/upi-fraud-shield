"use client";

import { use, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, TriangleAlert } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import {
  accountExists,
  digitsOnly,
  formatMobile,
  isValidMobile,
  isValidPin,
  resetPin,
} from "@/lib/demo-auth";

type Step = "mobile" | "verify" | "done";

const primaryButton =
  "w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark";

export default function ResetPinPage({
  searchParams,
}: {
  searchParams: Promise<{ mobile?: string }>;
}) {
  // The PIN page passes the number along, so we can pre-fill it
  const params = use(searchParams);
  const startMobile =
    typeof params.mobile === "string" ? digitsOnly(params.mobile, 10) : "";

  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState(startMobile);
  const [demoCode, setDemoCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = () => {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!accountExists(mobile)) {
      setError("No demo account found for this number. You can create one instead.");
      return;
    }
    // A random code made by the browser itself. No SMS is sent.
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setError("");
    setStep("verify");
  };

  const handleReset = () => {
    if (codeInput !== demoCode) {
      setError("That code does not match the demo code shown above.");
      return;
    }
    if (!isValidPin(newPin)) {
      setError("Your new demo PIN must be exactly 6 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("The two PINs do not match. Please enter the same PIN in both boxes.");
      return;
    }
    resetPin(mobile, newPin);
    setError("");
    setStep("done");
  };

  return (
    <AuthLayout>
      {/* STEP 3: DONE */}
      {step === "done" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Demo PIN updated</h2>
          <p className="text-sm text-gray-500 mt-2">
            The demo PIN for {formatMobile(mobile)} was changed for this browser
            tab only. Secure account recovery will be built in the backend phase.
          </p>
          <Link
            href={`/pin?mobile=${mobile}`}
            className={`block mt-6 ${primaryButton}`}
          >
            Continue to Log In
          </Link>
        </div>
      )}

      {/* STEP 1: MOBILE NUMBER */}
      {step === "mobile" && (
        <div>
          <Link
            href="/login"
            className="flex items-center gap-1 text-gray-500 text-sm"
          >
            <ChevronLeft size={18} />
            Back to login
          </Link>

          <h2 className="text-2xl font-bold text-gray-900 mt-6">Reset demo PIN</h2>
          <p className="text-sm text-gray-500 mt-1">
            Demo only: no SMS is sent. A simulated code will be shown on screen
            instead.
          </p>

          <form
            className="space-y-4 mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCode();
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
            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className={primaryButton}>
              Show Demo Code
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            New to SafePay?{" "}
            <Link href="/register" className="text-safepay-purple font-medium">
              Create an account
            </Link>
          </p>
        </div>
      )}

      {/* STEP 2: DEMO CODE + NEW PIN */}
      {step === "verify" && (
        <div>
          <button
            onClick={() => {
              setStep("mobile");
              setError("");
            }}
            className="flex items-center gap-1 text-gray-500 text-sm"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mt-6">Reset demo PIN</h2>

          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mt-4">
            <p className="flex items-center gap-1 text-xs font-semibold text-yellow-700">
              <TriangleAlert size={14} />
              DEMO ONLY: simulated code
            </p>
            <p className="text-2xl font-mono font-bold tracking-widest text-gray-900 mt-1">
              {demoCode}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              No SMS was sent. This code was generated by your browser for the
              demonstration, and entering it does not verify who you are.
            </p>
          </div>

          <form
            className="space-y-4 mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleReset();
            }}
          >
            <AuthInput
              label="Enter the demo code"
              maxLength={6}
              value={codeInput}
              onChange={(value) => {
                setCodeInput(digitsOnly(value, 6));
                setError("");
              }}
            />
            <AuthInput
              label="New demo PIN (6 digits)"
              secret
              maxLength={6}
              value={newPin}
              onChange={(value) => {
                setNewPin(digitsOnly(value, 6));
                setError("");
              }}
            />
            <AuthInput
              label="Confirm new demo PIN"
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

            <button type="submit" className={primaryButton}>
              Set New Demo PIN
            </button>
          </form>
        </div>
      )}
    </AuthLayout>
  );
}
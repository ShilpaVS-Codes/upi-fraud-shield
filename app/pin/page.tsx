"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Delete } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { formatMobile, isValidMobile } from "@/lib/demo-auth";

const PIN_LENGTH = 6;
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "back"];

export default function PinPage({
  searchParams,
}: {
  searchParams: Promise<{ mobile?: string }>;
}) {
  // The mobile number typed on the Login page arrives in the URL
  const params = use(searchParams);
  const mobile = typeof params.mobile === "string" ? params.mobile : "";

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Someone opened /pin directly without entering a number first
  if (!isValidMobile(mobile)) {
    return (
      <AuthLayout>
        <h2 className="text-2xl font-bold text-gray-900">Enter your number first</h2>
        <p className="text-sm text-gray-500 mt-2">
          Please start from the login page so we know which demo account to use.
        </p>
        <Link
          href="/login"
          className="block text-center w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
        >
          Go to Login
        </Link>
      </AuthLayout>
    );
  }


const handleKeyPress = async (key: number | string) => {
  if (isSubmitting) return;

  setError("");

  if (key === "back") {
    setPin((previous) => previous.slice(0, -1));
    return;
  }

  if (pin.length >= PIN_LENGTH) return;

  const nextPin = pin + key;

  if (nextPin.length < PIN_LENGTH) {
    setPin(nextPin);
    return;
  }

  setPin(nextPin);
  setIsSubmitting(true);

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          pin: nextPin,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid mobile number or PIN.");
    }

    router.replace("/dashboard");
  } catch {
    setPin("");
    setError(
      "Login failed. Check your mobile number and PIN."
    );
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <AuthLayout>
      <Link href="/login" className="flex items-center gap-1 text-gray-500 text-sm">
        <ChevronLeft size={18} />
        Back
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">Enter your PIN</h2>
      <p className="text-gray-500 text-sm mt-1">{formatMobile(mobile)}</p>
      <p className="text-xs text-gray-400 mt-1">
        Your SafePay demo PIN (not a bank or UPI PIN)
      </p>

      {/* PIN dots */}
      <div className="flex gap-3 mt-8 mb-4">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-safepay-purple ${
              i < pin.length ? "bg-safepay-purple" : "bg-white"
            }`}
          />
        ))}
      </div>

      <div className="min-h-10 mb-4">
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}{" "}
            <Link href="/register" className="text-safepay-purple font-medium">
              Create an account
            </Link>
          </p>
        )}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {keys.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              disabled={isSubmitting}
              onClick={() => handleKeyPress(key)}
              aria-label={key === "back" ? "Delete last digit" : `Digit ${key}`}
              className="w-16 h-16 rounded-2xl border border-transparent flex items-center justify-center text-xl font-medium text-gray-800 hover:border-gray-200 hover:bg-purple-50 active:bg-purple-100"
            >
              {key === "back" ? <Delete size={22} /> : key}
            </button>
          )
        )}
      </div>

      <p className="text-center text-sm mt-8">
        <span className="text-gray-500">Forgot PIN? </span>
        <Link
          href={`/reset-pin?mobile=${mobile}`}
          className="text-safepay-purple font-medium"
        >
          Reset (demo)
        </Link>
      </p>
    </AuthLayout>
  );
}
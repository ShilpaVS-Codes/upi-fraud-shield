
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Info } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import AuthInput from "@/components/AuthInput";
import {
  digitsOnly,
  formatMobile,
  isValidMobile,
  isValidPin,
} from "@/lib/demo-auth";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMobile, setCreatedMobile] = useState<string | null>(null);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (fullName.trim().length < 2 || fullName.trim().length > 100) {
      setError("Enter your full name (2–100 characters).");
      return;
    }

    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError("Enter a valid email address.");
      return;
    }

    if (city.trim().length < 2 || city.trim().length > 60) {
      setError("Enter a valid city name (2–60 characters).");
      return;
    }

    if (!isValidPin(pin)) {
      setError("Your demo PIN must contain exactly 6 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setError("The PINs do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            mobile,
            email: email.trim() || null,
            city: city.trim(),
            pin,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            "This mobile number is already registered. Please log in."
          );
        }

        if (response.status === 400) {
          throw new Error(
            "Registration details are invalid or this number is already registered."
          );
        }

        throw new Error(
          "Registration failed. Please check your details and try again."
        );
      }

      setPin("");
      setConfirmPin("");
      setCreatedMobile(mobile);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to register."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdMobile) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-white" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Account created successfully!
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Your SafePay demo account for {formatMobile(createdMobile)}
            {" "}has been saved. Log in using the PIN you created.
          </p>

          <Link
            href={`/pin?mobile=${encodeURIComponent(createdMobile)}`}
            className="block w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
          >
            Continue to Log In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Link
        href="/login"
        className="flex items-center gap-1 text-gray-500 text-sm"
      >
        <ChevronLeft size={18} />
        Back to login
      </Link>

      <h2 className="text-2xl font-bold text-gray-900 mt-6">
        Create your account
      </h2>

      <p className="text-safepay-purple text-sm mt-1">
        Register your SafePay demo account
      </p>

      <div className="flex items-start gap-2 bg-purple-50 text-gray-600 text-xs rounded-xl px-4 py-3 mt-5">
        <Info
          size={16}
          className="text-safepay-purple shrink-0 mt-0.5"
        />
        <p>
          This is a demo system. Create a made-up 6-digit SafePay PIN.
          Never enter your real bank or UPI PIN.
        </p>
      </div>

      <form className="space-y-4 mt-6" onSubmit={handleCreate}>
        <AuthInput
          label="Full name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(value) => {
            setFullName(value);
            setError("");
          }}
        />

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
          label="Email address (optional)"
          placeholder="you@example.com"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setError("");
          }}
        />

        <AuthInput
          label="City"
          placeholder="Bengaluru"
          value={city}
          onChange={(value) => {
            setCity(value);
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
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-safepay-purple font-medium"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}


"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  XCircle,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import RiskBadge from "@/components/RiskBadge";
import { scanDemoOptions } from "@/lib/sample-data";
import { useCurrentUser } from "@/lib/use-current-user";

type FlowStep = "scan" | "blocked" | "amount" | "review" | "result";

type Merchant = {
  name: string;
  upiId: string;
  isVerified: boolean;
};

type DemoTransactionResponse = {
  referenceId: string;
  status: string;
  mode: string;
  fraudCheck: string;
  message: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskReasons: string[];
  decision: "APPROVED" | "REVIEW" | "BLOCKED";
  transaction: {
    senderUpiId: string;
    receiverUpiId: string;
    amount: number;
    currency: string;
    city: string;
    transactionTime: string;
    receivedAt: string;
  };
};

const quickAmounts = [100, 200, 500, 1000];
const upiIdPattern = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

export default function ScanPayPage() {
  const { user, loading: userLoading } = useCurrentUser();

  const [step, setStep] = useState<FlowStep>("scan");
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [manualUpiId, setManualUpiId] = useState("");
  const [manualError, setManualError] = useState("");
  const [amount, setAmount] = useState(100);
  const [apiResult, setApiResult] =
    useState<DemoTransactionResponse | null>(null);
  const [apiError, setApiError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemoScan = (
    option: (typeof scanDemoOptions)[number]
  ) => {
    setMerchant({
      name: option.name,
      upiId: option.upiId,
      isVerified: option.verified,
    });

    setApiError("");
    setStep(option.verified ? "amount" : "blocked");
  };

  const handleManualPay = () => {
    const id = manualUpiId.trim();

    if (!upiIdPattern.test(id)) {
      setManualError("Enter a valid UPI ID, like merchant@upi");
      return;
    }

    setManualError("");

    const knownOption = scanDemoOptions.find(
      (option) =>
        option.upiId.toLowerCase() === id.toLowerCase()
    );

    if (knownOption) {
      handleDemoScan(knownOption);
      return;
    }

    setMerchant({
      name: "Unverified recipient",
      upiId: id,
      isVerified: false,
    });

    setStep("amount");
  };

  const resetFlow = () => {
    setStep("scan");
    setMerchant(null);
    setManualUpiId("");
    setManualError("");
    setAmount(100);
    setApiResult(null);
    setApiError("");
    setIsProcessing(false);
  };

  const handleConfirm = async () => {
    if (!merchant || isProcessing) return;

    setIsProcessing(true);
    setApiError("");
    setApiResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!apiUrl) {
        throw new Error("Backend API URL is not configured.");
      }

      if (userLoading || !user) {
        throw new Error(
          "Please log in before making a demo transaction."
        );
      }

      if (
        !Number.isFinite(amount) ||
        amount < 1 ||
        amount > 100000 ||
        Math.round(amount * 100) !== amount * 100
      ) {
        throw new Error(
          "Enter an amount between ₹1 and ₹1,00,000 with at most two decimal places."
        );
      }

      const response = await fetch(
        `${apiUrl}/api/demo/transactions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderUpiId: user.upiId,
            receiverUpiId: merchant.upiId,
            amount,
            city: user.city,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Your login session has expired. Please log in again."
            : `Transaction failed (HTTP ${response.status}).`
        );
      }

      const data: DemoTransactionResponse =
        await response.json();

      setApiResult(data);
      setStep("result");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to SafePay backend."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <TopBar title="Scan & Pay" />

      <div className="max-w-lg">
        {step === "scan" && (
          <div>
            <div className="relative bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl h-64 flex flex-col items-center justify-center mb-4 overflow-hidden">
              <span className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
              <span className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
              <span className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
              <span className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/70 rounded-br-lg" />

              <div className="w-40 h-px bg-white/80 animate-pulse" />
              <ScanLine
                className="text-white/40 mt-4"
                size={28}
              />
            </div>

            <p className="text-center text-sm text-gray-400 mb-8">
              QR scanner preview — demo simulation only
            </p>

            <p className="text-xs font-semibold text-gray-400 mb-3">
              DEMO: SIMULATE QR SCAN
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {scanDemoOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDemoScan(option)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left border ${
                    option.verified
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  {option.verified ? (
                    <ShieldCheck
                      className="text-green-500 shrink-0"
                      size={20}
                    />
                  ) : (
                    <AlertTriangle
                      className="text-red-500 shrink-0"
                      size={20}
                    />
                  )}

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        option.verified
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {option.name} —{" "}
                      {option.verified
                        ? "Verified Demo Merchant"
                        : "Suspicious Demo QR"}
                    </p>
                    <p
                      className={`text-xs ${
                        option.verified
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {option.upiId}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mb-3">
              or enter UPI ID manually
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="merchant@upi"
                value={manualUpiId}
                onChange={(e) => {
                  setManualUpiId(e.target.value);
                  setManualError("");
                }}
                className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm px-4 py-3 text-sm outline-none"
              />

              <button
                onClick={handleManualPay}
                disabled={!manualUpiId.trim()}
                className="px-6 rounded-2xl font-semibold text-white bg-safepay-purple disabled:opacity-40"
              >
                Pay
              </button>
            </div>

            {manualError && (
              <p className="text-xs text-red-500 mt-2">
                {manualError}
              </p>
            )}
          </div>
        )}

        {step === "blocked" && merchant && (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
              <AlertTriangle
                className="text-white"
                size={32}
              />
            </div>

            <h2 className="text-xl font-bold text-red-600">
              Suspicious Demo QR
            </h2>

            <p className="text-sm text-gray-500 mt-3 max-w-sm">
              This QR is marked as suspicious in SafePay&apos;s
              predefined demonstration data. Payment is
              disabled for this demo QR.
            </p>

            <p className="text-xs text-gray-400 mt-3">
              This is a simulated warning, not a live fraud
              report or a backend fraud decision.
            </p>

            <div className="w-full bg-white rounded-2xl shadow-sm p-4 mt-6 text-left">
              <p className="text-sm font-semibold text-gray-700">
                UPI ID: {merchant.upiId}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Do not proceed with an untrusted QR code.
                Verify the recipient before making a payment.
              </p>
            </div>

            <button
              onClick={resetFlow}
              className="w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
            >
              Try Another Payment
            </button>
          </div>
        )}

        {step === "amount" && merchant && (
          <div>
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-4 mb-6">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  merchant.isVerified
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {merchant.isVerified ? (
                  <ShieldCheck size={18} />
                ) : (
                  <ShieldAlert size={18} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {merchant.name}
                </p>
                <p className="text-xs text-gray-400">
                  {merchant.upiId}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Enter Amount
            </h2>

            <div className="bg-white rounded-2xl shadow-sm px-4 py-4 mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold">
                ₹
              </span>
              <input
                type="number"
                min={1}
                max={100000}
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(Number(e.target.value))
                }
                className="text-2xl font-bold text-gray-900 outline-none w-full"
              />
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`py-3 rounded-2xl text-sm font-medium border ${
                    amount === value
                      ? "bg-safepay-purple text-white border-safepay-purple"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setApiError("");
                setStep("review");
              }}
              disabled={
                !Number.isFinite(amount) ||
                amount < 1 ||
                amount > 100000 ||
                Math.round(amount * 100) !== amount * 100
              }
              className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark disabled:opacity-40"
            >
              Continue to Review
            </button>
          </div>
        )}

        {step === "review" && merchant && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Review Demo Payment
            </h2>

            <div className="bg-purple-50 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-purple-800">
                Ready for Backend Fraud Analysis
              </p>
              <p className="text-xs text-purple-700 mt-1">
                SafePay will calculate the transaction risk
                when you confirm. No real money will move.
              </p>
            </div>

            {!merchant.isVerified && (
              <div className="bg-yellow-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  This recipient is not in the predefined
                  verified merchant list. Verification
                  status is not a backend fraud score.
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
              <ReviewRow
                label="Recipient"
                value={merchant.name}
              />
              <ReviewRow
                label="UPI ID"
                value={merchant.upiId}
              />
              <ReviewRow
                label="Amount"
                value={`₹${amount.toLocaleString("en-IN")}`}
              />
            </div>

            {apiError && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4"
              >
                <p className="text-sm font-semibold text-red-700">
                  Transaction Failed
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {apiError}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-2xl font-semibold text-gray-700 border border-gray-200 disabled:opacity-50"
              >
                Edit
              </button>

              <button
                onClick={handleConfirm}
                disabled={isProcessing || userLoading}
                className="flex-1 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark disabled:opacity-50"
              >
                {isProcessing
                  ? "Analysing..."
                  : "Confirm Demo Transaction"}
              </button>
            </div>
          </div>
        )}

        {step === "result" && merchant && apiResult && (
          <div className="flex flex-col items-center text-center py-10">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                apiResult.decision === "APPROVED"
                  ? "bg-green-500"
                  : apiResult.decision === "REVIEW"
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            >
              {apiResult.decision === "BLOCKED" ? (
                <XCircle className="text-white" size={32} />
              ) : (
                <CheckCircle2
                  className="text-white"
                  size={32}
                />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {apiResult.decision === "APPROVED"
                ? "Demo Transaction Approved"
                : apiResult.decision === "REVIEW"
                  ? "Demo Transaction Requires Review"
                  : "Demo Transaction Blocked"}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Spring Boot fraud analysis completed.
              No real money was transferred.
            </p>

            <div className="w-full bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mt-6 text-left">
              <ReviewRow
                label="To"
                value={merchant.name}
              />
              <ReviewRow
                label="UPI ID"
                value={merchant.upiId}
              />
              <ReviewRow
                label="Amount"
                value={`₹${Number(
                  apiResult.transaction.amount
                ).toLocaleString("en-IN")}`}
              />
              <ReviewRow
                label="Risk Score"
                value={`${apiResult.riskScore}/100`}
              />
              <ReviewRow
                label="Risk Level"
                value={
                  <RiskBadge type={apiResult.riskLevel} />
                }
              />
              <ReviewRow
                label="Decision"
                value={apiResult.decision}
              />
              <ReviewRow
                label="Transaction ID"
                value={apiResult.referenceId}
              />
              <ReviewRow
                label="Time"
                value={new Date(
                  apiResult.transaction.receivedAt
                ).toLocaleString("en-IN")}
              />
            </div>

            <div className="w-full bg-purple-50 rounded-2xl p-4 mt-4 text-left">
              <p className="text-sm font-semibold text-purple-800">
                Risk Analysis Reasons
              </p>

              {apiResult.riskReasons.length > 0 ? (
                <ul className="list-disc pl-5 mt-2 text-sm text-purple-700">
                  {apiResult.riskReasons.map(
                    (reason, index) => (
                      <li key={index}>{reason}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-purple-700 mt-2">
                  No risk signals detected.
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {apiResult.message}
            </p>

            <button
              onClick={resetFlow}
              className="w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
            >
              Scan Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-400">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

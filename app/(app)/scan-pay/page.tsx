"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import RiskBadge from "@/components/RiskBadge";
import { scanDemoOptions } from "@/lib/sample-data";

type FlowStep = "scan" | "blocked" | "amount" | "review" | "success";

type Merchant = {
  name: string;
  upiId: string;
  isVerified: boolean;
};

const quickAmounts = [100, 200, 500, 1000];

// Very simple UPI ID check: something@bankname
const upiIdPattern = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

export default function ScanPayPage() {
  const [step, setStep] = useState<FlowStep>("scan");
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [manualUpiId, setManualUpiId] = useState("");
  const [manualError, setManualError] = useState("");
  const [amount, setAmount] = useState(100);

  const handleDemoScan = (option: (typeof scanDemoOptions)[number]) => {
    setMerchant({
      name: option.name,
      upiId: option.upiId,
      isVerified: option.verified,
    });
    setStep(option.verified ? "amount" : "blocked");
  };

  const handleManualPay = () => {
    const id = manualUpiId.trim();

    if (!upiIdPattern.test(id)) {
      setManualError("Enter a valid UPI ID, like merchant@upi");
      return;
    }
    setManualError("");

    // If the typed ID is one of the demo merchants, treat it like a scan
    const knownOption = scanDemoOptions.find(
      (option) => option.upiId.toLowerCase() === id.toLowerCase()
    );
    if (knownOption) {
      handleDemoScan(knownOption);
      return;
    }

    // Any other ID is not a verified merchant
    setMerchant({ name: "Unverified recipient", upiId: id, isVerified: false });
    setStep("amount");
  };

  const resetFlow = () => {
    setStep("scan");
    setMerchant(null);
    setManualUpiId("");
    setManualError("");
    setAmount(100);
  };

  return (
    <div>
      <TopBar title="Scan & Pay" />

      <div className="max-w-lg">
        {/* STEP: SCAN */}
        {step === "scan" && (
          <div>
            {/* Scanner placeholder */}
            <div className="relative bg-gradient-to-br from-safepay-purple to-safepay-purple-dark rounded-3xl h-64 flex flex-col items-center justify-center mb-4 overflow-hidden">
              <span className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
              <span className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/70 rounded-tr-lg" />
              <span className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
              <span className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-white/70 rounded-br-lg" />

              <div className="w-40 h-px bg-white/80 animate-pulse" />
              <ScanLine className="text-white/40 mt-4" size={28} />
            </div>
            <p className="text-center text-sm text-gray-400 mb-8">
              Position QR code within the frame
            </p>

            {/* Demo scan options */}
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
                    <ShieldCheck className="text-green-500 shrink-0" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                  )}
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        option.verified ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {option.name} — {option.verified ? "Verified Merchant" : "Suspicious Vendor"}
                    </p>
                    <p
                      className={`text-xs ${
                        option.verified ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {option.verified ? "Low risk" : "High risk"} · {option.upiId}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Manual entry */}
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
                  if (manualError) setManualError("");
                }}
                className={`flex-1 bg-white rounded-2xl shadow-sm px-4 py-3 text-sm outline-none border ${
                  manualError ? "border-red-400" : "border-transparent"
                }`}
              />
              <button
                onClick={handleManualPay}
                disabled={!manualUpiId.trim()}
                className={`px-6 rounded-2xl font-semibold text-white ${
                  manualUpiId.trim()
                    ? "bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
                    : "bg-purple-200 cursor-not-allowed"
                }`}
              >
                Pay
              </button>
            </div>
            {manualError && (
              <p className="text-xs text-red-500 mt-2">{manualError}</p>
            )}
          </div>
        )}

        {/* STEP: BLOCKED (suspicious QR) */}
        {step === "blocked" && merchant && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold text-red-600">Payment Blocked by AI</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              This UPI ID ({merchant.upiId}) has 3 active fraud reports from
              other users. SafePay has blocked this payment to protect your
              account.
            </p>

            <div className="w-full bg-white rounded-2xl shadow-sm p-4 mt-6 text-left">
              <p className="text-xs font-semibold text-gray-400 mb-2">WHAT TO DO</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Do not retry this payment</li>
                <li>Report the QR code if physical</li>
                <li>Contact support if funds were deducted</li>
              </ul>
            </div>

            <button
              onClick={resetFlow}
              className="w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
            >
              Try Another Payment
            </button>
          </div>
        )}

        {/* STEP: AMOUNT */}
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
                <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
                <p className="text-xs text-gray-400">{merchant.upiId}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Enter Amount
            </h2>

            <div className="bg-white rounded-2xl shadow-sm px-4 py-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-2xl font-bold text-gray-900 outline-none w-full"
                />
              </div>
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
              onClick={() => setStep("review")}
              disabled={!amount || amount <= 0}
              className={`w-full py-4 rounded-2xl font-semibold text-white ${
                amount > 0
                  ? "bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
                  : "bg-purple-200 cursor-not-allowed"
              }`}
            >
              Run AI Fraud Check & Continue
            </button>
          </div>
        )}

        {/* STEP: REVIEW */}
        {step === "review" && merchant && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Review Payment
            </h2>

            {merchant.isVerified ? (
              <div className="flex items-start gap-3 bg-green-50 rounded-2xl px-4 py-4 mb-6">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    AI Fraud Check: Safe to Pay
                  </p>
                  <p className="text-xs text-green-600">
                    Safety score: 96/100 · Verified merchant
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-yellow-50 rounded-2xl px-4 py-4 mb-6">
                <ShieldAlert className="text-yellow-600 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-yellow-700">
                    AI Fraud Check: Proceed with Care
                  </p>
                  <p className="text-xs text-yellow-600">
                    Safety score: 78/100 · Recipient is not a verified merchant (demo result)
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
              <ReviewRow label="Merchant" value={merchant.name} />
              <ReviewRow label="UPI ID" value={merchant.upiId} />
              <ReviewRow label="Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
              <ReviewRow
                label="AI Risk Level"
                value={<RiskBadge type={merchant.isVerified ? "LOW" : "MEDIUM"} />}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 py-4 rounded-2xl font-semibold text-gray-700 border border-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => setStep("success")}
                className="flex-1 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === "success" && merchant && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Sent!</h2>
            <p className="text-sm text-gray-500 mt-1">
              ₹{amount.toLocaleString("en-IN")} paid to {merchant.name}{" "}
              successfully.
              <br />
              AI fraud check:{" "}
              {merchant.isVerified ? (
                <span className="text-green-600 font-medium">Cleared ✓</span>
              ) : (
                <span className="text-yellow-600 font-medium">
                  Passed with caution
                </span>
              )}
            </p>

            <div className="w-full bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mt-6 text-left">
              <ReviewRow label="To" value={merchant.name} />
              <ReviewRow label="UPI ID" value={merchant.upiId} />
              <ReviewRow label="Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
              <ReviewRow label="Transaction ID" value="TXN9271563820" />
              <ReviewRow label="Time" value="Just now" />
            </div>

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
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
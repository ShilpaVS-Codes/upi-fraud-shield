"use client";

import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import StepIndicator from "@/components/StepIndicator";
import RiskBadge from "@/components/RiskBadge";
import { sampleContacts, type Contact } from "@/lib/sample-data";
import { useCurrentUser } from "@/lib/use-current-user";

type FlowStep = "recipient" | "amount" | "review" | "success";
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

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function SendMoneyPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [step, setStep] = useState<FlowStep>("recipient");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState(100);
  const [note, setNote] = useState("");
  const [apiResult, setApiResult] =
  useState<DemoTransactionResponse | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState("");

  const filteredContacts = sampleContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.upiId.toLowerCase().includes(search.toLowerCase())
  );

  const resetFlow = () => {
    setStep("recipient");
    setSearch("");
    setSelectedContact(null);
    setAmount(100);
    setNote("");
    setApiResult(null);
    setApiError("");
  };

  const handleConfirm = async () => {
    if (!selectedContact || isProcessing) return;

    setIsProcessing(true);
    setApiError("");
    setApiResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!apiUrl) {
        throw new Error("Backend API URL is not configured.");
      }


  if (userLoading || !user) {
    throw new Error("Please log in before making a demo transaction.");
  }

  const response = await fetch(`${apiUrl}/api/demo/transactions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senderUpiId: user.upiId,
      receiverUpiId: selectedContact.upiId,
      amount,
      city: user.city,
    }),
  });


  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Your login session has expired. Please log in again."
        : `Transaction failed (HTTP ${response.status}).`
    );
  }

  const data: DemoTransactionResponse = await response.json();

  setApiResult(data);
  setStep("success");


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


  const stepNumber = step === "recipient" ? 1 : step === "amount" ? 2 : 3;

  return (
    <div>
      <TopBar title="Send Money" />

      <div className="max-w-lg">
        {step !== "success" && <StepIndicator currentStep={stepNumber} />}

        {/* STEP 1: RECIPIENT */}
        {step === "recipient" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Send Money To
            </h2>

            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 mb-6">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search name or UPI ID (e.g. name@upi)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <p className="text-xs font-semibold text-gray-400 mb-2">
              RECENT CONTACTS
            </p>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep("amount");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-safepay-purple text-sm font-semibold flex items-center justify-center">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </p>
                        {contact.riskTag && <RiskBadge type={contact.riskTag} />}
                      </div>
                      <p className="text-xs text-gray-400">{contact.upiId}</p>
                    </div>
                  </div>
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: AMOUNT */}
        {step === "amount" && selectedContact && (
          <div>
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-safepay-purple text-sm font-semibold flex items-center justify-center">
                {selectedContact.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedContact.name}
                </p>
                <p className="text-xs text-gray-400">{selectedContact.upiId}</p>
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

            <div className="grid grid-cols-3 gap-3 mb-6">
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
                  ₹{value.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white rounded-2xl shadow-sm px-4 py-3 text-sm outline-none mb-6"
            />

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

        {/* STEP 3: REVIEW */}
        {step === "review" && selectedContact && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Review Payment
            </h2>

            <div className="flex items-start gap-3 bg-purple-50 rounded-2xl px-4 py-4 mb-6">
              <CheckCircle2 className="text-purple-600 shrink-0" size={20} />
              <div>
                  <p className="text-sm font-semibold text-purple-800">
                    Ready for Backend Fraud Analysis
                  </p>
                  <p className="text-xs text-purple-700">
                    SafePay will analyse this demo transaction when you confirm.
                  </p>
                </div>
              </div>

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
              <ReviewRow label="Recipient" value={selectedContact.name} />
              <ReviewRow label="UPI ID" value={selectedContact.upiId} />
              <ReviewRow label="Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
              <ReviewRow label="Note" value={note || "No note"} />
            </div>
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
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
                className="flex-1 py-4 rounded-2xl font-semibold text-gray-700 border border-gray-200"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark disabled:opacity-50"
              >
                {isProcessing ? "Analysing..." : "Confirm Demo Transaction"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}

{/* STEP 4: BACKEND RESULT */}
{step === "success" && selectedContact && apiResult && (
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
      <CheckCircle2 className="text-white" size={32} />
    </div>

    <h2 className="text-xl font-bold text-gray-900">
      {apiResult.decision === "APPROVED"
        ? "Demo Transaction Approved"
        : apiResult.decision === "REVIEW"
          ? "Demo Transaction Requires Review"
          : "Demo Transaction Blocked"}
    </h2>

    <p className="text-sm text-gray-500 mt-2">
      Backend fraud analysis completed successfully.
    </p>

    <div className="w-full bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mt-6 text-left">
      <ReviewRow label="To" value={selectedContact.name} />
      <ReviewRow label="UPI ID" value={selectedContact.upiId} />
      <ReviewRow
        label="Amount"
        value={`₹${amount.toLocaleString("en-IN")}`}
      />
      <ReviewRow
        label="Risk Score"
        value={`${apiResult.riskScore}/100`}
      />
      <ReviewRow
        label="Risk Level"
        value={<RiskBadge type={apiResult.riskLevel} />}
      />
      <ReviewRow label="Decision" value={apiResult.decision} />
      <ReviewRow label="Transaction ID" value={apiResult.referenceId} />
      <ReviewRow
        label="Time"
        value={new Date(apiResult.transaction.receivedAt).toLocaleString("en-IN")}
      />
    </div>

    <div className="w-full bg-purple-50 rounded-2xl p-4 mt-4 text-left">
      <p className="text-sm font-semibold text-purple-800">
        Risk Analysis Reasons
      </p>

      {apiResult.riskReasons.length > 0 ? (
        <ul className="list-disc pl-5 mt-2 text-sm text-purple-700">
          {apiResult.riskReasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
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
      Send Another Demo Transaction
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
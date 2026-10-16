"use client";

import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import StepIndicator from "@/components/StepIndicator";
import RiskBadge from "@/components/RiskBadge";
import { sampleContacts, type Contact } from "@/lib/sample-data";

type FlowStep = "recipient" | "amount" | "review" | "success";

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function SendMoneyPage() {
  const [step, setStep] = useState<FlowStep>("recipient");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState(100);
  const [note, setNote] = useState("");

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
                      <p className="text-xs text-gray-400">@{contact.upiId}</p>
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
                <p className="text-xs text-gray-400">@{selectedContact.upiId}</p>
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

            <div className="flex items-start gap-3 bg-green-50 rounded-2xl px-4 py-4 mb-6">
              <CheckCircle2 className="text-green-500 shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-green-700">
                  AI Fraud Check: Safe to Pay
                </p>
                <p className="text-xs text-green-600">
                  Safety score: 92/100 · No risk signals detected
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
              <ReviewRow label="Recipient" value={selectedContact.name} />
              <ReviewRow label="UPI ID" value={`@${selectedContact.upiId}`} />
              <ReviewRow label="Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
              <ReviewRow label="Note" value={note || "No note"} />
              <ReviewRow
                label="AI Risk Level"
                value={<RiskBadge type="LOW" />}
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

        {/* STEP 4: SUCCESS */}
        {step === "success" && selectedContact && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Sent!</h2>
            <p className="text-sm text-gray-500 mt-1">
              ₹{amount.toLocaleString("en-IN")} sent to {selectedContact.name}{" "}
              successfully.
              <br />
              AI fraud check: <span className="text-green-600 font-medium">Cleared ✓</span>
            </p>

            <div className="w-full bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mt-6 text-left">
              <ReviewRow label="To" value={selectedContact.name} />
              <ReviewRow label="UPI ID" value={`@${selectedContact.upiId}`} />
              <ReviewRow label="Amount" value={`₹${amount.toLocaleString("en-IN")}`} />
              <ReviewRow label="Transaction ID" value="TXN8472836450" />
              <ReviewRow label="Time" value="Just now" />
            </div>

            <button
              onClick={resetFlow}
              className="w-full mt-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-safepay-purple to-safepay-purple-dark"
            >
              Send Another Payment
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
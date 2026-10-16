// ============================================
// SAMPLE DATA — for frontend demo only
// Replace with real API calls after backend is ready
// ============================================

export interface Transaction {
  id: string;
  name: string;
  upiId: string;
  time: string;
  amount: number;
  direction: "sent" | "received";
  category: string;
  riskTag?: "REVIEW" | "HIGH RISK";
}

export interface FraudAlert {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  time: string;
  whatToDo?: string[];
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  riskTag?: "REVIEW";
}

export interface KycStep {
  id: string;
  label: string;
  done: boolean;
}

export interface LinkedAccount {
  id: string;
  bankName: string;
  accountEnding: string;
  type: string;
  balance: number;
  isPrimary: boolean;
}

export interface UserSettings {
  aiFraudShield: boolean;
  autoBlockHighRisk: boolean;
  qrVerification: boolean;
  biometricAuth: boolean;
  fraudAlerts: boolean;
  transactionAlerts: boolean;
  monthlySecurityReport: boolean;
  offersPromotions: boolean;
  hideBalance: boolean;
  incognitoPayments: boolean;
  analyticsSharing: boolean;
}

export interface Limits {
  daily: number;
  perTransaction: number;
}

// NEW (Fraud Alerts update)
export interface MonthlyRisk {
  id: string;
  label: string;
  count: number;
}

export const currentUser = {
  name: "Arjun Kapoor",
  upiId: "arjun@safepay",
  mobile: "+91 98765 43210",
  email: "arjun.kapoor@gmail.com",
  dob: "12 March 1992",
  gender: "Male",
  city: "New Delhi, India",
  memberSince: "Jan 2023",
  trustScore: 94,
  upiLimit: "₹2L/day",
  totalBalance: 124850,
  monthSpent: 28430,
  monthlyLimit: 50000,
};

export const sampleTransactions: Transaction[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    upiId: "priya.upi",
    time: "2 min ago",
    amount: 2500,
    direction: "sent",
    category: "Transfer",
  },
  {
    id: "t2",
    name: "Zomato",
    upiId: "zomato.pay",
    time: "1 hr ago",
    amount: 345,
    direction: "sent",
    category: "Food",
  },
  {
    id: "t3",
    name: "Rahul Kumar",
    upiId: "rahul.biz",
    time: "3 hrs ago",
    amount: 15000,
    direction: "received",
    category: "Transfer",
    riskTag: "REVIEW",
  },
  {
    id: "t4",
    name: "Amazon Pay",
    upiId: "amazon.pay",
    time: "Yesterday",
    amount: 1299,
    direction: "sent",
    category: "Shopping",
  },
  {
    id: "t5",
    name: "Unknown Merchant",
    upiId: "qr7742x",
    time: "Yesterday",
    amount: 500,
    direction: "sent",
    category: "Transfer",
    riskTag: "HIGH RISK",
  },
  {
    id: "t6",
    name: "Netflix",
    upiId: "netflix.pay",
    time: "2 days ago",
    amount: 649,
    direction: "sent",
    category: "Entertainment",
  },
];

export const sampleContacts: Contact[] = [
  { id: "c1", name: "Priya Sharma", upiId: "priya.upi" },
  { id: "c2", name: "Rahul Kumar", upiId: "rahul.biz", riskTag: "REVIEW" },
  { id: "c3", name: "Sneha Patel", upiId: "sneha123" },
  { id: "c4", name: "Aman Singh", upiId: "amansingh" },
];

export const sampleAlerts: FraudAlert[] = [
  {
    id: "a1",
    title: "Suspicious QR Code Payment",
    description:
      "A QR code linked to an unverified vendor (xn7742@paytm) was scanned. This UPI ID has 3 active fraud reports from other users.",
    severity: "CRITICAL",
    time: "2 min ago",
    whatToDo: [
      "Do not retry this payment",
      "Report the QR code if physical",
      "Contact support if funds were deducted",
    ],
  },
  {
    id: "a2",
    title: "Unusual Login Location",
    description:
      "Your account was accessed from Mumbai (IP: 103.xxx.xxx) while your usual location is Delhi. If this wasn't you, secure your account immediately.",
    severity: "HIGH",
    time: "1 hour ago",
  },
  {
    id: "a3",
    title: "Large Incoming Transfer Review",
    description:
      "₹15,000 received from Rahul Kumar (@rahul.biz). This is 3x your average received amount. Marked for AI review.",
    severity: "MEDIUM",
    time: "3 hours ago",
  },
  {
    id: "a4",
    title: "Phishing SMS Detected",
    description:
      "A suspicious SMS claiming to be from your bank was detected on your linked number. It asks you to click a link to update KYC.",
    severity: "LOW",
    time: "Yesterday",
  },
  {
    id: "a5",
    title: "Monthly Security Report",
    description:
      "Your July 2026 security report is ready. 12 threats blocked, 847 safe transactions processed, AI risk score: 94/100.",
    severity: "INFO",
    time: "Aug 1",
  },
];

export const scanDemoOptions = [
  {
    id: "s1",
    name: "Café Aromas",
    upiId: "cafearomas@hdfc",
    verified: true,
    label: "Verified Merchant",
  },
  {
    id: "s2",
    name: "Unknown QR",
    upiId: "xn7742x@paytm",
    verified: false,
    label: "Suspicious Vendor · 3 fraud reports",
  },
];

export const kycSteps: KycStep[] = [
  { id: "k1", label: "Aadhaar Verification", done: true },
  { id: "k2", label: "PAN Card Linked", done: true },
  { id: "k3", label: "Face Verification", done: true },
  { id: "k4", label: "Video KYC", done: false },
];

export const linkedAccounts: LinkedAccount[] = [
  {
    id: "b1",
    bankName: "HDFC Bank",
    accountEnding: "4521",
    type: "Savings",
    balance: 124850,
    isPrimary: true,
  },
  {
    id: "b2",
    bankName: "SBI Bank",
    accountEnding: "8823",
    type: "Current",
    balance: 45200,
    isPrimary: false,
  },
];

// Default value for every switch on the Settings page
export const defaultSettings: UserSettings = {
  aiFraudShield: true,
  autoBlockHighRisk: true,
  qrVerification: true,
  biometricAuth: false,
  fraudAlerts: true,
  transactionAlerts: true,
  monthlySecurityReport: true,
  offersPromotions: false,
  hideBalance: false,
  incognitoPayments: false,
  analyticsSharing: true,
};

// Limits currently active on the account
export const startingLimits: Limits = {
  daily: 200000,
  perTransaction: 100000,
};

// What the dropdowns show before the user changes them
export const defaultNewLimits: Limits = {
  daily: 50000,
  perTransaction: 10000,
};

// Choices inside the dropdowns
export const dailyLimitOptions = [10000, 25000, 50000, 100000, 200000];
export const perTransactionLimitOptions = [5000, 10000, 25000, 50000, 100000];

// NEW (Fraud Alerts update) — "This Month's Risks" on the Fraud Alerts page
export const monthlyRisks: MonthlyRisk[] = [
  { id: "phishing", label: "Phishing Attempts", count: 4 },
  { id: "qr", label: "Suspicious QRs", count: 2 },
  { id: "logins", label: "Unusual Logins", count: 1 },
  { id: "blocked", label: "Blocked Payments", count: 1 },
];

// NEW (Fraud Alerts update) — alerts that start as unread (the purple dots in the design)
export const initialUnreadAlertIds = ["a1", "a2"];
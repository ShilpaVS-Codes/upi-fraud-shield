import { currentUser } from "@/lib/sample-data";

// ============================================================
// DEMO AUTHENTICATION: frontend demonstration only
//
// - This is NOT real security. PINs are kept as plain text in the
//   browser's sessionStorage (cleared when the tab is closed).
// - Only use made-up PINs. Never type a real bank or UPI PIN.
// - Replace this whole file with calls to the Spring Boot backend
//   (secure accounts, hashed PINs, real verification) later.
// ============================================================

const STORAGE_KEY = "safepay-demo-accounts";

// The built-in demo user comes from the existing sample data
export const DEMO_USER_MOBILE = currentUser.mobile.replace(/\D/g, "").slice(-10);
export const DEMO_USER_PIN = "123456"; // fictional demo PIN

type Accounts = Record<string, string | undefined>;

export const digitsOnly = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

// Indian mobile numbers: 10 digits, starting with 6, 7, 8 or 9
export const isValidMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);

export const isValidPin = (pin: string) => /^\d{6}$/.test(pin);

export const formatMobile = (mobile: string) =>
  `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;

function loadAccounts(): Accounts {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Accounts) : {};
  } catch {
    return {}; // storage unavailable: behave as if nothing is saved
  }
}

function saveAccounts(accounts: Accounts) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // storage unavailable: the account simply will not be remembered
  }
}

export function accountExists(mobile: string): boolean {
  return mobile === DEMO_USER_MOBILE || loadAccounts()[mobile] !== undefined;
}

// Returns false if the number is already registered
export function registerAccount(mobile: string, pin: string): boolean {
  if (accountExists(mobile)) return false;
  const accounts = loadAccounts();
  accounts[mobile] = pin;
  saveAccounts(accounts);
  return true;
}

export function resetPin(mobile: string, pin: string) {
  const accounts = loadAccounts();
  accounts[mobile] = pin;
  saveAccounts(accounts);
}

export function checkLogin(mobile: string, pin: string): boolean {
  const savedPin =
    loadAccounts()[mobile] ?? (mobile === DEMO_USER_MOBILE ? DEMO_USER_PIN : undefined);
  return savedPin !== undefined && savedPin === pin;
}
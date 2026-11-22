"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Send,
  QrCode,
  History,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Layers,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/send-money", label: "Send Money", icon: Send },
  { href: "/scan-pay", label: "Scan & Pay", icon: QrCode },
  { href: "/transactions", label: "Transactions", icon: History },
  { href: "/fraud-alerts", label: "Fraud Alerts", icon: AlertTriangle, badge: 2 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();

  const initials = user?.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-100 bg-white h-screen sticky top-0 px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-safepay-purple to-safepay-purple-dark flex items-center justify-center">
          <Layers className="text-white" size={18} />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">SafePay</p>
          <p className="text-xs text-gray-400 leading-tight">UPI Fraud Shield</p>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-200 pt-3">
  <p className="text-xs font-semibold text-violet-700">
    Department of ECE
  </p>
  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
    Sir M. Visvesvaraya Institute of Technology
  </p>
</div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-purple-50 text-safepay-purple"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </span>
              {badge && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>


      {/* User footer */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-safepay-purple text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-tight truncate">
              {loading ? "Loading..." : user?.fullName ?? "Not signed in"}
            </p>

            <p className="text-xs text-gray-400 leading-tight truncate">
              {user?.upiId ?? ""}
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          Sign Out
        </Link>
      </div>

    </aside>
  );
}
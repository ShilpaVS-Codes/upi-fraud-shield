"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Send, QrCode, History, AlertTriangle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/send-money", label: "Send", icon: Send },
  { href: "/scan-pay", label: "Scan", icon: QrCode },
  { href: "/transactions", label: "History", icon: History },
  { href: "/fraud-alerts", label: "Alerts", icon: AlertTriangle },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-50">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
              isActive ? "text-safepay-purple" : "text-gray-400"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
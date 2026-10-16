import Link from "next/link";
import { Bell } from "lucide-react";

export default function TopBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          AI Shield Active
        </span>

        <Link
          href="/fraud-alerts"
          aria-label="View fraud alerts"
          className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            2
          </span>
        </Link>

        <Link
          href="/profile"
          aria-label="Go to profile"
          className="w-9 h-9 rounded-full bg-safepay-purple text-white text-xs font-semibold flex items-center justify-center"
        >
          AK
        </Link>
      </div>
    </div>
  );
}
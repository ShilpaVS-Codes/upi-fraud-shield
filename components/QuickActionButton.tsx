import Link from "next/link";
import { LucideIcon } from "lucide-react";

export default function QuickActionButton({
  href,
  label,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
      >
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </Link>
  );
}
import { Layers, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Purple brand panel: a banner on mobile, the left half on desktop */}
      <div className="bg-gradient-to-br from-safepay-purple to-safepay-purple-dark text-white md:w-1/2 md:shrink-0 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Layers size={28} />
          </div>
          <div>
            <p className="text-2xl font-bold leading-tight">SafePay</p>
            <p className="text-sm text-white/80 leading-tight">UPI Fraud Shield</p>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-12">
        <div className="w-full max-w-sm mx-auto">
          {children}

          <p className="text-center text-xs text-gray-400 mt-8">
            Demo prototype: no real bank, UPI, SMS or Google service is connected.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
            <ShieldCheck size={14} />
            <span>256-bit encrypted · RBI compliant · AI fraud protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
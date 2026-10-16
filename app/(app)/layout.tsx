import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 md:px-8 pb-24 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
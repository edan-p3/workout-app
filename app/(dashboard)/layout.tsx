import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}


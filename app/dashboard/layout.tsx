import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Header from "./_components/header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={session.user as any} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header user={session.user as any} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

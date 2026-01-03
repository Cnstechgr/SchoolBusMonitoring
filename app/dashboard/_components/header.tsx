"use client";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeaderProps {
  user: { name?: string | null; email?: string | null; role?: string };
}

export default function Header({ user }: HeaderProps) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications/unread")
      .then((r) => r.json())
      .then((d) => setUnread(d?.count ?? 0))
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white shadow-sm px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="lg:hidden w-10" />
      <h2 className="text-lg font-semibold text-gray-800 hidden lg:block">School Bus Monitoring System</h2>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={22} className="text-gray-600" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-amber-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase() || "user"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

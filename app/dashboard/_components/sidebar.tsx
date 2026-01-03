"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, LayoutDashboard, Route, Users, Bell, MapPin, Shield, Activity, UserCircle, Settings, LogOut, X, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SidebarProps {
  user: { name?: string | null; role?: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const role = user?.role || "PARENT";

  const allLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "PARENT", "DRIVER", "STAFF"] },
    { href: "/dashboard/buses", label: "Buses", icon: Bus, roles: ["ADMIN", "STAFF"] },
    { href: "/dashboard/routes", label: "Routes", icon: Route, roles: ["ADMIN", "STAFF"] },
    { href: "/dashboard/students", label: "Students", icon: Users, roles: ["ADMIN", "STAFF", "PARENT"] },
    { href: "/dashboard/drivers", label: "Drivers", icon: UserCircle, roles: ["ADMIN", "STAFF"] },
    { href: "/dashboard/map", label: "Live Map", icon: MapPin, roles: ["ADMIN", "STAFF", "PARENT", "DRIVER"] },
    { href: "/dashboard/alerts", label: "Alerts", icon: Bell, roles: ["ADMIN", "STAFF", "PARENT", "DRIVER"] },
    { href: "/dashboard/behavior", label: "Behavior", icon: Activity, roles: ["ADMIN", "STAFF", "DRIVER"] },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ["ADMIN", "PARENT", "DRIVER", "STAFF"] },
  ];

  const links = allLinks.filter((l) => l.roles.includes(role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <Bus className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">Bus Monitor</h1>
            <p className="text-xs text-gray-500 capitalize">{role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`sidebar-link ${isActive ? "active" : "text-gray-600"}`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md">
        <Menu size={24} className="text-gray-700" />
      </button>
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white shadow-xl flex-col z-30">
        <SidebarContent />
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1">
              <X size={24} className="text-gray-500" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

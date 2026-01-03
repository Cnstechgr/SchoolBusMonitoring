"use client";
import { Bus, Users, Shield, AlertTriangle, MapPin, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  stats: { totalBuses: number; activeBuses: number; totalStudents: number; totalDrivers: number; activeAlerts: number; tripsToday: number };
  alerts: any[];
  buses: any[];
  trips: any[];
  role: string;
  students: any[];
}

export default function DashboardClient({ stats, alerts, buses, trips, role, students }: Props) {
  const isParent = role === "PARENT";

  const statCards = isParent
    ? [
        { label: "My Children", value: students?.length ?? 0, icon: Users, color: "border-blue-500", bg: "bg-blue-50" },
        { label: "Assigned Buses", value: [...new Set(students?.map((s: any) => s?.busId)?.filter(Boolean) ?? [])]?.length ?? 0, icon: Bus, color: "border-amber-500", bg: "bg-amber-50" },
        { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: AlertTriangle, color: "border-red-500", bg: "bg-red-50" },
      ]
    : [
        { label: "Total Buses", value: stats?.totalBuses ?? 0, icon: Bus, color: "border-amber-500", bg: "bg-amber-50" },
        { label: "Active Buses", value: stats?.activeBuses ?? 0, icon: Activity, color: "border-green-500", bg: "bg-green-50" },
        { label: "Students", value: stats?.totalStudents ?? 0, icon: Users, color: "border-blue-500", bg: "bg-blue-50" },
        { label: "Drivers", value: stats?.totalDrivers ?? 0, icon: Shield, color: "border-purple-500", bg: "bg-purple-50" },
        { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: AlertTriangle, color: "border-red-500", bg: "bg-red-50" },
        { label: "Active Trips", value: stats?.tripsToday ?? 0, icon: Clock, color: "border-teal-500", bg: "bg-teal-50" },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Overview of your school bus monitoring system</p>
      </div>

      <div className={`grid gap-4 ${isParent ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"}`}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={stat.color.replace("border-", "text-")} size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Alerts</h2>
            <Link href="/dashboard/alerts" className="text-amber-600 text-sm hover:underline">View All</Link>
          </div>
          {(alerts?.length ?? 0) === 0 ? (
            <p className="text-gray-500 text-center py-8">No active alerts</p>
          ) : (
            <div className="space-y-3">
              {alerts?.slice(0, 5)?.map((alert: any) => (
                <div key={alert?.id} className={`p-3 rounded-lg border-l-4 ${alert?.priority === "CRITICAL" ? "alert-critical" : alert?.priority === "WARNING" ? "alert-warning" : "alert-info"}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert?.type?.replace("_", " ")}</p>
                      <p className="text-xs opacity-80">{alert?.message}</p>
                      <p className="text-xs mt-1 opacity-60">Bus: {alert?.bus?.vehicleId ?? "N/A"}</p>
                    </div>
                  </div>
                </div>
              )) ?? null}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{isParent ? "My Children" : "Active Trips"}</h2>
            <Link href={isParent ? "/dashboard/students" : "/dashboard/buses"} className="text-amber-600 text-sm hover:underline">View All</Link>
          </div>
          {isParent ? (
            <div className="space-y-3">
              {students?.map((s: any) => (
                <div key={s?.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{s?.name}</p>
                    <p className="text-xs text-gray-500">{s?.grade} • Bus: {s?.bus?.vehicleId ?? "Not Assigned"}</p>
                  </div>
                </div>
              )) ?? <p className="text-gray-500 text-center py-4">No children registered</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {trips?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active trips</p>
              ) : (
                trips?.map((trip: any) => (
                  <div key={trip?.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Bus size={18} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{trip?.bus?.vehicleId}</p>
                        <p className="text-xs text-gray-500">Driver: {trip?.driver?.user?.name ?? "N/A"}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">In Progress</span>
                  </div>
                )) ?? null
              )}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/map" className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition">
            <MapPin className="mx-auto text-amber-600 mb-2" size={28} />
            <p className="font-medium text-gray-800">View Map</p>
          </Link>
          <Link href="/dashboard/alerts" className="p-4 bg-red-50 rounded-xl text-center hover:bg-red-100 transition">
            <AlertTriangle className="mx-auto text-red-600 mb-2" size={28} />
            <p className="font-medium text-gray-800">View Alerts</p>
          </Link>
          {!isParent && (
            <>
              <Link href="/dashboard/buses" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition">
                <Bus className="mx-auto text-blue-600 mb-2" size={28} />
                <p className="font-medium text-gray-800">Manage Buses</p>
              </Link>
              <Link href="/dashboard/drivers" className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition">
                <Shield className="mx-auto text-purple-600 mb-2" size={28} />
                <p className="font-medium text-gray-800">Manage Drivers</p>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

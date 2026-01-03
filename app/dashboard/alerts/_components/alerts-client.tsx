"use client";
import { useState } from "react";
import { AlertTriangle, CheckCircle, MapPin, Clock, Filter, Bus } from "lucide-react";
import { motion } from "framer-motion";

interface Props { alerts: any[]; role: string; }

export default function AlertsClient({ alerts, role }: Props) {
  const [alertList, setAlertList] = useState(alerts ?? []);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? alertList : filter === "active" ? alertList?.filter((a: any) => !a?.resolved) : alertList?.filter((a: any) => a?.resolved);

  const handleResolve = async (id: string) => {
    const res = await fetch(`/api/alerts/${id}/resolve`, { method: "POST" });
    if (res.ok) setAlertList((p: any[]) => p?.map((a: any) => (a?.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a)) ?? []);
  };

  const getPriorityStyles = (priority: string) => {
    if (priority === "CRITICAL") return "bg-red-50 border-red-500 text-red-800";
    if (priority === "WARNING") return "bg-amber-50 border-amber-500 text-amber-800";
    return "bg-blue-50 border-blue-500 text-blue-800";
  };

  const getTypeIcon = (type: string) => {
    if (type === "ACCIDENT") return "🚨";
    if (type === "SPEEDING") return "🏎️";
    if (type === "SMOKE") return "🔥";
    if (type === "ALCOHOL") return "🍺";
    return "⚠️";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alert Center</h1>
          <p className="text-gray-500">Monitor and manage system alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
            <option value="all">All Alerts</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered?.map((alert: any, i: number) => (
          <motion.div key={alert?.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`p-4 rounded-xl border-l-4 shadow-md ${getPriorityStyles(alert?.priority)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getTypeIcon(alert?.type)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{alert?.type?.replace("_", " ")}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${alert?.priority === "CRITICAL" ? "bg-red-200 text-red-800" : alert?.priority === "WARNING" ? "bg-amber-200 text-amber-800" : "bg-blue-200 text-blue-800"}`}>
                      {alert?.priority}
                    </span>
                    {alert?.resolved && <span className="px-2 py-0.5 text-xs rounded-full bg-green-200 text-green-800">Resolved</span>}
                  </div>
                  <p className="text-sm opacity-80 mb-2">{alert?.message}</p>
                  <div className="flex flex-wrap gap-4 text-xs opacity-70">
                    <span className="flex items-center gap-1"><Bus size={12} /> {alert?.bus?.vehicleId ?? "N/A"}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(alert?.createdAt).toLocaleString()}</span>
                    {alert?.latitude && alert?.longitude && (
                      <span className="flex items-center gap-1"><MapPin size={12} /> {alert?.latitude?.toFixed?.(4)}, {alert?.longitude?.toFixed?.(4)}</span>
                    )}
                    {alert?.gForce && <span>G-Force: {alert?.gForce?.toFixed?.(2)}G</span>}
                  </div>
                </div>
              </div>
              {!alert?.resolved && (role === "ADMIN" || role === "STAFF") && (
                <button onClick={() => handleResolve(alert?.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-medium">
                  <CheckCircle size={14} /> Resolve
                </button>
              )}
            </div>
          </motion.div>
        )) ?? null}
        {(filtered?.length ?? 0) === 0 && (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No alerts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Route, Plus, Edit, Trash2, MapPin, Clock, Bus } from "lucide-react";
import { motion } from "framer-motion";
import RouteModal from "./route-modal";

interface Props { routes: any[]; }

export default function RoutesClient({ routes }: Props) {
  const [routeList, setRouteList] = useState(routes ?? []);
  const [modal, setModal] = useState<{ open: boolean; route: any | null }>({ open: false, route: null });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this route?")) return;
    const res = await fetch(`/api/routes/${id}`, { method: "DELETE" });
    if (res.ok) setRouteList((p: any[]) => p?.filter((r: any) => r?.id !== id) ?? []);
  };

  const handleSave = (route: any) => {
    if (modal.route) {
      setRouteList((p: any[]) => p?.map((r: any) => (r?.id === route?.id ? route : r)) ?? []);
    } else {
      setRouteList((p: any[]) => [...(p ?? []), route]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
          <p className="text-gray-500">Manage bus routes and stops</p>
        </div>
        <button onClick={() => setModal({ open: true, route: null })} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Route
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routeList?.map((route: any, i: number) => (
          <motion.div key={route?.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Route className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{route?.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> {route?.startTime} - {route?.endTime}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{route?.stops?.length ?? 0} stops</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bus size={16} />
                <span>{route?._count?.buses ?? 0} buses assigned</span>
              </div>
            </div>
            {(route?.stops?.length ?? 0) > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Stops:</p>
                <div className="flex flex-wrap gap-1">
                  {route?.stops?.slice(0, 4)?.map((s: any, idx: number) => (
                    <span key={s?.id ?? idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{s?.name}</span>
                  )) ?? null}
                  {(route?.stops?.length ?? 0) > 4 && <span className="px-2 py-1 text-xs text-gray-500">+{(route?.stops?.length ?? 0) - 4} more</span>}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: true, route })} className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(route?.id)} className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        )) ?? null}
      </div>

      {modal.open && <RouteModal route={modal.route} onClose={() => setModal({ open: false, route: null })} onSave={handleSave} />}
    </div>
  );
}

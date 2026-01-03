"use client";
import { useState } from "react";
import { Bus, Plus, Edit, Trash2, Users, Route, Search } from "lucide-react";
import { motion } from "framer-motion";
import BusModal from "./bus-modal";

interface Props {
  buses: any[];
  routes: any[];
  availableDrivers: any[];
}

export default function BusesClient({ buses, routes, availableDrivers }: Props) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; bus: any | null }>({ open: false, bus: null });
  const [busList, setBusList] = useState(buses ?? []);

  const filtered = busList?.filter((b: any) =>
    (b?.vehicleId?.toLowerCase()?.includes(search?.toLowerCase() ?? "") ?? false) ||
    (b?.plateNumber?.toLowerCase()?.includes(search?.toLowerCase() ?? "") ?? false)
  ) ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;
    const res = await fetch(`/api/buses/${id}`, { method: "DELETE" });
    if (res.ok) setBusList((prev: any[]) => prev?.filter((b: any) => b?.id !== id) ?? []);
  };

  const handleSave = (bus: any) => {
    if (modal.bus) {
      setBusList((prev: any[]) => prev?.map((b: any) => (b?.id === bus?.id ? bus : b)) ?? []);
    } else {
      setBusList((prev: any[]) => [...(prev ?? []), bus]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bus Management</h1>
          <p className="text-gray-500">Manage your fleet of school buses</p>
        </div>
        <button onClick={() => setModal({ open: true, bus: null })} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Bus
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search buses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((bus: any, i: number) => (
          <motion.div
            key={bus?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Bus className="text-amber-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{bus?.vehicleId}</h3>
                  <p className="text-sm text-gray-500">{bus?.plateNumber}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${bus?.status === "ACTIVE" ? "bg-green-100 text-green-700" : bus?.status === "MAINTENANCE" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
                {bus?.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} />
                <span>Capacity: {bus?.capacity} • Students: {bus?._count?.students ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Route size={16} />
                <span>Route: {bus?.route?.name ?? "Not Assigned"}</span>
              </div>
              <p className="text-gray-600">Driver: {bus?.driver?.user?.name ?? "Not Assigned"}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setModal({ open: true, bus })} className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(bus?.id)} className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        )) ?? null}
      </div>

      {modal.open && (
        <BusModal
          bus={modal.bus}
          routes={routes}
          availableDrivers={availableDrivers}
          onClose={() => setModal({ open: false, bus: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

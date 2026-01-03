"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  bus: any | null;
  routes: any[];
  availableDrivers: any[];
  onClose: () => void;
  onSave: (bus: any) => void;
}

export default function BusModal({ bus, routes, availableDrivers, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    vehicleId: bus?.vehicleId ?? "",
    plateNumber: bus?.plateNumber ?? "",
    capacity: bus?.capacity ?? 40,
    status: bus?.status ?? "ACTIVE",
    routeId: bus?.routeId ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = bus ? "PUT" : "POST";
      const url = bus ? `/api/buses/${bus.id}` : "/api/buses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, routeId: form.routeId || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d?.error || "Failed to save");
        return;
      }
      const saved = await res.json();
      onSave(saved);
      onClose();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded">
          <X size={20} className="text-gray-500" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{bus ? "Edit Bus" : "Add New Bus"}</h2>
        {error && <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
            <input type="text" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
            <input type="text" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <select value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="">No Route</option>
              {routes?.map((r: any) => <option key={r?.id} value={r?.id}>{r?.name}</option>) ?? null}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

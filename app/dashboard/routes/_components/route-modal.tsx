"use client";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface Props { route: any | null; onClose: () => void; onSave: (route: any) => void; }

export default function RouteModal({ route, onClose, onSave }: Props) {
  const [form, setForm] = useState({ name: route?.name ?? "", startTime: route?.startTime ?? "07:00", endTime: route?.endTime ?? "08:30" });
  const [stops, setStops] = useState<any[]>(route?.stops ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addStop = () => setStops([...stops, { name: "", latitude: 0, longitude: 0, stopOrder: stops.length + 1 }]);
  const removeStop = (idx: number) => setStops(stops.filter((_, i) => i !== idx));
  const updateStop = (idx: number, field: string, value: any) => {
    const updated = [...stops];
    updated[idx] = { ...updated[idx], [field]: value };
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = route ? "PUT" : "POST";
      const url = route ? `/api/routes/${route.id}` : "/api/routes";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stops: stops.map((s, i) => ({ ...s, stopOrder: i + 1 })) }),
      });
      if (!res.ok) { setError("Failed to save"); return; }
      const saved = await res.json();
      onSave(saved);
      onClose();
    } catch { setError("An error occurred"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"><X size={20} className="text-gray-500" /></button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{route ? "Edit Route" : "Add New Route"}</h2>
        {error && <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Stops</label>
              <button type="button" onClick={addStop} className="text-sm text-amber-600 flex items-center gap-1"><Plus size={14} /> Add Stop</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stops.map((stop, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                  <input type="text" placeholder="Stop name" value={stop.name} onChange={(e) => updateStop(idx, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" step="any" placeholder="Lat" value={stop.latitude} onChange={(e) => updateStop(idx, "latitude", parseFloat(e.target.value) || 0)} className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input type="number" step="any" placeholder="Lng" value={stop.longitude} onChange={(e) => updateStop(idx, "longitude", parseFloat(e.target.value) || 0)} className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeStop(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
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

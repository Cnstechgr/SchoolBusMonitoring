"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props { student: any | null; buses: any[]; parents: any[]; onClose: () => void; onSave: (s: any) => void; }

export default function StudentModal({ student, buses, parents, onClose, onSave }: Props) {
  const [form, setForm] = useState({ name: student?.name ?? "", grade: student?.grade ?? "", parentId: student?.parentId ?? "", busId: student?.busId ?? "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const method = student ? "PUT" : "POST";
      const url = student ? `/api/students/${student.id}` : "/api/students";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, busId: form.busId || null }) });
      if (!res.ok) { setError("Failed to save"); return; }
      const saved = await res.json();
      onSave(saved); onClose();
    } catch { setError("An error occurred"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded"><X size={20} className="text-gray-500" /></button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{student ? "Edit Student" : "Add Student"}</h2>
        {error && <p className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="e.g., 5th Grade" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
            <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white" required>
              <option value="">Select Parent</option>
              {parents?.map((p: any) => <option key={p?.id} value={p?.id}>{p?.name} ({p?.email})</option>) ?? null}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Bus</label>
            <select value={form.busId} onChange={(e) => setForm({ ...form, busId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="">No Bus Assigned</option>
              {buses?.map((b: any) => <option key={b?.id} value={b?.id}>{b?.vehicleId} - {b?.plateNumber}</option>) ?? null}
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

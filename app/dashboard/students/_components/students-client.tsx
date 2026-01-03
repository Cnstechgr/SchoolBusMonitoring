"use client";
import { useState } from "react";
import { Users, Plus, Edit, Trash2, Bus, UserCircle, Search, Clock } from "lucide-react";
import { motion } from "framer-motion";
import StudentModal from "./student-modal";

interface Props { students: any[]; buses: any[]; parents: any[]; role: string; }

export default function StudentsClient({ students, buses, parents, role }: Props) {
  const [studentList, setStudentList] = useState(students ?? []);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null });
  const canEdit = role === "ADMIN" || role === "STAFF";

  const filtered = studentList?.filter((s: any) => s?.name?.toLowerCase()?.includes(search?.toLowerCase() ?? "") ?? false) ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) setStudentList((p: any[]) => p?.filter((s: any) => s?.id !== id) ?? []);
  };

  const handleSave = (student: any) => {
    if (modal.student) setStudentList((p: any[]) => p?.map((s: any) => (s?.id === student?.id ? student : s)) ?? []);
    else setStudentList((p: any[]) => [...(p ?? []), student]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{role === "PARENT" ? "My Children" : "Student Management"}</h1>
          <p className="text-gray-500">{role === "PARENT" ? "View your children's bus assignments" : "Manage students and bus assignments"}</p>
        </div>
        {canEdit && (
          <button onClick={() => setModal({ open: true, student: null })} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Student
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((student: any, i: number) => (
          <motion.div key={student?.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{student?.name}</h3>
                  <p className="text-sm text-gray-500">{student?.grade}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Bus size={16} />
                <span>Bus: {student?.bus?.vehicleId ?? "Not Assigned"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <UserCircle size={16} />
                <span>Parent: {student?.parent?.name ?? "N/A"}</span>
              </div>
            </div>
            {(student?.boardingEvents?.length ?? 0) > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Clock size={12} /> Recent Activity</p>
                {student?.boardingEvents?.slice(0, 2)?.map((e: any) => (
                  <p key={e?.id} className="text-xs text-gray-600">
                    {e?.type === "BOARD" ? "🚌 Boarded" : "🚶 Alighted"} at {e?.stopName ?? "stop"}
                  </p>
                )) ?? null}
              </div>
            )}
            {canEdit && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => setModal({ open: true, student })} className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(student?.id)} className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </motion.div>
        )) ?? null}
      </div>

      {modal.open && canEdit && <StudentModal student={modal.student} buses={buses} parents={parents} onClose={() => setModal({ open: false, student: null })} onSave={handleSave} />}
    </div>
  );
}

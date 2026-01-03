"use client";
import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Info, Bus } from "lucide-react";
import { motion } from "framer-motion";

interface Props { notifications: any[]; }

export default function NotificationsClient({ notifications }: Props) {
  const [notifList, setNotifList] = useState(notifications ?? []);

  const handleMarkRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    if (res.ok) setNotifList((p: any[]) => p?.map((n: any) => (n?.id === id ? { ...n, read: true } : n)) ?? []);
  };

  const handleMarkAllRead = async () => {
    const res = await fetch("/api/notifications/mark-all-read", { method: "POST" });
    if (res.ok) setNotifList((p: any[]) => p?.map((n: any) => ({ ...n, read: true })) ?? []);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    if (res.ok) setNotifList((p: any[]) => p?.filter((n: any) => n?.id !== id) ?? []);
  };

  const getIcon = (type: string) => {
    if (type === "ALERT") return <AlertTriangle size={18} className="text-red-500" />;
    if (type === "BOARDING") return <Bus size={18} className="text-green-500" />;
    return <Info size={18} className="text-blue-500" />;
  };

  const unreadCount = notifList?.filter((n: any) => !n?.read)?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary flex items-center gap-2">
            <CheckCheck size={18} /> Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifList?.map((notif: any, i: number) => (
          <motion.div
            key={notif?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`p-4 rounded-xl shadow-md transition-all ${notif?.read ? "bg-white" : "bg-amber-50 border-l-4 border-amber-500"}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{getIcon(notif?.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{notif?.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notif?.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(notif?.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notif?.read && (
                  <button onClick={() => handleMarkRead(notif?.id)} className="p-2 hover:bg-green-100 rounded-lg transition" title="Mark as read">
                    <Check size={16} className="text-green-600" />
                  </button>
                )}
                <button onClick={() => handleDelete(notif?.id)} className="p-2 hover:bg-red-100 rounded-lg transition" title="Delete">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )) ?? null}
        {notifList?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

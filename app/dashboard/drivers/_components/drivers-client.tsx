"use client";
import { useState } from "react";
import { UserCircle, Bus, Award, AlertTriangle, Phone, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Props { drivers: any[]; }

export default function DriversClient({ drivers }: Props) {
  const [driverList] = useState(drivers ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <p className="text-gray-500">View and manage bus drivers</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {driverList?.map((driver: any, i: number) => {
          const latestBehavior = driver?.behaviorMetrics?.[0];
          const score = latestBehavior?.overallScore ?? 0;
          const scoreColor = score >= 85 ? "text-green-600 bg-green-100" : score >= 70 ? "text-amber-600 bg-amber-100" : "text-red-600 bg-red-100";
          return (
            <motion.div key={driver?.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserCircle className="text-purple-600" size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{driver?.user?.name}</h3>
                    <p className="text-sm text-gray-500">License: {driver?.licenseNumber}</p>
                  </div>
                </div>
                {latestBehavior && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${scoreColor}`}>
                    {score?.toFixed?.(0) ?? 0}%
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span>{driver?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span>{driver?.user?.phone ?? "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Bus size={16} />
                  <span>Bus: {driver?.bus?.vehicleId ?? "Not Assigned"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>License Exp: {driver?.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
              {latestBehavior && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Award size={12} /> Behavior Metrics</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-gray-800">{latestBehavior?.speedScore?.toFixed?.(0) ?? 0}</p>
                      <p className="text-xs text-gray-500">Speed</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-gray-800">{latestBehavior?.brakingScore?.toFixed?.(0) ?? 0}</p>
                      <p className="text-xs text-gray-500">Braking</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-red-600">{latestBehavior?.violations ?? 0}</p>
                      <p className="text-xs text-gray-500">Violations</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        }) ?? null}
      </div>
    </div>
  );
}

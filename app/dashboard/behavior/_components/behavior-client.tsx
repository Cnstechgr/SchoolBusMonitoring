"use client";
import { useState } from "react";
import { Activity, Award, TrendingUp, TrendingDown, AlertTriangle, Gauge, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Props { drivers: any[]; role: string; }

export default function BehaviorClient({ drivers, role }: Props) {
  const [selected, setSelected] = useState<any>(drivers?.[0] ?? null);

  const chartData = selected?.behaviorMetrics?.map((m: any, i: number) => ({
    day: `Day ${(selected?.behaviorMetrics?.length ?? 0) - i}`,
    speed: m?.speedScore ?? 0,
    braking: m?.brakingScore ?? 0,
    overall: m?.overallScore ?? 0,
  }))?.reverse() ?? [];

  const latest = selected?.behaviorMetrics?.[0];
  const avgScore = latest?.overallScore ?? 0;
  const scoreColor = avgScore >= 85 ? "text-green-600" : avgScore >= 70 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Driver Behavior Monitoring</h1>
        <p className="text-gray-500">Track and analyze driver performance metrics</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-gray-800">Drivers</h3>
          {drivers?.map((driver: any) => {
            const score = driver?.behaviorMetrics?.[0]?.overallScore ?? 0;
            return (
              <motion.div
                key={driver?.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelected(driver)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selected?.id === driver?.id ? "bg-amber-100 border-2 border-amber-500" : "bg-white shadow-md hover:shadow-lg"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserCircle className="text-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{driver?.user?.name}</p>
                    <p className="text-xs text-gray-500">{driver?.bus?.vehicleId ?? "No Bus"}</p>
                  </div>
                  <div className={`text-lg font-bold ${score >= 85 ? "text-green-600" : score >= 70 ? "text-amber-600" : "text-red-600"}`}>
                    {score?.toFixed?.(0) ?? 0}%
                  </div>
                </div>
              </motion.div>
            );
          }) ?? null}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {selected ? (
            <>
              <div className="grid sm:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Overall Score</p>
                      <p className={`text-3xl font-bold ${scoreColor}`}>{avgScore?.toFixed?.(1) ?? 0}%</p>
                    </div>
                    <Award className="text-purple-500" size={32} />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Speed Score</p>
                      <p className="text-3xl font-bold text-blue-600">{latest?.speedScore?.toFixed?.(1) ?? 0}%</p>
                    </div>
                    <Gauge className="text-blue-500" size={32} />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Braking Score</p>
                      <p className="text-3xl font-bold text-green-600">{latest?.brakingScore?.toFixed?.(1) ?? 0}%</p>
                    </div>
                    <Activity className="text-green-500" size={32} />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Violations</p>
                      <p className="text-3xl font-bold text-red-600">{latest?.violations ?? 0}</p>
                    </div>
                    <AlertTriangle className="text-red-500" size={32} />
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Performance Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="top" />
                      <Line type="monotone" dataKey="overall" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Overall" />
                      <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} dot={false} name="Speed" />
                      <Line type="monotone" dataKey="braking" stroke="#22c55e" strokeWidth={2} dot={false} name="Braking" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a driver to view behavior metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

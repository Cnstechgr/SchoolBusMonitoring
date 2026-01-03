import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import DashboardClient from "./_components/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role || "PARENT";
  const userId = (session?.user as any)?.id;

  const [buses, alerts, students, drivers, trips, gpsData] = await Promise.all([
    prisma.bus.findMany({ include: { route: true, driver: { include: { user: true } } } }),
    prisma.alert.findMany({ where: { resolved: false }, orderBy: { createdAt: "desc" }, take: 10, include: { bus: true } }),
    role === "PARENT"
      ? prisma.student.findMany({ where: { parentId: userId }, include: { bus: true } })
      : prisma.student.findMany({ include: { bus: true } }),
    prisma.driver.findMany({ include: { user: true, bus: true } }),
    prisma.trip.findMany({ where: { status: "IN_PROGRESS" }, include: { bus: true, driver: { include: { user: true } } } }),
    prisma.gPSLocation.findMany({ orderBy: { timestamp: "desc" }, take: 10 }),
  ]);

  const stats = {
    totalBuses: buses?.length ?? 0,
    activeBuses: buses?.filter((b) => b?.status === "ACTIVE")?.length ?? 0,
    totalStudents: students?.length ?? 0,
    totalDrivers: drivers?.length ?? 0,
    activeAlerts: alerts?.length ?? 0,
    tripsToday: trips?.length ?? 0,
  };

  return (
    <DashboardClient
      stats={stats}
      alerts={JSON.parse(JSON.stringify(alerts ?? []))}
      buses={JSON.parse(JSON.stringify(buses ?? []))}
      trips={JSON.parse(JSON.stringify(trips ?? []))}
      role={role}
      students={role === "PARENT" ? JSON.parse(JSON.stringify(students ?? [])) : []}
    />
  );
}

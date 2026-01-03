import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import BusesClient from "./_components/buses-client";

export const dynamic = "force-dynamic";

export default async function BusesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "STAFF") redirect("/dashboard");

  const [buses, routes, drivers] = await Promise.all([
    prisma.bus.findMany({ include: { route: true, driver: { include: { user: true } }, _count: { select: { students: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.route.findMany(),
    prisma.driver.findMany({ where: { busId: null }, include: { user: true } }),
  ]);

  return <BusesClient buses={JSON.parse(JSON.stringify(buses ?? []))} routes={JSON.parse(JSON.stringify(routes ?? []))} availableDrivers={JSON.parse(JSON.stringify(drivers ?? []))} />;
}

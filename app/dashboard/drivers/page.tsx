import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DriversClient from "./_components/drivers-client";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "STAFF") redirect("/dashboard");

  const drivers = await prisma.driver.findMany({ include: { user: true, bus: true, behaviorMetrics: { orderBy: { recordedAt: "desc" }, take: 1 } } });
  return <DriversClient drivers={JSON.parse(JSON.stringify(drivers ?? []))} />;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import BehaviorClient from "./_components/behavior-client";

export const dynamic = "force-dynamic";

export default async function BehaviorPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (role === "PARENT") redirect("/dashboard");

  let drivers;
  if (role === "DRIVER") {
    const driver = await prisma.driver.findFirst({ where: { userId }, include: { user: true, bus: true, behaviorMetrics: { orderBy: { recordedAt: "desc" }, take: 30 } } });
    drivers = driver ? [driver] : [];
  } else {
    drivers = await prisma.driver.findMany({ include: { user: true, bus: true, behaviorMetrics: { orderBy: { recordedAt: "desc" }, take: 30 } } });
  }

  return <BehaviorClient drivers={JSON.parse(JSON.stringify(drivers ?? []))} role={role} />;
}

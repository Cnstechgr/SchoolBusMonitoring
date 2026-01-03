import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import MapClient from "./_components/map-client";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  let buses;
  if (role === "PARENT") {
    const students = await prisma.student.findMany({ where: { parentId: userId }, select: { busId: true } });
    const busIds = students?.map((s) => s?.busId)?.filter(Boolean) as string[];
    buses = await prisma.bus.findMany({ where: { id: { in: busIds } }, include: { gpsLocations: { orderBy: { timestamp: "desc" }, take: 1 }, route: { include: { stops: true } }, driver: { include: { user: true } } } });
  } else if (role === "DRIVER") {
    const driver = await prisma.driver.findFirst({ where: { userId } });
    buses = driver?.busId ? await prisma.bus.findMany({ where: { id: driver.busId }, include: { gpsLocations: { orderBy: { timestamp: "desc" }, take: 1 }, route: { include: { stops: true } }, driver: { include: { user: true } } } }) : [];
  } else {
    buses = await prisma.bus.findMany({ include: { gpsLocations: { orderBy: { timestamp: "desc" }, take: 1 }, route: { include: { stops: true } }, driver: { include: { user: true } } } });
  }

  return <MapClient buses={JSON.parse(JSON.stringify(buses ?? []))} />;
}

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({ include: { route: true, driver: { include: { user: true } }, _count: { select: { students: true } } } });
    return NextResponse.json(buses ?? []);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch buses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const body = await req.json();
    const { vehicleId, plateNumber, capacity, status, routeId } = body ?? {};
    const bus = await prisma.bus.create({
      data: { vehicleId, plateNumber, capacity, status, routeId: routeId || null },
      include: { route: true, driver: { include: { user: true } }, _count: { select: { students: true } } },
    });
    return NextResponse.json(bus);
  } catch (e: any) {
    console.error(e);
    if (e?.code === "P2002") return NextResponse.json({ error: "Vehicle ID or Plate already exists" }, { status: 400 });
    return NextResponse.json({ error: "Failed to create bus" }, { status: 500 });
  }
}

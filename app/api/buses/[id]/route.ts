export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const body = await req.json();
    const { vehicleId, plateNumber, capacity, status, routeId } = body ?? {};
    const bus = await prisma.bus.update({
      where: { id: params?.id },
      data: { vehicleId, plateNumber, capacity, status, routeId: routeId || null },
      include: { route: true, driver: { include: { user: true } }, _count: { select: { students: true } } },
    });
    return NextResponse.json(bus);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update bus" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await prisma.bus.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete bus" }, { status: 500 });
  }
}

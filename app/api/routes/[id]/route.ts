export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { name, startTime, endTime, stops } = await req.json();
    await prisma.routeStop.deleteMany({ where: { routeId: params?.id } });
    const route = await prisma.route.update({
      where: { id: params?.id },
      data: {
        name, startTime, endTime,
        stops: { create: stops?.map((s: any, i: number) => ({ name: s.name, latitude: s.latitude, longitude: s.longitude, stopOrder: i + 1 })) ?? [] },
      },
      include: { stops: { orderBy: { stopOrder: "asc" } }, _count: { select: { buses: true } } },
    });
    return NextResponse.json(route);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await prisma.route.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET() {
  const routes = await prisma.route.findMany({ include: { stops: { orderBy: { stopOrder: "asc" } }, _count: { select: { buses: true } } } });
  return NextResponse.json(routes ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { name, startTime, endTime, stops } = await req.json();
    const route = await prisma.route.create({
      data: {
        name, startTime, endTime,
        stops: { create: stops?.map((s: any, i: number) => ({ name: s.name, latitude: s.latitude, longitude: s.longitude, stopOrder: i + 1 })) ?? [] },
      },
      include: { stops: { orderBy: { stopOrder: "asc" } }, _count: { select: { buses: true } } },
    });
    return NextResponse.json(route);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

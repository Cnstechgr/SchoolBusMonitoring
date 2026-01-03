export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const alert = await prisma.alert.update({ where: { id: params?.id }, data: { resolved: true, resolvedAt: new Date() } });
    return NextResponse.json(alert);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const alerts = await prisma.alert.findMany({ orderBy: { createdAt: "desc" }, include: { bus: true }, take: 100 });
  return NextResponse.json(alerts ?? []);
}

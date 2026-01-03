export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { name, grade, parentId, busId } = await req.json();
    const student = await prisma.student.update({ where: { id: params?.id }, data: { name, grade, parentId, busId: busId || null }, include: { bus: true, parent: true, boardingEvents: true } });
    return NextResponse.json(student);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "STAFF") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    await prisma.student.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

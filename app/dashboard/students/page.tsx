import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import StudentsClient from "./_components/students-client";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  const [students, buses, parents] = await Promise.all([
    role === "PARENT"
      ? prisma.student.findMany({ where: { parentId: userId }, include: { bus: true, parent: true, boardingEvents: { orderBy: { timestamp: "desc" }, take: 5 } } })
      : prisma.student.findMany({ include: { bus: true, parent: true, boardingEvents: { orderBy: { timestamp: "desc" }, take: 5 } } }),
    prisma.bus.findMany({ where: { status: "ACTIVE" } }),
    role === "ADMIN" || role === "STAFF" ? prisma.user.findMany({ where: { role: "PARENT" } }) : [],
  ]);

  return <StudentsClient students={JSON.parse(JSON.stringify(students ?? []))} buses={JSON.parse(JSON.stringify(buses ?? []))} parents={JSON.parse(JSON.stringify(parents ?? []))} role={role} />;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import AlertsClient from "./_components/alerts-client";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  let alerts;
  if (role === "PARENT") {
    const students = await prisma.student.findMany({ where: { parentId: userId }, select: { busId: true } });
    const busIds = students?.map((s) => s?.busId)?.filter(Boolean) as string[];
    alerts = await prisma.alert.findMany({ where: { busId: { in: busIds } }, orderBy: { createdAt: "desc" }, include: { bus: true } });
  } else {
    alerts = await prisma.alert.findMany({ orderBy: { createdAt: "desc" }, include: { bus: true } });
  }

  return <AlertsClient alerts={JSON.parse(JSON.stringify(alerts ?? []))} role={role} />;
}

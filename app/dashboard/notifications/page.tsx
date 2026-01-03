import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import NotificationsClient from "./_components/notifications-client";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const notifications = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
  return <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications ?? []))} />;
}

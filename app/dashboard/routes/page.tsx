import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import RoutesClient from "./_components/routes-client";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "STAFF") redirect("/dashboard");

  const routes = await prisma.route.findMany({ include: { stops: { orderBy: { stopOrder: "asc" } }, _count: { select: { buses: true } } }, orderBy: { name: "asc" } });
  return <RoutesClient routes={JSON.parse(JSON.stringify(routes ?? []))} />;
}

export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { AlertType, AlertPriority } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { action } = await req.json();

    if (action === "update_gps") {
      const buses = await prisma.bus.findMany({ where: { status: "ACTIVE" } });
      for (const bus of buses) {
        const lastLoc = await prisma.gPSLocation.findFirst({ where: { busId: bus.id }, orderBy: { timestamp: "desc" } });
        const lat = (lastLoc?.latitude ?? 37.78) + (Math.random() - 0.5) * 0.01;
        const lon = (lastLoc?.longitude ?? -122.42) + (Math.random() - 0.5) * 0.01;
        const speed = 20 + Math.random() * 40;
        const heading = Math.random() * 360;
        await prisma.gPSLocation.create({ data: { busId: bus.id, latitude: lat, longitude: lon, speed, heading } });
      }
      return NextResponse.json({ message: "GPS locations updated" });
    }

    if (action === "simulate_alert") {
      const buses = await prisma.bus.findMany({ where: { status: "ACTIVE" } });
      const bus = buses[Math.floor(Math.random() * buses.length)];
      const types = [AlertType.SPEEDING, AlertType.SMOKE, AlertType.ALCOHOL];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages: Record<string, string> = {
        SPEEDING: `Bus ${bus?.vehicleId} exceeded speed limit (${(65 + Math.random() * 20).toFixed(0)} km/h)`,
        SMOKE: `Smoke detected in Bus ${bus?.vehicleId}`,
        ALCOHOL: `Alcohol detected in Bus ${bus?.vehicleId}`,
      };
      const alert = await prisma.alert.create({
        data: {
          type,
          priority: type === AlertType.SPEEDING ? AlertPriority.WARNING : AlertPriority.CRITICAL,
          busId: bus?.id,
          message: messages[type] ?? "Alert",
          latitude: 37.78 + Math.random() * 0.05,
          longitude: -122.42 + Math.random() * 0.05,
        },
        include: { bus: true },
      });

      // Create notifications for parents of students on this bus
      const students = await prisma.student.findMany({ where: { busId: bus?.id }, include: { parent: true } });
      for (const student of students) {
        await prisma.notification.create({
          data: {
            userId: student.parentId,
            title: `${type} Alert`,
            message: messages[type] ?? "Alert on your child's bus",
            type: "ALERT",
          },
        });
      }

      return NextResponse.json({ message: "Alert simulated", alert });
    }

    if (action === "simulate_accident") {
      const buses = await prisma.bus.findMany({ where: { status: "ACTIVE" } });
      const bus = buses[Math.floor(Math.random() * buses.length)];
      const gForce = 3.0 + Math.random() * 2;
      const alert = await prisma.alert.create({
        data: {
          type: AlertType.ACCIDENT,
          priority: AlertPriority.CRITICAL,
          busId: bus?.id,
          message: `Possible accident detected on Bus ${bus?.vehicleId} - high G-force (${gForce.toFixed(1)}G)`,
          latitude: 37.78 + Math.random() * 0.05,
          longitude: -122.42 + Math.random() * 0.05,
          gForce,
        },
        include: { bus: true },
      });

      // Notify all admins and parents of students on this bus
      const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
      const students = await prisma.student.findMany({ where: { busId: bus?.id } });
      const userIds = [...admins.map((a) => a.id), ...students.map((s) => s.parentId)];
      for (const userId of userIds) {
        await prisma.notification.create({
          data: {
            userId,
            title: "EMERGENCY: Accident Alert",
            message: `Possible accident detected on Bus ${bus?.vehicleId}. Emergency services may be required.`,
            type: "ALERT",
          },
        });
      }

      return NextResponse.json({ message: "Accident simulated", alert });
    }

    if (action === "update_behavior") {
      const drivers = await prisma.driver.findMany();
      for (const driver of drivers) {
        const last = await prisma.driverBehavior.findFirst({ where: { driverId: driver.id }, orderBy: { recordedAt: "desc" } });
        const speedScore = Math.max(60, Math.min(100, (last?.speedScore ?? 85) + (Math.random() - 0.5) * 10));
        const brakingScore = Math.max(60, Math.min(100, (last?.brakingScore ?? 85) + (Math.random() - 0.5) * 10));
        const overallScore = (speedScore + brakingScore) / 2;
        const violations = Math.max(0, (last?.violations ?? 0) + (Math.random() > 0.8 ? 1 : 0));
        await prisma.driverBehavior.create({ data: { driverId: driver.id, speedScore, brakingScore, overallScore, violations } });
      }
      return NextResponse.json({ message: "Driver behavior updated" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

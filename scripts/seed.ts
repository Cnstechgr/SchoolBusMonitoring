import { PrismaClient, UserRole, AlertType, AlertPriority, BusStatus, TripStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create users
  const adminPassword = await bcrypt.hash("johndoe123", 10);
  const parentPassword = await bcrypt.hash("parent123", 10);
  const driverPassword = await bcrypt.hash("driver123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: { email: "john@doe.com", password: adminPassword, name: "John Admin", role: UserRole.ADMIN, phone: "+1234567890" },
  });

  const parent1 = await prisma.user.upsert({
    where: { email: "parent@example.com" },
    update: {},
    create: { email: "parent@example.com", password: parentPassword, name: "Sarah Johnson", role: UserRole.PARENT, phone: "+1234567891" },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: "parent2@example.com" },
    update: {},
    create: { email: "parent2@example.com", password: parentPassword, name: "Mike Williams", role: UserRole.PARENT, phone: "+1234567892" },
  });

  const driverUser1 = await prisma.user.upsert({
    where: { email: "driver@example.com" },
    update: {},
    create: { email: "driver@example.com", password: driverPassword, name: "Robert Brown", role: UserRole.DRIVER, phone: "+1234567893" },
  });

  const driverUser2 = await prisma.user.upsert({
    where: { email: "driver2@example.com" },
    update: {},
    create: { email: "driver2@example.com", password: driverPassword, name: "James Wilson", role: UserRole.DRIVER, phone: "+1234567894" },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: { email: "staff@example.com", password: staffPassword, name: "Emily Davis", role: UserRole.STAFF, phone: "+1234567895" },
  });

  // Create routes
  const route1 = await prisma.route.upsert({
    where: { id: "route1" },
    update: {},
    create: { id: "route1", name: "North District Route", startTime: "07:00", endTime: "08:30" },
  });

  const route2 = await prisma.route.upsert({
    where: { id: "route2" },
    update: {},
    create: { id: "route2", name: "South District Route", startTime: "07:15", endTime: "08:45" },
  });

  // Create route stops
  const stops1 = [
    { routeId: "route1", name: "Oak Street Stop", latitude: 37.7749, longitude: -122.4194, stopOrder: 1 },
    { routeId: "route1", name: "Pine Avenue Stop", latitude: 37.7799, longitude: -122.4294, stopOrder: 2 },
    { routeId: "route1", name: "Maple Drive Stop", latitude: 37.7849, longitude: -122.4094, stopOrder: 3 },
    { routeId: "route1", name: "School Main Gate", latitude: 37.7899, longitude: -122.3994, stopOrder: 4 },
  ];

  const stops2 = [
    { routeId: "route2", name: "Cedar Lane Stop", latitude: 37.7649, longitude: -122.4494, stopOrder: 1 },
    { routeId: "route2", name: "Birch Street Stop", latitude: 37.7699, longitude: -122.4394, stopOrder: 2 },
    { routeId: "route2", name: "School South Gate", latitude: 37.7899, longitude: -122.4094, stopOrder: 3 },
  ];

  await prisma.routeStop.deleteMany({});
  for (const stop of [...stops1, ...stops2]) {
    await prisma.routeStop.create({ data: stop });
  }

  // Create buses
  const bus1 = await prisma.bus.upsert({
    where: { vehicleId: "BUS001" },
    update: {},
    create: { id: "bus1", vehicleId: "BUS001", plateNumber: "ABC-1234", capacity: 45, status: BusStatus.ACTIVE, routeId: "route1" },
  });

  const bus2 = await prisma.bus.upsert({
    where: { vehicleId: "BUS002" },
    update: {},
    create: { id: "bus2", vehicleId: "BUS002", plateNumber: "XYZ-5678", capacity: 40, status: BusStatus.ACTIVE, routeId: "route2" },
  });

  const bus3 = await prisma.bus.upsert({
    where: { vehicleId: "BUS003" },
    update: {},
    create: { id: "bus3", vehicleId: "BUS003", plateNumber: "DEF-9012", capacity: 50, status: BusStatus.MAINTENANCE },
  });

  // Create drivers
  await prisma.driver.deleteMany({});
  const driver1 = await prisma.driver.create({
    data: {
      userId: driverUser1.id,
      licenseNumber: "DL-12345",
      licenseExpiry: new Date("2026-12-31"),
      busId: "bus1",
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      userId: driverUser2.id,
      licenseNumber: "DL-67890",
      licenseExpiry: new Date("2025-06-30"),
      busId: "bus2",
    },
  });

  // Create students
  await prisma.student.deleteMany({});
  const student1 = await prisma.student.create({
    data: { name: "Tommy Johnson", grade: "5th Grade", parentId: parent1.id, busId: "bus1" },
  });

  const student2 = await prisma.student.create({
    data: { name: "Emma Johnson", grade: "3rd Grade", parentId: parent1.id, busId: "bus1" },
  });

  const student3 = await prisma.student.create({
    data: { name: "Lucas Williams", grade: "4th Grade", parentId: parent2.id, busId: "bus2" },
  });

  // Create GPS locations (last known)
  await prisma.gPSLocation.deleteMany({});
  await prisma.gPSLocation.createMany({
    data: [
      { busId: "bus1", latitude: 37.7789, longitude: -122.4244, speed: 35, heading: 90 },
      { busId: "bus2", latitude: 37.7679, longitude: -122.4444, speed: 28, heading: 180 },
    ],
  });

  // Create alerts
  await prisma.alert.deleteMany({});
  await prisma.alert.createMany({
    data: [
      { type: AlertType.SPEEDING, priority: AlertPriority.WARNING, busId: "bus1", message: "Bus BUS001 exceeded speed limit (72 km/h)", latitude: 37.7789, longitude: -122.4244 },
      { type: AlertType.SMOKE, priority: AlertPriority.CRITICAL, busId: "bus2", message: "Smoke detected in Bus BUS002", latitude: 37.7679, longitude: -122.4444, resolved: true, resolvedAt: new Date() },
      { type: AlertType.ACCIDENT, priority: AlertPriority.CRITICAL, busId: "bus1", message: "Possible accident detected - high G-force (3.2G)", latitude: 37.7799, longitude: -122.4294, gForce: 3.2, resolved: true, resolvedAt: new Date() },
    ],
  });

  // Create driver behavior metrics
  await prisma.driverBehavior.createMany({
    data: [
      { driverId: driver1.id, speedScore: 85, brakingScore: 90, overallScore: 87, violations: 2 },
      { driverId: driver2.id, speedScore: 92, brakingScore: 88, overallScore: 90, violations: 1 },
    ],
  });

  // Create trips
  await prisma.trip.deleteMany({});
  const trip1 = await prisma.trip.create({
    data: {
      busId: "bus1",
      driverId: driver1.id,
      status: TripStatus.IN_PROGRESS,
      startTime: new Date(new Date().setHours(7, 0, 0)),
    },
  });

  // Create boarding events
  await prisma.boardingEvent.createMany({
    data: [
      { tripId: trip1.id, studentId: student1.id, type: "BOARD", stopName: "Oak Street Stop" },
      { tripId: trip1.id, studentId: student2.id, type: "BOARD", stopName: "Oak Street Stop" },
    ],
  });

  // Create notifications
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      { userId: parent1.id, title: "Child Boarded", message: "Tommy has boarded Bus BUS001 at Oak Street Stop", type: "BOARDING" },
      { userId: parent1.id, title: "Speed Alert", message: "Bus BUS001 exceeded speed limit. Current speed: 72 km/h", type: "ALERT" },
      { userId: admin.id, title: "System Alert", message: "Bus BUS003 scheduled for maintenance", type: "SYSTEM" },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

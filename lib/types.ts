import { UserRole, AlertType, AlertPriority, BusStatus, TripStatus } from "@prisma/client";

export type { UserRole, AlertType, AlertPriority, BusStatus, TripStatus };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface DashboardStats {
  totalBuses: number;
  activeBuses: number;
  totalStudents: number;
  totalDrivers: number;
  activeAlerts: number;
  tripsToday: number;
}

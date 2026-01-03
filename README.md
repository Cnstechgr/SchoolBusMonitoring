# School Bus Monitoring System

A comprehensive IoT-based solution for tracking school buses, monitoring driver behavior, and ensuring child safety.

## 🌐 Live Demo

**[https://busmon.site](https://busmon.site)**

## Features

- **Multi-role Authentication**: Admin, Parent, Driver, and Staff roles
- **Bus Management**: Track and manage bus fleet
- **Route Management**: Define routes with GPS stops
- **Student Tracking**: Monitor student boarding/alighting
- **Alert System**: Accident detection, speeding, smoke/alcohol alerts
- **Driver Behavior Monitoring**: Track safety scores and violations
- **GPS Location Tracking**: View last known bus locations on map
- **Notifications**: In-app and email notifications for alerts

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- NextAuth.js
- Plotly.js (for maps)

## Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Set up environment variables (copy `.env.example` to `.env`)
4. Run Prisma migrations: `yarn prisma migrate dev`
5. Seed the database: `yarn prisma db seed`
6. Start the dev server: `yarn dev`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Parent | parent@example.com | parent123 |
| Driver | driver@example.com | driver123 |
| Staff | staff@example.com | staff123 |

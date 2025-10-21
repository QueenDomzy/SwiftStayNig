import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// 🧩 Route imports
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";
import bookingRoutes from "./routes/booking";
import paymentRoutes from "./routes/payment";
import onboardingRoutes from "./routes/onboarding";
import aiRoutes from "./routes/ai";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

/* ✅ Global Middlewares */
app.use(cors());
app.use(express.json());

/* 🩵 Health Check */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "🏡 SwiftStay API is running smoothly ✅",
    version: "1.0.0",
  });
});

/* ✅ Mount routes */
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/ai", aiRoutes);

/* 🧹 Global Error Handler */
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("🚨 Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

/* 🛠 Graceful Prisma Shutdown */
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* 🚀 Start Server */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`✅ SwiftStay Backend running on port ${PORT}`)
);

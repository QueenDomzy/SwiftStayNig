import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
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

/* ✅ Trust Proxy for Render (Fixes 'X-Forwarded-For' Error) */
app.set("trust proxy", 1);

/* ✅ Global Middlewares */
app.use(cors());
app.use(express.json());

/* ✅ Global Rate Limiter (Prevents 429 Storms) */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "production" ? 100 : 500, // Looser in dev
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests — please slow down and try again shortly.",
  },
});
app.use(limiter);

/* 🩵 Health Check */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "🏡 SwiftStay API is running smoothly ✅",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ✅ Mount Routes */
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/ai", aiRoutes);

/* 🧹 Global Error Handler */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details:
      process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/* 🛠 Graceful Prisma Shutdown */
const shutdown = async () => {
  console.log("🧹 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* 🚀 Start Server */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ SwiftStay Backend running on port ${PORT}`);
});

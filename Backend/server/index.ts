import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// 🧩 Route imports
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";
import bookingRoutes from "./routes/booking";
import paymentRoutes from "./routes/payment";
import onboardingRoutes from "./routes/onboarding";
import aiRoutes from "./routes/aiRoutes";
import uploadRoutes from "./routes/upload"; // 🆕 added

const app = express();
const prisma = new PrismaClient();

/* ✅ Trust proxy (important for Render, Vercel, Cloudflare, etc.) */
app.set("trust proxy", 1);

/* ✅ Rate limiter to prevent abuse */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

/* ✅ Global Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ Serve uploaded files statically (only for local storage mode) */
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* 🩵 Health Check */
app.get("/", (_req: Request, res: Response) => {
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
app.use("/api", uploadRoutes); // 🆕 POST /api/upload

/* 🧹 Global Error Handler */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details: err instanceof Error ? err.message : undefined,
  });
});

/* 🛠 Graceful Prisma Shutdown */
const shutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected gracefully");
  } catch (err) {
    console.error("❌ Error disconnecting Prisma:", err);
  } finally {
    process.exit(0);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* 🚀 Start Server */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`✅ SwiftStay Backend running on port ${PORT}`)
);

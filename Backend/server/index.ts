import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// 🧩 Route imports
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
// (optional future routes)
// import onboardingRoutes from "./routes/onboardingRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

/* ✅ Global Middlewares */
app.use(cors());
app.use(express.json());

/* 🩵 Health Check */
app.get("/", (req, res) => {
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
// app.use("/api/onboarding", onboardingRoutes);
// app.use("/api/ai", aiRoutes);

/* 🧹 Global Error Handler */
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* 🛠 Graceful Prisma Shutdown */
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

/* 🚀 Start Server */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`✅ SwiftStay Backend running on port ${PORT}`)
);

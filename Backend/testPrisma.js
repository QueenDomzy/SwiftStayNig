import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to DB successfully!");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

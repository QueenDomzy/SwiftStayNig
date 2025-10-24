// config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🟡 Cloudinary Configuration
 * Make sure you set these in your .env file:
 * CLOUDINARY_CLOUD_NAME=
 * CLOUDINARY_API_KEY=
 * CLOUDINARY_API_SECRET=
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export default cloudinary;

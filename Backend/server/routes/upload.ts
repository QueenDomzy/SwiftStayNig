// server/routes/upload.ts
import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = Router();

// 🧠 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🧱 Setup Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "swiftstay/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  } as any, // TypeScript workaround
});

const upload = multer({ storage });

// 📸 POST /api/upload → Upload single image
router.post("/", upload.single("image"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // @ts-ignore
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      message: "Upload failed",
      error: err instanceof Error ? err.message : err,
    });
  }
});

// 📋 GET /api/upload → List uploaded images
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "swiftstay/properties",
      max_results: 30,
    });

    const images = result.resources.map((r) => r.secure_url);
    res.status(200).json({ images });
  } catch (err) {
    console.error("❌ Failed to fetch images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

export default router;

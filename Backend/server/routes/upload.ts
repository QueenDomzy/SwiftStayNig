import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { Request } from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// 🧠 Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "swiftstay/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  } as any,
});

const upload = multer({ storage });

// 📸 Upload single image
router.post("/", upload.single("image"), (req: Request, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // @ts-ignore
    res.json({ url: req.file.path });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err });
  }
});

export default router;

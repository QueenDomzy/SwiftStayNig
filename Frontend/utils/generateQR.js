// utils/generateQR.js
import QRCode from "qrcode";

export async function generateQR(url) {
  try {
    return await QRCode.toDataURL(url);
  } catch (err) {
    console.error("QR generation failed:", err);
    return null;
  }
}

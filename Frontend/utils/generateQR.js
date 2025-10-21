// utils/generateQR.js

export async function generateQR(text) {
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    text
  )}`;
  return qrApi;
}

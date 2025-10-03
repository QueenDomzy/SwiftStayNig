import { QRCode } from "qrcode.react";

export default function QRCodeDisplay({ value }) {
  return <QRCode value={value || "https://swiftstaynig.com"} />;
}

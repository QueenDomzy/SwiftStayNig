// frontend/components/ImageUploader.jsx
import React, { useState } from "react";
import axios from "axios"; // or use fetch

export default function ImageUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setErr("");
    try {
      const form = new FormData();
      form.append("image", file);

      // If you have axios configured:
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/upload`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = res.data?.imageUrl;
      onUpload && onUpload(imageUrl);
    } catch (error) {
      console.error("Upload failed", error);
      setErr("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {err && <div style={{ color: "red" }}>{err}</div>}
    </div>
  );
}

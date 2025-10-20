// pages/onboard.js
import { useState } from "react";

export default function Onboard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    price: "",
    images: [],
  });

  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle multiple image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload`, {
          method: "POST",
          body: data,
        });

        const json = await res.json();
        if (json.secure_url) uploadedUrls.push(json.secure_url);
      } catch (err) {
        console.error("Upload failed:", err);
        setStatus("❌ Image upload failed. Try again.");
      }
    }

    setForm((prev) => ({ ...prev, images: uploadedUrls }));
    setUploading(false);
    setStatus("✅ Image(s) uploaded successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setStatus("✅ Property submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        description: "",
        price: "",
        images: [],
      });
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🏨 List Your Hotel on SwiftStay
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <input
          name="name"
          placeholder="Hotel Name"
          onChange={handleChange}
          value={form.name}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Contact Email"
          onChange={handleChange}
          value={form.email}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          onChange={handleChange}
          value={form.phone}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="location"
          placeholder="Hotel Location"
          onChange={handleChange}
          value={form.location}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Hotel Description"
          onChange={handleChange}
          value={form.description}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <input
          name="price"
          placeholder="Price per Night (₦)"
          onChange={handleChange}
          value={form.price}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block text-gray-700">Upload Hotel Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 rounded"
        />

        {uploading && <p className="text-yellow-600 text-sm">Uploading images...</p>}

        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {form.images.map((img, i) => (
              <img key={i} src={img} alt={`uploaded-${i}`} className="rounded-lg h-24 w-full object-cover" />
            ))}
          </div>
        )}

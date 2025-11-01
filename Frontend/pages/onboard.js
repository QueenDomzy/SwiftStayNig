// pages/onboard.js
import { useState } from "react";
import axios from "axios";

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

  // Handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload images via backend /api/upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    setStatus("Uploading images...");
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data?.imageUrl) uploadedUrls.push(res.data.imageUrl);
      } catch (err) {
        console.error("Image upload failed:", err);
        setStatus("❌ Image upload failed. Try again.");
        setUploading(false);
        return;
      }
    }

    setForm((prev) => ({ ...prev, images: uploadedUrls }));
    setUploading(false);
    setStatus("✅ Images uploaded successfully!");
  };

  // Submit property info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting property...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

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
      console.error("Submit failed:", err);
      setStatus("❌ Failed to submit property.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🏨 Property Onboarding on SwiftStay
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
          placeholder="Property Location"
          onChange={handleChange}
          value={form.location}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Property Description"
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

        <label className="block text-gray-700">Upload Property Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-2 rounded"
        />

        {uploading && <p className="text-yellow-600 text-sm">{status}</p>}

        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {form.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`uploaded-${i}`}
                className="rounded-lg h-24 w-full object-cover"
              />
            ))}
          </div>
        )}

        {status && !uploading && <p className="mt-2 text-center">{status}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Property
        </button>
      </form>
    </main>
  );
}

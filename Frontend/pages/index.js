// pages/index.js

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";

export default function Home({ properties, error }) {
  const images = [
    "/images/nike-lake-resort.jpg",
    "/images/golden-tulip-agulu.jpg",
    "/images/rockview-owerri.jpg",
    "/images/salt-lake-abakaliki.jpg",
    "/images/margaret-umahi-market.jpg",
  ];

  if (error) return <p>{error}</p>;

  return (
    <main className="relative w-full">
      {/* Hero Section with Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 4500 }}
        effect="fade"
        loop
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`slide-${i}`}
              className="w-full h-[90vh] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Title */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-playfair text-gold drop-shadow-lg">
          SwiftStay Nigeria: Connecting Nigeria — One Stay at a Time
        </h1>
      </div>

      {/* Property Listings Section */}
      <section className="mt-10 px-6">
        <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
        {properties.length === 0 ? (
          <p>No properties available.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((p) => (
              <li
                key={p.id}
                className="border rounded-xl shadow-lg p-4 hover:shadow-2xl transition"
              >
                <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                <p>{p.location}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

// ✅ Fetch data server-side (keep your original logic)
export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/properties";
  let properties = [];
  let error = null;

  try {
    const res = await fetch(apiUrl);
    const text = await res.text();

    if (!text) {
      properties = [];
      console.warn("Empty response from backend.");
    } else {
      try {
        properties = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse JSON:", parseErr);
        error = "Received invalid data from server.";
        properties = [];
      }
    }
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    error = "Could not load properties at the moment.";
    properties = [];
  }

  return {
    props: {
      properties,
      error,
    },
  };
    }

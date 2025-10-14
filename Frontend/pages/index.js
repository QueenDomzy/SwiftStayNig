"use client";

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

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <main className="relative w-full">
      {/* ✅ SwiftStay Logo Overlay */}
      <div className="absolute top-6 left-8 z-50 flex items-center space-x-2">
        <img
          src="/logo-swiftstay.png"
          alt="SwiftStay Nigeria Logo"
          className="h-14 w-auto drop-shadow-lg animate-glow"
        />
      </div>

      {/* ✅ Hero Section with Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 4500 }}
        effect="fade"
        loop
        onSlideChange={() => {
          // Restart slogan fade-in animation on slide change
          const slogan = document.querySelector(".slogan");
          if (slogan) {
            slogan.classList.remove("fade-in");
            void slogan.offsetWidth; // Reflow to restart animation
            slogan.classList.add("fade-in");
          }
        }}
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

      {/* ✅ Animated Slogan + Button Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-4">
        <h1 className="slogan fade-in text-4xl md:text-6xl font-playfair text-gold drop-shadow-lg">
          SwiftStay Nigeria: Connecting Nigeria — One Stay at a Time
        </h1>

        <button
          onClick={() => (window.location.href = "/booking")}
          className="book-now-btn fade-in"
        >
          Book Now
        </button>
      </div>

      {/* ✅ Property Listings Section */}
      <section className="mt-16 px-6 pb-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gold">
          Available Properties
        </h2>

        {properties?.length === 0 ? (
          <p className="text-center text-gray-600">No properties available.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((p) => (
              <li
                key={p.id}
                className="border border-gray-200 rounded-xl shadow-lg p-4 hover:shadow-2xl transition transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{p.name}</h3>
                <p className="text-gray-600">{p.location}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

/* ✅ Server-side Data Fetch */
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
  }

  return {
    props: { properties, error },
  };
    }

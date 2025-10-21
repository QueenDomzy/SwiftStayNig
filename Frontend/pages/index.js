// pages/index.js
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useRouter } from "next/router";
import "swiper/css";
import "swiper/css/effect-fade";

const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];

export default function Home({ properties = [], error }) {
  const router = useRouter();

  const restartSloganAnimation = () => {
    const slogan = document.querySelector(".slogan");
    if (slogan) {
      slogan.classList.remove("fade-in");
      void slogan.offsetWidth; // force reflow
      slogan.classList.add("fade-in");
    }
  };

  const handleBookNow = () => {
    router.push("/properties");
  };

  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* ✅ SwiftStay Logo */}
      <div className="absolute top-6 left-8 z-50 flex items-center space-x-2">
        <img
          src="/logo-swiftstay.png"
          alt="SwiftStay Nigeria Logo"
          className="h-14 w-auto drop-shadow-lg animate-glow"
          loading="lazy"
        />
      </div>

      {/* ✅ Navbar */}
      <nav className="absolute top-8 right-8 z-50 flex flex-wrap space-x-4 md:space-x-6 text-white font-semibold drop-shadow-lg">
        {[
          { href: "/", label: "Home" },
          { href: "/properties", label: "Properties" },
          { href: "/onboard", label: "List Your Hotel" },
          { href: "/login", label: "Login" },
          { href: "/signup", label: "Sign Up" },
          { href: "/dashboard", label: "Dashboard" },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="hover:text-gold transition">
            {label}
          </a>
        ))}
      </nav>

      {/* ✅ Hero Section */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        onSlideChange={restartSloganAnimation}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Hero slide ${i + 1}`}
              className="w-full h-[90vh] object-cover rounded-2xl"
              loading="eager"
              decoding="async"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Slogan + Book Now */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="slogan fade-in text-4xl md:text-6xl font-playfair text-gold drop-shadow-lg px-4">
          SwiftStay Nigeria — Connecting Nigeria, One Stay at a Time
        </h1>
        <button
          onClick={handleBookNow}
          className="bg-gold text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-500 transition fade-in"
        >
          Book Now
        </button>
      </div>

      {/* ✅ Property Listings */}
      <section className="mt-10 px-6 pb-16 bg-white text-black rounded-t-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Available Properties
        </h2>

        {error ? (
          <p className="text-center text-red-500 font-medium">
            ⚠️ {error.includes("429")
              ? "Server is temporarily busy. Please try again in a few minutes."
              : error}
          </p>
        ) : properties.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((p) => (
              <li
                key={p.id}
                className="border rounded-xl shadow-lg p-4 hover:shadow-2xl transition"
              >
                <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
                <p className="text-sm text-gray-700">{p.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No properties available.</p>
        )}
      </section>
    </main>
  );
}

/* ✅ Static Generation with Revalidation & Error Graceful Fallback */
export async function getStaticProps() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/properties`;
  let properties = [];
  let error = null;

  try {
    const res = await fetch(apiUrl, {
      headers: { "Cache-Control": "no-cache" },
    });

    // Graceful retry if rate limited (429)
    if (res.status === 429) {
      console.warn("⚠️ Rate limit hit, retrying after 5 seconds...");
      await new Promise((r) => setTimeout(r, 5000));
      const retry = await fetch(apiUrl);
      if (!retry.ok) throw new Error(`Server responded with ${retry.status}`);
      properties = await retry.json();
    } else if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    } else {
      properties = await res.json();
    }
  } catch (err) {
    console.error("❌ Failed to fetch properties:", err.message);
    error = err.message;
  }

  return {
    props: { properties, error },
    revalidate: 600, // Revalidate every 10 minutes
  };
      }

// pages/index.js
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const images = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
];

export default function Home({ properties, error }) {
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Optional: restart slogan animation on slide change
  const restartSloganAnimation = () => {
    const slogan = document.querySelector(".slogan");
    if (slogan) {
      slogan.classList.remove("fade-in");
      void slogan.offsetWidth; // force reflow
      slogan.classList.add("fade-in");
    }
  };

  return (
    <main className="relative w-full">
      {/* SwiftStay Logo */}
      <div className="absolute top-6 left-8 z-50 flex items-center space-x-2">
        <img
          src="/logo-swiftstay.png"
          alt="SwiftStay Nigeria Logo"
          className="h-14 w-auto drop-shadow-lg animate-glow"
        />
      </div>

      {/* Hero Section with Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4500 }}
        onSlideChange={restartSloganAnimation}
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

      {/* Animated Slogan Overlay + Book Now */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="slogan fade-in text-4xl md:text-6xl font-playfair text-gold drop-shadow-lg px-4">
          SwiftStay Nigeria: Connecting Nigeria — One Stay at a Time
        </h1>
        <button className="book-now-btn fade-in">
          Book Now
        </button>
      </div>

      {/* Property Listings */}
      <section className="mt-10 px-6">
        <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
        {Array.isArray(properties) && properties.length > 0 ? (
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
        ) : (
          <p>No properties available.</p>
        )}
      </section>
    </main>
  );
}

// ✅ Server-side fetch for properties
export async function getServerSideProps() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/properties`;
  let properties = [];
  let error = null;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded with ${res.status}: ${text}`);
    }

    properties = await res.json();
    if (!Array.isArray(properties)) {
      throw new Error("Expected an array but got something else");
    }
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    error = err.message || "Could not load properties at the moment.";
  }

  return {
    props: {
      properties,
      error,
    },
  };
    }        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`slide-${i}`}
              className="w-full h-[90vh] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Animated Slogan Overlay + Book Now */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="slogan fade-in text-4xl md:text-6xl font-playfair text-gold drop-shadow-lg px-4">
          SwiftStay Nigeria: Connecting Nigeria — One Stay at a Time
        </h1>
        <button className="book-now-btn fade-in">
          Book Now
        </button>
      </div>

      {/* Property Listings */}
      <section className="mt-10 px-6">
        <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
        {properties?.length === 0 ? (
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
    </main
    <div>
      <h1>Properties</h1>
      {Array.isArray(properties) && properties.length > 0 ? (
        <ul>
          {properties.map((p) => (
            <li key={p.id || p.name}>{p.name || "Unnamed Property"}</li>
          ))}
        </ul>
      ) : (
        <p>No properties available.</p>
      )}
    </div>
>>>>>>> 6ed892f (Initial commit)
  );
}

// Server-side fetch for properties
export async function getServerSideProps() {
<<<<<<< HEAD
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/properties";
=======
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/properties`;
>>>>>>> 6ed892f (Initial commit)
  let properties = [];
  let error = null;

  try {
    const res = await fetch(apiUrl);
<<<<<<< HEAD
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

  return { props: { properties, error } };
    }
=======

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded with ${res.status}: ${text}`);
    }

    properties = await res.json();
    if (!Array.isArray(properties)) {
      throw new Error("Expected an array but got something else");
    }
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    error = err.message || "Could not load properties at the moment.";
  }

  return {
    props: {
      properties,
      error,
    },
  };
}
>>>>>>> 6ed892f (Initial commit)

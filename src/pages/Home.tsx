import Navbar from "../components/Navbar";
import cookies from "../assets/cookie.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans transition-opacity duration-500 opacity-100">
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col -mt-10 lg:flex-row items-center justify-between px-10 lg:px-24 py-16 gap-10">

        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <p className="text-sm tracking-widest text-primary mb-3">
            EST. 2024
          </p>

          <h1 className="text-5xl text-primary lg:text-6xl font-bold leading-tight mb-6">
            Cakes <span className="text-red-950">&</span> Cookies.
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Curated cakes and cookies designed as visual masterpieces. We blend
            high-fashion aesthetics with heritage baking techniques.
          </p>
        </div>

        {/* RIGHT IMAGE CARD */}
        <div className="relative">
          <div>
            <img
              src={cookies}
              className="w-[250px] h-[450px] rounded-2xl lg:w-[380px]"
              alt="cookies"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-6 px-10 lg:px-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

        <div>
          <p className="text-red-600 text-xl mb-2">✦</p>
          <h4 className="font-semibold mb-2">Artisanal Precision</h4>
          <p className="text-gray-500 text-sm">
            Every garnish is placed with surgical precision.
          </p>
        </div>

        <div>
          <p className="text-red-600 text-xl mb-2">🍃</p>
          <h4 className="font-semibold mb-2">Ethical Sourcing</h4>
          <p className="text-gray-500 text-sm">
            Sustainable cocoa farms and local dairy producers.
          </p>
        </div>

        <div>
          <p className="text-red-600 text-xl mb-2">🔥</p>
          <h4 className="font-semibold mb-2">Baked Daily</h4>
          <p className="text-gray-500 text-sm">
            Freshly baked every morning for maximum flavor.
          </p>
        </div>
      </section>
      <div className="flex justify-center items-center mt-5">
        <button
          onClick={() => navigate("/products")}
          className=" bg-primary text-white px-6 py-3 rounded-full shadow-md hover:bg-primary transition">
          Explore the Collection
        </button>
      </div>
    </div>
  );
};

export default Home;
import { UserRound, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const goToSection = (section: string) => {
    navigate(`/products#${section}`);
  };

  return (
    <div className="flex justify-between items-center px-10 mb-9 bg-[#f6f2f3]">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-red-700 tracking-wide">
        c & c
      </h1>

      {/* NAV LINKS */}
      <div className="flex items-center gap-10 text-gray-700 font-medium">
        <Link to="/" className="hover:text-red-700 transition">
          Home
        </Link>

        <button
          onClick={() => goToSection("cake")}
          className="relative hover:text-red-700 transition"
        >
          Cakes
        </button>

        <button
          onClick={() => goToSection("cookie")}
          className="relative hover:text-red-700 transition"
        >
          Cookies
        </button>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-6">
        {/* CART */}
        <Link to="/cart">
          <ShoppingCart className="w-5 h-5 text-red-700 cursor-pointer" />
        </Link>

        {/* USER */}
        {!token ? (
          <Link to="/login">
            <UserRound className="w-5 h-5 text-red-700 cursor-pointer" />
          </Link>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="text-red-700 font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
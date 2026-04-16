import { UserRound, ShoppingCart, LogOut } from "lucide-react";
import { NavLink, Link } from "react-router-dom";


const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex justify-between items-center px-10 mb-9 bg-[#f6f2f3]">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-primary tracking-wide">
        c & c
      </h1>

      {/* NAV LINKS */}
      <div className="flex items-center gap-10 text-gray-700 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-primary text-white px-3 py-2 rounded-lg transition"
              : "text-gray-600 hover:text-primary px-4 py-2 transition"
          }        >
          Home
        </NavLink>

        <NavLink
          to="/products/cake"
          className={({ isActive }) =>
            isActive
              ? "bg-primary text-white px-3 py-2 rounded-lg transition"
              : "text-gray-600 hover:text-primary px-4 py-2 transition"
          }
        >
          Cakes
        </NavLink>

        <NavLink
          to="/products/cookie"
          className={({ isActive }) =>
            isActive
              ? "bg-primary text-white px-3 py-2 rounded-lg transition"
              : "text-gray-600 hover:text-primary px-4 py-2 transition"
          }        >
          Cookies
        </NavLink>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-6">
        {/* CART */}
        <Link to="/cart">
          <ShoppingCart className="w-5 h-5 text-primary cursor-pointer" />
        </Link>

        {/* USER */}
        {!token ? (
          <Link to="/login">
            <UserRound className="w-5 h-5 text-primary cursor-pointer" />
          </Link>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="text-primary font-medium"
          >
            <LogOut className="w-5 h-5 text-primary cursor-pointer" />

          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
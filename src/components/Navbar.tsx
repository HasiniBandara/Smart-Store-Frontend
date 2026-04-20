import { UserRound, ShoppingCart, LogOut, Menu } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center px-4 md:px-10 py-4 bg-[#f6f2f3] relative">

      {/* LOGO */}
      <h1 className="text-2xl font-logo md:text-3xl font-bold text-primary tracking-wide">
        c & c
      </h1>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      {/* NAV LINKS */}
      <div
        className={`
          absolute md:static top-16 left-0 w-full md:w-auto
          bg-[#f6f2f3] md:flex items-center gap-6 font-medium
          transition-all duration-300 ease-in-out
          ${open ? "block" : "hidden"} md:block
        `}
      >
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "block md:inline bg-primary text-white px-4 py-2 rounded-lg"
              : "block md:inline text-gray-600 hover:text-primary px-4 py-2"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products/cake"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "block md:inline bg-primary text-white px-4 py-2 rounded-lg"
              : "block md:inline text-gray-600 hover:text-primary px-4 py-2"
          }
        >
          Cakes
        </NavLink>

        <NavLink
          to="/products/cookie"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "block md:inline bg-primary text-white px-4 py-2 rounded-lg"
              : "block md:inline text-gray-600 hover:text-primary px-4 py-2"
          }
        >
          Cookies
        </NavLink>
      </div>

      {/* RIGHT ICONS */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/cart">
          <ShoppingCart className="w-5 h-5 text-primary" />
        </Link>

        {!token ? (
          <Link to="/login">
            <UserRound className="w-5 h-5 text-primary" />
          </Link>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            <LogOut className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
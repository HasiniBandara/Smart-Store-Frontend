import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex justify-between items-center px-10 py-5 text-light">

      <h1 className="font-lily text-3xl font-bold">c & c</h1>

      <div className="bg-light text-primary px-6 py-2 rounded-full flex gap-6 font-poppins font-bold">
        <Link to="/">HOME</Link>
        <Link to="/products">PRODUCTS</Link>
        <Link to="/cart">CART</Link>
      </div>

      <div className="text-lg font-bold">
        {!token ? (
          <Link to="/login" className="text-blue-500">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary bg-light rounded-full p-2 flex items-center justify-center gap-2">
              <UserRound className="w-6 h-6" />
            </h2>
          </Link>

        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="text-red-500"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
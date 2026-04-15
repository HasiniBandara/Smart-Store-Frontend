import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "../assets/cookie.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      alert("Login successful!");

      // Redirect to products page
      navigate("/products");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans">

      <div className="flex max-h-screen mt-12 items-center justify-center px-6">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex">

          {/* LEFT SIDE */}
          <div className="w-1/2 relative bg-gradient-to-br from-[#f0bdc3] via-[#a4404d] to-[#7a1f2b] text-white p-10 flex flex-col justify-end">

            <div className="absolute top-10 right-20 rotate-[-8deg] shadow-xl">
              <img
                src={cookies}
                alt="cookies"
                className="w-44 rounded-xl"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-3">c & c</h1>
              <p className="text-sm text-white/80 leading-relaxed">
                Every cookie tells a story of artisanal dedication.
                Welcome back to our gallery of fine confections.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 p-12 flex flex-col justify-center">

            <h2 className="text-3xl font-bold mb-2">Sign In</h2>

            <p className="text-sm text-gray-500 mb-6">
              New to the c & c?{" "}
              <span className="text-red-600 cursor-pointer font-medium">
                Sign Up Here
              </span>
            </p>

            {/* EMAIL */}
            <label className="text-sm text-gray-600 mb-1">Email Address</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mb-4 bg-gray-50">
              <span className="text-gray-400 mr-2">✉</span>
              <input
                type="email"
                placeholder="alex@artisan.com"
                className="w-full bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Password</label>
              <span className="text-xs text-red-600 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div className="flex items-center border rounded-xl px-3 py-2 mb-6 bg-gray-50">
              <span className="text-gray-400 mr-2">🔒</span>
              <input
                type="password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
            >
              Access Your Account →
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
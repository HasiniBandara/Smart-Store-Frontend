import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "../assets/cookie.png";

import { API_BASE_URL } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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

      localStorage.setItem("token", data.token);
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Something went wrong during login");
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Account created successfully! Please sign in.");
      setIsSignUp(false);
      // Clear password fields for security
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong during registration");
    }
  };

  return (
    <div className="bg-[#f6f2f3] min-h-screen px-4 md:px-16 py-10 font-sans">

      <div className="flex items-center justify-center mt-6 md:mt-12">

        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* LEFT SIDE */}
          <div className="w-full md:w-1/2 relative bg-gradient-to-br from-[#f6f2f3] via-[#a4404d] to-primary text-white p-6 md:p-10 flex flex-col justify-end">

            {/* IMAGE (hidden on mobile) */}
            <div className="hidden md:block absolute top-10 right-10 rotate-[-8deg] shadow-xl">
              <img src={cookies} alt="cookies" className="w-40 md:w-44 rounded-xl" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">c & c</h1>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                Every cookie tells a story of artisanal dedication.
                Welcome back to our gallery of fine confections.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">

            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              {isSignUp ? "Already have an account? " : "New to the c & c? "}
              <span
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary cursor-pointer font-medium"
              >
                {isSignUp ? "Sign In Here" : "Sign Up Here"}
              </span>
            </p>

            {/* INPUTS */}
            {isSignUp && (
              <>
                <label className="text-sm text-gray-600 mb-1">Full Name</label>
                <div className="flex items-center border rounded-xl px-3 py-2 mb-4 bg-gray-50">
                  <span className="text-gray-400 mr-2">👤</span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-transparent outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </>
            )}

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
            <label className="text-sm text-gray-600 mb-1">Password</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mb-4 bg-gray-50">
              <span className="text-gray-400 mr-2">🔒</span>
              <input
                type="password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {isSignUp && (
              <>
                <label className="text-sm text-gray-600 mb-1">Confirm Password</label>
                <div className="flex items-center border rounded-xl px-3 py-2 mb-6 bg-gray-50">
                  <span className="text-gray-400 mr-2">🔒</span>
                  <input
                    type="password"
                    className="w-full bg-transparent outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* BUTTON */}
            <button
              onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full bg-primary text-white py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
            >
              {isSignUp ? "Register Account" : "Access Your Account"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const services = [
    {
      label: "100% Success & Placement",
      image: "/Degree.png",
    },
    {
      label: "Knowledgable Facility",
      image: "/Education.jpg",
    },
    {
      label: "Computer Lab Facility",
      image: "/Computer.jpeg",
    },
    {
      label: "Science Lab Facility",
      image: "/Science.jpg",
    },
    {
      label: "Sport Facility",
      image: "/Sport.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      toast.success(`Welcome back, ${user.name}! 🎉`, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => router.push("/home"),
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <ToastContainer />
      <div className="auth-card flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 gap-6 max-w-7xl w-full h-[90vh] p-6">
        {/* LEFT SLIDER */}
        <div className="auth-left relative w-full lg:w-1/2 flex items-center justify-center overflow-hidden rounded-2xl">
          <img
            key={currentSlide}
            src={services[currentSlide].image}
            alt={services[currentSlide].label}
            className="auth-slide w-full h-full object-cover"
          />
          <div className="auth-overlay absolute inset-0 bg-black/30"></div>
          <div className="auth-caption absolute bottom-8 left-6 text-white text-xl font-semibold">
            {services[currentSlide].label}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="auth-right w-full lg:w-1/2 flex flex-col items-center justify-center gap-6">
          <div className="auth-logo mb-6">
            <img src="/logo.jpeg" alt="Aipex Logo" className="h-[70px]" />
          </div>

          <div className="auth-form-wrapper w-full px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="auth-field relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="auth-input peer placeholder-transparent w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:border-primary"
                  placeholder="Email"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="email" className="auth-label">
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="auth-field relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="auth-input peer placeholder-transparent w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:border-primary"
                  placeholder="Password"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-button w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                {isLoading ? "Signing in..." : "Log in"}
              </button>

              {/* SIGNUP LINK */}
              <p className="auth-text text-center text-gray-500 text-sm">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="auth-link text-primary font-semibold"
                >
                  Sign up
                </a>
              </p>

              <div className="auth-divider text-center text-gray-400 text-sm py-2">
                <span>Or continue with</span>
              </div>

              <div className="auth-socials flex gap-4 justify-center">
                <button
                  type="button"
                  className="auth-social flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FcGoogle className="w-6 h-6" /> Google
                </button>
                <button
                  type="button"
                  className="auth-social flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                >
                  <FaFacebook className="w-6 h-6 text-blue-600" /> Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

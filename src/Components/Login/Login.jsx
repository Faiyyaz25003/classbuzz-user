// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

// export default function Login() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const services = [
//     { label: "100% Success & Placement", image: "/Degree.png" },
//     { label: "Knowledgeable Facility", image: "/Education.jpg" },
//     { label: "Computer Lab Facility", image: "/Computer.jpeg" },
//     { label: "Science Lab Facility", image: "/Science.jpg" },
//     { label: "Sport Facility", image: "/Sport.jpg" },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % services.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/users/login",
//         formData
//       );
//       const { token, user } = res.data;

//       // Store in memory instead of localStorage
//       sessionStorage.setItem("token", token);
//       sessionStorage.setItem("role", user.role);
//       sessionStorage.setItem("name", user.name);

//       toast.success(`Welcome back, ${user.name}! 🎉`, {
//         position: "top-right",
//         autoClose: 2000,
//         onClose: () => router.push("/home"),
//       });
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || "Login failed. Please try again.";
//       setError(errorMessage);
//       toast.error(errorMessage, { position: "top-right", autoClose: 4000 });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <ToastContainer />

//       <div className="w-full max-w-7xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
//         <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
//           {/* LEFT SLIDER SECTION */}
//           <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto overflow-hidden">
//             <div className="absolute inset-0">
//               {services.map((service, index) => (
//                 <div
//                   key={index}
//                   className={`absolute inset-0 transition-opacity duration-1000 ${
//                     index === currentSlide ? "opacity-100" : "opacity-0"
//                   }`}
//                 >
//                   <img
//                     src={service.image}
//                     alt={service.label}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
//                 </div>
//               ))}
//             </div>

//             {/* Slide Content */}
//             <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
//               <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-2xl mb-4 transform transition-all duration-500">
//                 {services[currentSlide].label}
//               </h2>

//               {/* Slide Indicators */}
//               <div className="flex gap-2 mt-6">
//                 {services.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                       index === currentSlide
//                         ? "w-8 bg-white"
//                         : "w-1.5 bg-white/50 hover:bg-white/70"
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT FORM SECTION */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
//             <div className="w-full max-w-md">
//               {/* Logo */}
//               <div className="text-center mb-8">
//                 <img
//                   src="/logo.jpeg"
//                   alt="Aipex Logo"
//                   className="h-16 sm:h-20 mx-auto mb-4"
//                 />
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//                   Welcome Back
//                 </h1>
//                 <p className="text-gray-500 text-sm sm:text-base">
//                   Sign in to continue your journey
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                     <p className="text-red-700 text-sm font-medium">{error}</p>
//                   </div>
//                 )}

//                 {/* EMAIL INPUT */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
//                     placeholder="Enter your email"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* PASSWORD INPUT */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="password"
//                       value={formData.password}
//                       onChange={(e) =>
//                         setFormData({ ...formData, password: e.target.value })
//                       }
//                       className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
//                       placeholder="Enter your password"
//                       required
//                       disabled={isLoading}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                     >
//                       {showPassword ? (
//                         <FaEyeSlash size={20} />
//                       ) : (
//                         <FaEye size={20} />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* FORGOT PASSWORD */}
//                 <div className="text-right">
//                   <a
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
//                   >
//                     Forgot Password?
//                   </a>
//                 </div>

//                 {/* LOGIN BUTTON */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3.5 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Signing in...
//                     </span>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>

//                 {/* DIVIDER */}
//                 <div className="relative py-4">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500">
//                       Or continue with
//                     </span>
//                   </div>
//                 </div>

//                 {/* SOCIAL LOGINS */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200 font-medium text-gray-700"
//                   >
//                     <FcGoogle className="w-5 h-5" />
//                     <span className="hidden sm:inline">Google</span>
//                   </button>
//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200 font-medium text-gray-700"
//                   >
//                     <FaFacebook className="w-5 h-5 text-blue-600" />
//                     <span className="hidden sm:inline">Facebook</span>
//                   </button>
//                 </div>

//                 {/* SIGNUP LINK */}
//                 <p className="text-center text-gray-600 text-sm sm:text-base pt-4">
//                   Don't have an account?{" "}
//                   <a
//                     href="/register"
//                     className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
//                   >
//                     Sign up
//                   </a>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const services = [
    { label: "100% Success & Placement", image: "/Degree.png" },
    { label: "Knowledgeable Facility", image: "/Education.jpg" },
    { label: "Computer Lab Facility", image: "/Computer.jpeg" },
    { label: "Science Lab Facility", image: "/Science.jpg" },
    { label: "Sport Facility", image: "/Sport.jpg" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 3000);
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

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("name", user.name);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <ToastContainer />

      <div className="w-full max-w-6xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
          {/* LEFT SLIDER SECTION */}
          <div className="relative w-full lg:w-1/2 h-60 sm:h-72 lg:h-auto overflow-hidden">
            <div className="absolute inset-0">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Slide Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <h2 className="text-white text-2xl sm:text-3xl lg:text-3xl font-bold drop-shadow-2xl mb-4 transform transition-all duration-500">
                {services[currentSlide].label}
              </h2>

              {/* Slide Indicators */}
              <div className="flex gap-2 mt-6">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="text-center mb-6">
                <img
                  src="/logo.jpeg"
                  alt="Aipex Logo"
                  className="h-14 sm:h-16 mx-auto mb-3"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* EMAIL INPUT */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* PASSWORD INPUT */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                {/* DIVIDER */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* SOCIAL LOGINS */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200 font-medium text-gray-700"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span className="hidden sm:inline">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200 font-medium text-gray-700"
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>

                {/* SIGNUP LINK */}
                <p className="text-center text-gray-600 text-sm sm:text-base pt-4">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

//   // Slider Images
//   const services = [
//     { label: "100% Success & Placement", image: "/Degree.png" },
//     { label: "Knowledgeable Faculty", image: "/Education.jpg" },
//     { label: "Computer Lab Facility", image: "/Computer.jpeg" },
//     { label: "Science Lab Facility", image: "/Science.jpg" },
//     { label: "Sport Facility", image: "/Sport.jpg" },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   // ✅ Auto image slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % services.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Redirect if already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) router.push("/home");
//   }, [router]);

//   // ✅ Handle Login
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/users/login",
//         formData
//       );

//       if (res.data.success) {
//         const { token, user } = res.data;

//         // ✅ Force role to 'user'
//         const updatedUser = { ...user, role: "user" };

//         // ✅ Save token + user in localStorage
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//         localStorage.setItem("role", "user");
//         localStorage.setItem("name", user?.name || "User");

//         toast.success(`Welcome back, ${user.name}! 🎉`, {
//           position: "top-right",
//           autoClose: 2000,
//           onClose: () => router.push("/home"),
//         });
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Login failed. Please try again.";
//       setError(message);
//       toast.error(message, { position: "top-right", autoClose: 3000 });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <ToastContainer />
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//         <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
//           {/* LEFT SLIDER */}
//           <div className="relative w-full lg:w-1/2 h-60 sm:h-72 lg:h-auto overflow-hidden">
//             <div className="absolute inset-0">
//               {services.map((service, i) => (
//                 <div
//                   key={i}
//                   className={`absolute inset-0 transition-opacity duration-1000 ${
//                     i === currentSlide ? "opacity-100" : "opacity-0"
//                   }`}
//                 >
//                   <img
//                     src={service.image}
//                     alt={service.label}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
//                 </div>
//               ))}
//             </div>

//             <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
//               <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-2xl mb-4">
//                 {services[currentSlide].label}
//               </h2>
//               <div className="flex gap-2 mt-6">
//                 {services.map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCurrentSlide(i)}
//                     className={`h-1.5 rounded-full transition-all duration-300 ${
//                       i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/50"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT FORM */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10">
//             <div className="w-full max-w-md">
//               <div className="text-center mb-6">
//                 <img
//                   src="/logo.jpeg"
//                   alt="Logo"
//                   className="h-14 sm:h-16 mx-auto mb-3"
//                 />
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//                   Welcome Back
//                 </h1>
//                 <p className="text-gray-500 text-sm">
//                   Sign in to continue your journey
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {error && (
//                   <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
//                     <p className="text-red-700 text-sm">{error}</p>
//                   </div>
//                 )}

//                 {/* EMAIL */}
//                 <div>
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
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your email"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* PASSWORD */}
//                 <div>
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
//                       className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your password"
//                       required
//                       disabled={isLoading}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <a
//                     href="/forgot-password"
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     Forgot Password?
//                   </a>
//                 </div>

//                 {/* LOGIN BUTTON */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full py-3.5 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all"
//                 >
//                   {isLoading ? "Signing in..." : "Sign In"}
//                 </button>

//                 <div className="relative py-4">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500">
//                       Or continue with
//                     </span>
//                   </div>
//                 </div>

//                 {/* SOCIAL LOGIN */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
//                   >
//                     <FcGoogle className="w-5 h-5" />
//                     <span className="hidden sm:inline">Google</span>
//                   </button>
//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
//                   >
//                     <FaFacebook className="w-5 h-5 text-blue-600" />
//                     <span className="hidden sm:inline">Facebook</span>
//                   </button>
//                 </div>

//                 <p className="text-center text-gray-600 text-sm pt-4">
//                   Don’t have an account?{" "}
//                   <a
//                     href="/register"
//                     className="text-blue-600 font-semibold hover:underline"
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
    { label: "Knowledgeable Faculty", image: "/Education.jpg" },
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/home");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData,
      );

      if (res.data.success) {
        const { token, user } = res.data;

        // ✅ _id explicitly save karo — user._id ya user.id jo bhi ho
        const updatedUser = {
          ...user,
          _id: user._id || user.id, // ✅ FIX: dono try karo
          role: "user",
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("role", "user");
        localStorage.setItem("name", user?.name || "User");

        toast.success(`Welcome back, ${user.name}! 🎉`, {
          position: "top-right",
          autoClose: 2000,
          onClose: () => router.push("/home"),
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
          {/* LEFT SLIDER */}
          <div className="relative w-full lg:w-1/2 h-60 sm:h-72 lg:h-auto overflow-hidden">
            <div className="absolute inset-0">
              {services.map((service, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    i === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-2xl mb-4">
                {services[currentSlide].label}
              </h2>
              <div className="flex gap-2 mt-6">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="h-14 sm:h-16 mx-auto mb-3"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-sm">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* EMAIL */}
                <div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* PASSWORD */}
                <div>
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
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0f4c5c] via-[#1e88a8] to-[#2596be] text-white font-semibold rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* SOCIAL LOGIN */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span className="hidden sm:inline">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>

                <p className="text-center text-gray-600 text-sm pt-4">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 font-semibold hover:underline"
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
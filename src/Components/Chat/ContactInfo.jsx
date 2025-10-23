
// "use client";
// import React from "react";
// import { Phone, Info, Image, FileText, X } from "lucide-react";

// export default function ContactInfo({ user, onClose }) {
//   if (!user) return null;

//   return (
//     <div className="relative p-6 h-full overflow-y-auto bg-white border-l border-slate-200 shadow-lg animate-slideIn">
//       {/* 🔹 Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
//       >
//         <X className="w-5 h-5" />
//       </button>

//       {/* 🔹 User Info */}
//       <div className="flex flex-col items-center text-center mt-2">
//         <img
//           src={user.img}
//           alt={user.name}
//           className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
//         />
//         <h2 className="mt-4 text-xl font-bold text-slate-800">{user.name}</h2>
//         <p className="text-slate-500 text-sm">
//           {user.phone || "+91 98765 43210"}
//         </p>
//       </div>

//       {/* 🔹 About Section */}
//       <div className="mt-6 border-t border-slate-200 pt-4">
//         <h3 className="font-semibold text-slate-700 mb-1">About</h3>
//         <p className="text-slate-600 text-sm">
//           {user.about || "Hey there! I’m using ChatApp 💬"}
//         </p>
//       </div>

//       {/* 🔹 Media / Links / Docs */}
//       <div className="mt-6 border-t border-slate-200 pt-4">
//         <h3 className="font-semibold text-slate-700 mb-3">
//           Media, Links and Docs
//         </h3>
//         <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
//           <div className="flex items-center space-x-4">
//             <Image className="text-blue-500" />
//             <FileText className="text-green-500" />
//             <Info className="text-purple-500" />
//             <Phone className="text-orange-500" />
//           </div>
//           <button className="text-sm text-blue-600 hover:underline font-medium">
//             View All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React from "react";
import {
  Phone,
  Info,
  Image,
  FileText,
  X,
  Mail,
  MapPin,
  MessageCircle,
  Video,
  Heart,
  Star,
} from "lucide-react";

export default function ContactInfo({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="relative h-full overflow-y-auto bg-slate-900">
      {/* 🔹 Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 🔹 Content */}
      <div className="relative z-10 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 🔹 Profile Section */}
        <div className="flex flex-col items-center pt-8 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <img
              src={user.img}
              alt={user.name}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
          </div>

          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {user.name}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {user.phone || "+91 98765 43210"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
              <Video className="w-4 h-4" />
              Call
            </button>
          </div>
        </div>

        {/* 🔹 Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Image className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white text-center">124</p>
            <p className="text-xs text-slate-400 text-center mt-1">Photos</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-white text-center">89</p>
            <p className="text-xs text-slate-400 text-center mt-1">Shared</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white text-center">32</p>
            <p className="text-xs text-slate-400 text-center mt-1">Starred</p>
          </div>
        </div>

        {/* 🔹 About Section */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 mb-4 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            About
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {user.about || "Hey there! I'm using ChatApp 💬"}
          </p>
        </div>

        {/* 🔹 Contact Details */}
        <div className="space-y-3 mb-4">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4 hover:border-purple-500/50 transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-white text-sm font-medium">
                {user.email || "user@example.com"}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4 hover:border-cyan-500/50 transition-all duration-300">
            <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Location</p>
              <p className="text-white text-sm font-medium">
                {user.location || "Mumbai, India"}
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Media Grid */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Media & Files
            </h3>
            <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 cursor-pointer">
              <Image className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold">Images</p>
              <p className="text-slate-400 text-xs">24 files</p>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-xl p-4 border border-cyan-500/30 hover:border-cyan-500 transition-all duration-300 cursor-pointer">
              <FileText className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold">Documents</p>
              <p className="text-slate-400 text-xs">12 files</p>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl p-4 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 cursor-pointer">
              <Video className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold">Videos</p>
              <p className="text-slate-400 text-xs">8 files</p>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-xl p-4 border border-orange-500/30 hover:border-orange-500 transition-all duration-300 cursor-pointer">
              <Info className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold">Links</p>
              <p className="text-slate-400 text-xs">16 items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
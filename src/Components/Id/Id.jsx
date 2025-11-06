

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { Mail, Phone, Users, Briefcase } from "lucide-react";

export default function Id() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = window.localStorage?.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="animate-pulse bg-white p-8 rounded-2xl shadow-2xl w-80 text-center">
          <div className="rounded-full bg-indigo-300 h-16 w-16 mx-auto mb-4"></div>
          <div className="h-4 bg-indigo-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-indigo-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-600">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // QR Code data
  const qrData = JSON.stringify({
    name: user.name,
    email: user.email,
    phone: user.phone,
    department: user.department || user.departments,
    position: user.position || user.positions,
  });

  return (
    <div className="flex items-center justify-center min-h-screen mt-[90px] mb-[70px]">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 pt-8 pb-16">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/favicon.png"
                  alt="College Logo"
                  className="w-12 h-12 bg-white rounded-xl p-2 shadow-lg"
                />
                <div>
                  <h1 className="text-sm font-semibold opacity-90">
                    Chandrabhan Sharma College
                  </h1>
                  <p className="text-xs opacity-75">Mumbai, India</p>
                </div>
              </div>
              <div className="text-right text-xs opacity-80">
                ID: {user.email?.split("@")[0]?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center -mt-16 mb-4 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {user.name}
              </h2>
              <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                {user.position || user.positions || "Member"}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-3 mb-6">
              <InfoItem
                icon={<Mail />}
                label="Email"
                value={user.email}
                color="indigo"
              />
              <InfoItem
                icon={<Phone />}
                label="Phone"
                value={user.phone}
                color="purple"
              />
              <InfoItem
                icon={<Users />}
                label="Department"
                value={user.department || user.departments || "N/A"}
                color="pink"
              />
              <InfoItem
                icon={<Briefcase />}
                label="Position"
                value={user.position || user.positions || "N/A"}
                color="blue"
              />
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeSVG value={qrData} size={140} level="H" />
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 font-medium">
                Scan to view complete profile details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable component for info fields */
function InfoItem({ icon, label, value, color }) {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-50",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-50",
    pink: "bg-pink-100 text-pink-600 hover:bg-pink-50",
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-50",
  };

  return (
    <div
      className={`flex items-center bg-gray-50 rounded-xl p-3 ${colorClasses[color]} transition-colors`}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-white shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}




"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

const API = "http://localhost:5000";

export default function Id() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await axios.get(`${API}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (!user)
    return <p className="text-center mt-10 text-lg">No user logged in</p>;

  return (
    <div className="ml-[300px] mt-[80px] flex justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "350px", height: "500px" }}
        className="bg-white rounded-xl shadow-xl overflow-hidden border-4 border-blue-500 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 font-semibold text-sm flex items-center justify-between">
          <p className="text-lg">ClassBuzz</p>

          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Body */}
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start gap-4">
            {/* Photo */}
            <div className="w-32 h-36 bg-gray-200 rounded-md border shadow-md overflow-hidden">
              {user.profilePic ? (
                <img
                  src={`${API}/${user.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Photo
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="w-32 h-36 flex items-center justify-center bg-white border rounded-md shadow-md overflow-hidden">
              <QRCodeCanvas
                value={`${API}/api/users/download-pdf/${user._id}`}
                size={140}
                includeMargin={true}
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="mt-4 font-bold text-lg text-blue-900 text-center">
            {user.name?.toUpperCase()}
          </h2>

          {/* Details */}
          <div className="text-left mt-4 space-y-2 text-sm leading-6">
            <p>
              <strong>Email :</strong> {user.email}
            </p>

            <p>
              <strong>Phone :</strong> {user.phone}
            </p>

            <p>
              <strong>Department :</strong>{" "}
              {user.departments?.join(", ") || "—"}
            </p>

            <p>
              <strong>Position :</strong> {user.positions?.join(", ") || "—"}
            </p>

            <p>
              <strong>Gender :</strong> {user.gender}
            </p>

            <p>
              <strong>Semester :</strong> {user.semester || "—"}
            </p>

            <p>
              <strong>Roll No :</strong> {user.rollNo || "—"}
            </p>
          </div>
        </div>

        {/* Barcode */}
        <div className="px-5 pb-5 flex justify-center">
          <div className="w-full h-10 bg-[repeating-linear-gradient(90deg,#000,#000_4px,#fff_4px,#fff_8px)]"></div>
        </div>
      </motion.div>
    </div>
  );
}

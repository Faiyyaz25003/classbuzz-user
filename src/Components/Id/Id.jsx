"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";

export default function Id() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ml-[300px] mt-[50px] min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">🪪 Student ID Cards</h1>
        </div>

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center mt-10">No Student found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300"
              >
                {/* Top Header Blue */}
                <div className="bg-blue-900 text-white p-4 font-semibold text-sm flex items-center justify-between">
                  <p className="text-lg">ClassBuzz</p>

                  <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-lg shadow-xl"
                  />
                </div>

                {/* Body */}
                <div className="p-5 text-center">
                  {/* Photo */}
                  <div className="w-28 h-32 bg-gray-200 mx-auto rounded-md border shadow-md overflow-hidden">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt="photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Photo
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 font-bold text-lg text-blue-900">
                    {user.name?.toUpperCase()}
                  </h2>

                  {/* Details */}
                  <div className="text-left mt-4 space-y-2 text-sm leading-6">
                    <p>
                      <strong>Email :</strong> {user.email}
                    </p>
                    <p>
                      <strong>Phone :</strong> {user.phone || "—"}
                    </p>
                    <p>
                      <strong>Department :</strong>{" "}
                      {user.departments?.join(", ") || "—"}
                    </p>
                    <p>
                      <strong>Position :</strong>{" "}
                      {user.positions?.join(", ") || "—"}
                    </p>
                    <p>
                      <strong>Gender :</strong> {user.gender || "—"}
                    </p>
                    <p>
                      <strong>Join Date :</strong>{" "}
                      {user.joinDate
                        ? new Date(user.joinDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Barcode */}
                <div className="px-5 pb-5 flex justify-center">
                  <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#000,#000_4px,#fff_4px,#fff_8px)]"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

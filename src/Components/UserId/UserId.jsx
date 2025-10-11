"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // agar JWT token use kar rahe ho
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`, // agar auth header required hai
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("User data fetch nahi ho paaya");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>User Profile</h1>
      <div>
        <strong>Name:</strong> {user.name}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Phone:</strong> {user.phone}
      </div>
      <div>
        <strong>Gender:</strong> {user.gender}
      </div>
      <div>
        <strong>Department:</strong> {user.departments}
      </div>
      <div>
        <strong>Position:</strong> {user.positions}
      </div>
      <div>
        <strong>Joining Date:</strong> {user.joinDate}
      </div>
    </div>
  );
}

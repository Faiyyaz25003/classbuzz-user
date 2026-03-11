"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Anncreouncement() {
  const API = "http://localhost:5000/api/announcements";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [file, setFile] = useState(null);

  const [data, setData] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const getData = async () => {
    const res = await axios.get(`${API}/all`);
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const createAnnouncement = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("department", department);
    formData.append("startDate", startDate);

    if (file) {
      formData.append("file", file);
    }

    await axios.post(`${API}/create`, formData);

    clearForm();
    setOpenForm(false);
    getData();
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setType("");
    setDepartment("");
    setStartDate("");
    setFile(null);
  };

  return (
    <div className="min-h-screen mt-[50px] ml-[300px] bg-gray-100 p-8">
      {/* HEADER */}

      <div className="flex justify-between items-center bg-gray-200 p-5 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔊</span>

          <div>
            <h1 className="text-2xl font-bold text-black">
              Announcement Board
            </h1>

            <p className="text-black text-sm">
              Manage institute announcements easily
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenForm(!openForm)}
          className="bg-white border-4 border-black px-6 py-2 font-semibold rounded-lg hover:bg-gray-100"
        >
          {openForm ? "Close Form" : "Open Form"}
        </button>
      </div>

      {/* FORM */}

      {openForm && (
        <div className="bg-white p-8 rounded-xl shadow-lg mt-8">
          <h2 className="text-xl font-semibold mb-6">Create Announcement</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={title}
              placeholder="Title"
              className="border p-3 rounded"
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              value={department}
              placeholder="Department"
              className="border p-3 rounded"
              onChange={(e) => setDepartment(e.target.value)}
            />

            <select
              value={type}
              className="border p-3 rounded"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option>Holiday</option>
              <option>Exam</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Notice</option>
            </select>

            <input
              type="date"
              value={startDate}
              className="border p-3 rounded"
              onChange={(e) => setStartDate(e.target.value)}
            />

            <textarea
              value={description}
              placeholder="Description"
              className="border p-3 rounded md:col-span-2"
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              className="border p-3 rounded md:col-span-2"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button
            onClick={createAnnouncement}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Create Announcement
          </button>
        </div>
      )}

      {/* ANNOUNCEMENTS */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold">{item.title}</h2>

            <p className="text-sm text-gray-500">{item.type}</p>

            <p className="mt-2 text-gray-600">{item.description}</p>

            <p className="text-sm mt-2">Department: {item.department}</p>

            <p className="text-sm">
              Start Date: {item.startDate?.slice(0, 10)}
            </p>

            {item.file && (
              <a
                href={`http://localhost:5000/uploads/${item.file}`}
                target="_blank"
                className="text-blue-500 underline block mt-2"
              >
                View File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

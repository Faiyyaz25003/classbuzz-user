"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export default function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");

  const API = "http://localhost:5000/api/jobs";

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [search, typeFilter, modeFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* FILTER FUNCTION */

  const filterJobs = () => {
    let data = [...jobs];

    if (search) {
      data = data.filter((job) =>
        `${job.title} ${job.company} ${job.location} ${job.skills}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    if (typeFilter !== "All") {
      data = data.filter(
        (job) => job.type?.toLowerCase() === typeFilter.toLowerCase(),
      );
    }

    if (modeFilter !== "All") {
      data = data.filter(
        (job) => job.mode?.toLowerCase() === modeFilter.toLowerCase(),
      );
    }

    setFilteredJobs(data);
  };

  /* STATS */

  const total = jobs.length;

  const internships = jobs.filter(
    (j) => j.type?.toLowerCase() === "internship",
  ).length;

  const fulltime = jobs.filter(
    (j) => j.type?.toLowerCase() === "full time",
  ).length;

  const remote = jobs.filter((j) => j.mode?.toLowerCase() === "remote").length;

  return (
    <div className="p-10 mt-[50px] ml-[300px] bg-gray-100 min-h-screen">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Internship / Job Opportunities</h1>
        <p className="text-gray-500">Latest job opportunities for students</p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          number={total}
          label="Total Listings"
          color="text-purple-600"
        />

        <StatCard
          number={internships}
          label="Internships"
          color="text-blue-600"
        />

        <StatCard number={fulltime} label="Full-time" color="text-red-500" />

        <StatCard number={remote} label="Remote Roles" color="text-green-600" />
      </div>

      {/* SEARCH + FILTER */}

      <div className="flex gap-4 mb-6">
        {/* SEARCH */}

        <div className="flex items-center bg-white rounded-xl shadow px-4 flex-1">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search by role, company, skills, location..."
            className="w-full p-3 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TYPE FILTER */}

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border rounded-xl px-4 py-2 shadow"
        >
          <option>All</option>
          <option>Internship</option>
          <option>Full Time</option>
          <option>Part Time</option>
        </select>

        {/* MODE FILTER */}

        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="bg-white border rounded-xl px-4 py-2 shadow"
        >
          <option>All</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>On-site</option>
        </select>
      </div>

      {/* COUNT */}

      <p className="text-gray-500 mb-6">
        Showing {filteredJobs.length} of {jobs.length} listings
      </p>

      {/* JOB LIST */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border"
          >
            <h2 className="text-xl font-bold">{job.title}</h2>

            <p className="text-gray-600 mb-3">{job.company}</p>

            {/* TAGS */}

            <div className="flex gap-2 mb-3">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
                {job.type}
              </span>

              <span className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded">
                {job.mode}
              </span>
            </div>

            <div className="text-sm space-y-1 text-gray-600">
              <p>
                <b>Location:</b> {job.location}
              </p>

              <p>
                <b>Salary:</b> {job.salary}
              </p>

              <p>
                <b>Skills:</b> {job.skills}
              </p>

              <p>
                <b>Courses:</b> {job.courses}
              </p>

              <p>
                <b>CGPA:</b> {job.cgpa}
              </p>

              <p>
                <b>Openings:</b> {job.openings}
              </p>

              <p>
                <b>Deadline:</b> {job.deadline}
              </p>

              <p>
                <b>Email:</b> {job.email}
              </p>
            </div>

            {/* APPLY BUTTON */}

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STAT CARD */

function StatCard({ number, label, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className={`text-3xl font-bold ${color}`}>{number}</h2>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}

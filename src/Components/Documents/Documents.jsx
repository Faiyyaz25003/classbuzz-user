import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";

export default function Documents() {
  const [files, setFiles] = useState({});
  const [name, setName] = useState("");

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name) return alert("Please enter your name");

    const formData = new FormData();
    formData.append("name", name);
    Object.keys(files).forEach((key) => formData.append(key, files[key]));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData
      );
      alert(res.data.message);
      setFiles({});
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">
        Upload Your School Documents
      </h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="flex flex-col">
          Aadhaar:
          <input type="file" name="aadhaar" onChange={handleFileChange} />
        </label>
        <label className="flex flex-col">
          Marksheet:
          <input type="file" name="marksheet" onChange={handleFileChange} />
        </label>
        <label className="flex flex-col">
          Photo:
          <input type="file" name="photo" onChange={handleFileChange} />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
        >
          <Upload size={18} /> Upload Documents
        </button>
      </form>
    </div>
  );
}

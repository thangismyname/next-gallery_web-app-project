import React, { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.post("http://localhost:3001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded successfully!");
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex items-center gap-4 mb-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border border-gray-300 rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        Upload
      </button>
    </form>
  );
};

export default UploadForm;

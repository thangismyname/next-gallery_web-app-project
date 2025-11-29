import React, { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { useTheme } from "next-themes";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setIsUploading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Uploaded successfully!");
      onUploadSuccess();
      setFile(null);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="flex flex-col md:flex-row items-center gap-4 mb-6"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={`w-full md:w-auto px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-400"
            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
        }`}
      />
      <Button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default UploadForm;

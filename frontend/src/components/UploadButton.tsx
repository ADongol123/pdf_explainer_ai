import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadProps {
  file: File | any | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  value: boolean;
  setValue: any;
  onUploadSuccess: any;
}

const Upload = ({ file, setFile, value, setValue }: UploadProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadMutation: any = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      setMessage("File uploaded successfully!");
      localStorage.setItem("pdfId", data?.pdf_id);
      setValue(true);
      onUploadSuccess(data.pdf_id);
      queryClient.invalidateQueries(["files"]);
    },
    onError: (error: any) => {
      setMessage(`Upload failed: ${error.message}`);
    },
  });

  const handleUpload = () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    uploadMutation.mutate(file);
  };

  // Generate the file URL
  const fileUrl: any = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex justify-center items-center bg-gray-100 h-full">
      {value ? (
        <div style={{ width: "100%", height: "100%" }}>
          {file.type === "application/pdf" ? (
            <iframe
              src={fileUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ccc",
              }}
              title="PDF Viewer"
            />
          ) : (
            <p className="text-red-500">Please upload a valid PDF file.</p>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Upload your files
          </h2>
          <p className="text-gray-500 text-sm text-center">Fast and easy way</p>

          <label
            htmlFor="fileUpload"
            className="mt-4 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg py-10 px-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
          >
            <svg
              className="w-12 h-12 text-blue-500 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 008 0m-3 4v-4m-5-3a4 4 0 018 0m-7 5v-6a4 4 0 018 0v6m-4 4h.01"
              ></path>
            </svg>
            <span className="text-gray-600 text-sm">
              Drag and drop files here
            </span>
          </label>

          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleUpload}
          >
            Submit
          </button>

          {file && (
            <div className="mt-4 text-center text-gray-700">
              <p className="text-sm font-medium">File: {file.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;

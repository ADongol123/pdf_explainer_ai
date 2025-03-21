import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api"; // Import reusable API function

interface FileUploaderProps {
  onUploadSuccess: (pdfId: string) => void;
}

export default function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [file, setFile] = useState<File | any>(null);
  const [value,setValue] = useState(false)
  const [message, setMessage] = useState<string>("");
  const queryClient = useQueryClient();

  const uploadMutation : any = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data:any) => {
      setMessage("File uploaded successfully!");
      onUploadSuccess(data.pdf_id);
      queryClient.invalidateQueries(["files"]); // Refresh file list
    },
    onError: (error: any) => {
      setMessage(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    uploadMutation.mutate(file);
    setValue(true)
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4 w-full" />
      <button
        onClick={handleUpload}
        disabled={uploadMutation.isLoading}
        className={`px-4 py-2 rounded text-white ${
          uploadMutation.isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {uploadMutation.isLoading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

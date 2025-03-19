"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader"
import ChatInterface from "@/components/ChatInterface";
import ChatHistory from "@/components/ChatHistory"
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

export default function Home() {
  const [pdfId, setPdfId] = useState<string | null>(null);

  const handleUploadSuccess = (newPdfId: string) => {
    setPdfId(newPdfId);
  };

  return (
    <div className="p-10">
      <div className="flex gap-2">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
}
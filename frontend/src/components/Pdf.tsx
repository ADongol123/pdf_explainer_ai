"use client";
import { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfUrl(URL.createObjectURL(file));
    }
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div className="h-screen w-screen">
        {pdfUrl || "/test.pdf" ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.12.0/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl || "./test.pdf"} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : (
          <p>No PDF selected</p>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;

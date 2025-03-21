"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Chat from "@/components/Chat";
import Pdf from "@/components/Pdf";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import test_pdf from "../../public/test.pdf"
import { PDFViewer } from "@react-pdf/renderer";
import Upload from "@/components/UploadButton";
export default function Home() {
  const [pdfId, setPdfId] = useState<any>(true);
  const [file, setFile] = useState<any>(null);
  const [value,setValue] = useState(false)
  const [localid,setLocalId] = useState<any>(null)
  const handleUploadSuccess = (newPdfId: any) => {
    setPdfId(newPdfId);
  };
  useEffect(() =>{
    const storedPdfId = localStorage.getItem("pdfId");
    if(storedPdfId){
      setLocalId(storedPdfId)
    } 
  },[])
  return (
    <div className="w-full h-screen flex">
      <PanelGroup direction="horizontal">
        <Sidebar />

        <Panel defaultSize={40} minSize={20} maxSize={60}>
          <Upload file={file} setFile={setFile} value={value} setValue={setValue}/>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 cursor-col-resize" />

        <Panel defaultSize={40} minSize={20} maxSize={60}>
          {file ? (
            <Chat />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Please upload a file to enable chat
            </div>
          )}
          <Chat pdfId={localid}/>
        </Panel>
      </PanelGroup>
    </div>
  );
}

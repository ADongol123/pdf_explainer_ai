"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Chat from "@/components/Chat";
import Pdf from "@/components/Pdf";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  const [pdfId, setPdfId] = useState<string | null>(null);

  const handleUploadSuccess = (newPdfId: string) => {
    setPdfId(newPdfId);
  };

  return (
    <div className="w-full h-screen flex">
      <PanelGroup direction="horizontal">
        <Sidebar />

        <Panel defaultSize={40} minSize={20} maxSize={60}>
          <Pdf />
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 cursor-col-resize" />

        <Panel defaultSize={40} minSize={20} maxSize={60}>
          <Chat />
        </Panel>
      </PanelGroup>
    </div>
  );
}

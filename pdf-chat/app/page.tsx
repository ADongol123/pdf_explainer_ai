"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Send, FileText, FileUp, Bot } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Chat from "../components/Chat";

export default function PDFChat() {
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient(); // No need for :any, type is inferred
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
  });

  const pdfId = localStorage.getItem("pdfId")
  console.log(pdfUrl,"pdfUrl")
  useEffect(() => {
    console.log(pdfId,"4545")
    if (pdfId){
      setIsUploaded(true)
    } 
    else{
      setIsUploaded(false)
    }
  },[pdfId])
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      setMessage("File uploaded successfully!");
      localStorage.setItem("pdfId", data?.pdf_id);
      queryClient.invalidateQueries(["files"]);
      setIsUploaded(true);
    },
    onError: (error: any) => {
      setMessage(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    }
  };

  const handleUpload = () => {
    if (pdfFile) {
      uploadMutation.mutate(pdfFile);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfFile) {
      handleSubmit(e, {
        experimental_attachments: [pdfFile],
      });
    } else {
      handleSubmit(e);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleTopicClick = (topic: string) => {
    handleInputChange({ target: { value: topic } } as React.ChangeEvent<HTMLInputElement>);
    setTimeout(() => {
      const formEvent = new Event("submit") as unknown as React.FormEvent;
      handleChatSubmit(formEvent);
    }, 100);
  };

  useEffect(() => {
    if (isUploaded && pdfFile && messages.length === 0) {
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content:
            "👋 Welcome! I've received your PDF. What would you like to know about it? You can ask me any questions about the content.",
        },
      ]);

      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setSuggestedTopics(data.topics || ["Summarize this document", "Key points"]);
          setIsAnalyzing(false);
        })
        .catch((err) => {
          console.error("Error analyzing PDF:", err);
          setIsAnalyzing(false);
          setSuggestedTopics(["Summarize this document", "Key points", "Main arguments"]);
        });
    }
  }, [isUploaded, pdfFile, messages.length, setMessages]);

  const { data: pdfBlob, error: pdfError, isLoading: pdfLoading } = useQuery<Blob, Error>({
    queryKey: ["pdf", localStorage.getItem("pdfId")],
    queryFn: async () => {
      const pdfId = localStorage.getItem("pdfId");
      if (!pdfId) throw new Error("No PDF ID found in localStorage");

      const response = await fetch(`http://127.0.0.1:8000/get-pdf/${pdfId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }
      return response.blob();
    },
    enabled: !!localStorage.getItem("pdfId"), // Only run if pdfId exists
  });
  console.log(pdfBlob,"pdfBlob")
  // Handle PDF blob side effects
  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      console.log(url,"url")
      setPdfUrl(url);
      setMessage("PDF fetched successfully!");
      return () => URL.revokeObjectURL(url); // Cleanup on unmount or blob change
    }
  }, [pdfBlob]);

  useEffect(() => {
    if (pdfError) {
      setMessage(`Failed to fetch PDF: ${pdfError.message}`);
    }
  }, [pdfError]);



  if (!isUploaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <FileUp className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Upload your PDF</h1>
            <p className="text-muted-foreground mb-6">
              Upload a PDF document to chat with it and ask questions about its content
            </p>

            <div className="w-full mb-6">
              {pdfFile ? (
                <div className="flex items-center p-4 border rounded-lg bg-background">
                  <FileText className="h-6 w-6 text-primary mr-3" />
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{pdfFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF (up to 10MB)</p>
                </div>
              )}

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>

            {message && (
              <p className={`text-sm mb-4 ${uploadMutation.isError ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}

            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1" onClick={triggerFileInput}>
                Select File
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={!pdfFile || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Uploading..." : "Continue"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Chat/>
  );
}
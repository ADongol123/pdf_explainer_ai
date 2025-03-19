// src/components/ChatInterface.tsx
import { useState } from "react";
import axios from "axios";

interface ChatInterfaceProps {
  pdfId: string;
}

export default function ChatInterface({ pdfId }: ChatInterfaceProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handleChat = async () => {
    if (!query) return;

    try {
      const res = await axios.post("http://localhost:8000/chat/", {
        pdf_id: pdfId,
        query,
      });
      setResponse(res.data.answer);
      setQuery(""); // Clear input
    } catch (error: any) {
      setResponse(`Error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Chat with PDF (ID: {pdfId})</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something about the PDF..."
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />
      <button
        onClick={handleChat}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Response:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
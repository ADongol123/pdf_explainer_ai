import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ pdfId }: { pdfId: string | null }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [localPdfId, setLocalPdfId] = useState<string | null>(pdfId);
  const API_BASE_URL = 'http://localhost:8000'; // Update with your actual API URL
  console.log(localPdfId,"localPdfId")
  useEffect(() => {
    const storedPdfId = localStorage.getItem('pdfId');
    if (!pdfId && storedPdfId) {
      setLocalPdfId(storedPdfId);
    } else {
      setLocalPdfId(pdfId);
    }
    fetchChatHistory();
  }, [pdfId]);

  const fetchChatHistory = async () => {
    if (!localPdfId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/get-chat-history/${localPdfId}`);
      setMessages(response.data.chat_history || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!localPdfId || newMessage.trim() === '') {
      console.error('Error: pdf_id or query is missing');
      return;
    }
  
    const userMessage = { id: messages.length + 1, text: newMessage, sender: 'user' };
    setMessages([...messages, userMessage]);
    setNewMessage('');
  
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        pdf_id: localPdfId,
        query: newMessage,   
      });
  
      const botMessage = { id: messages.length + 2, text: response.data.answer, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  return (
    <div className="flex flex-col w-full h-full bg-[#292a2e] p-4 shadow-md text-white">
      {/* Chat History */}
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg flex items-center gap-2 ${
                  message.sender === 'user' ? 'bg-[#414159] text-white' : 'text-white'
                }`}
              >
                {message.sender !== 'user' && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[#D9D9D9]"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                )}
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex items-center border-t pt-2">
        <textarea
          className="flex-grow p-2 border rounded-lg focus:outline-none bg-[#202123] text-white placeholder-[#8E8EA0]"
          rows={2}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-[#10A37F] text-white rounded-lg hover:bg-[#0D8C6C]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

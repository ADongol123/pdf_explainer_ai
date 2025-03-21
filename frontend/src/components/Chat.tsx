import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, how can I assist you today?', sender: 'bot' },
    { id: 2, text: 'I need help with my PDF file.', sender: 'user' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: 'user' },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#292a2e] p-4 shadow-md text-white">
      {/* Chat History */}
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
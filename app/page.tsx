"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, "You: " + input]);

    // Show loading message
    setMessages((prev) => [...prev, "Bot: Thinking..."]);

    // Simulate backend response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        "Bot: This is a sample response",
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-black">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <p className="text-sm text-zinc-500">No conversations yet</p>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Sales Chatbot
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="p-2 rounded bg-white dark:bg-zinc-800 border"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 dark:bg-zinc-800"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

      </main>
    </div>
  );
}

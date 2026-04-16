"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://sales-chatbot-7wsa.onrender.com"; // your API

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    // Clear input
    setInput("");

    // Show loading
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "Thinking..." },
    ]);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
        }),
      });

      const data = await response.json();

      // Replace "Thinking..." with real response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: data.response || "No response from server" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: "Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-black">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <p className="text-sm text-zinc-500">Demo Conversation</p>
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
              className={`p-2 rounded max-w-[70%] ${
                msg.role === "user"
                  ? "ml-auto bg-black text-white"
                  : "bg-white dark:bg-zinc-800 border"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
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
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

      </main>
    </div>
  );
}

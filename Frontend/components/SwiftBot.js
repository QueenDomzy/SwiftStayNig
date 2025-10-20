import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function SwiftBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "Hi! I'm SwiftBot 🤖 — how can I help you today?" }]);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply || "I’ll get back to you shortly!" }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "⚠️ I’m having trouble connecting to the server." }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gold text-black rounded-full p-4 shadow-lg hover:scale-110 transition z-50"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-white w-80 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="bg-gold text-black font-bold px-4 py-2">SwiftBot 🤖</div>
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <p key={i} className={`text-sm ${msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-800"}`}>
                {msg.text}
              </p>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SwiftBot..."
              className="flex-1 p-2 text-sm outline-none"
            />
            <button className="px-3 text-gold font-bold">→</button>
          </form>
        </div>
      )}
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useSocket } from "./lib/useSocket";
import Image from "next/image";
export default function Home() {
  const { socket, connected } = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text?: string; image?: string }[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("updateData", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("updateData");
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("newData", { text: input });
      setInput("");
    }
  };

  const sendImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("newData", { image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔗 Realtime Next.js App</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input type="file" accept="image/*" onChange={sendImage} />
      </div>

      <div>
        <h2>Messages:</h2>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <Image src={msg.image} width={28} height={28}  alt="upload" />}
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

interface Command {
  name: string;
  icon: string;
  action: string;
  description: string;
}

const commands: Command[] = [
  { name: "Coords", icon: "📍", action: "coords", description: "Show position" },
  { name: "Inventory", icon: "🎒", action: "inv", description: "Show inventory" },
  { name: "Health", icon: "❤️", action: "health", description: "Show health" },
  { name: "Food", icon: "🍖", action: "food", description: "Show food" },
  { name: "Say", icon: "💬", action: "msg", description: "Send message" },
  { name: "Jump", icon: "⬆️", action: "jump", description: "Jump" },
];

export default function Home() {
  const [status, setStatus] = useState("Connecting...");
  const [response, setResponse] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch("/api/status");
        const d = await r.json();
        setStatus(d.status || "Offline");
      } catch { setStatus("Offline"); }
    };
    check();
    const t = setInterval(check, 5000);
    return () => clearInterval(t);
  }, []);

  const send = async (action: string, args = "") => {
    setLoading(true);
    setResponse("");
    try {
      const r = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, args }),
      });
      const d = await r.json();
      setResponse(d.response || "Sent!");
    } catch { setResponse("Error!"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fff", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <h1 style={{ margin: 0 }}>DCMCBot</h1>
        <span style={{ color: status === "Online" ? "#4ade80" : "#f87171" }}>{status}</span>
      </header>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", maxWidth: "600px" }}>
        {commands.map(c => (
          <button
            key={c.action}
            onClick={() => send(c.action)}
            disabled={loading}
            style={{ padding: "20px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", cursor: "pointer" }}
          >
            <span style={{ fontSize: "20px" }}>{c.icon}</span>
            <div>{c.name}</div>
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && msg && send("msg", msg)}
          placeholder="Message..."
          style={{ flex: 1, padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
        />
        <button onClick={() => msg && send("msg", msg)} style={{ padding: "12px 20px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff" }}>
          Send
        </button>
      </div>
      
      {response && <p style={{ marginTop: "20px", color: "#888" }}>{response}</p>}
    </div>
  );
}
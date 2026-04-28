"use client";

import { useState, useEffect } from "react";

interface Command {
  name: string;
  icon: string;
  action: string;
  description: string;
  color: string;
}

const commands: Command[] = [
  { name: "Coords", icon: "📍", action: "coords", description: "Show position", color: "#55AA55" },
  { name: "Inventory", icon: "🎒", action: "inv", description: "Show inventory", color: "#55AA55" },
  { name: "Health", icon: "❤️", action: "health", description: "Show health", color: "#FF5555" },
  { name: "Food", icon: "🍖", action: "food", description: "Show food level", color: "#FFAA00" },
  { name: "Say", icon: "💬", action: "msg", description: "Send chat message", color: "#55AAAA" },
  { name: "Jump", icon: "⬆️", action: "jump", description: "Jump", color: "#AAAAAA" },
  { name: "Drop", icon: "📦", action: "drop", description: "Drop item", color: "#AA55AA" },
  { name: "Heal", icon: "💚", action: "heal", description: "Heal player", color: "#FF5555" },
  { name: "God Mode", icon: "😇", action: "god", description: "Toggle god mode", color: "#FFFF55" },
  { name: "No Clip", icon: "👻", action: "noclip", description: "Toggle noclip", color: "#AAAAAA" },
  { name: "Speed", icon: "⚡", action: "speed", description: "Set speed", color: "#55AAFF" },
  { name: "Kill", icon: "☠️", action: "kill", description: "Kill yourself", color: "#FF0000" },
];

export default function Home() {
  const [status, setStatus] = useState<string>("Connecting...");
  const [lastResponse, setLastResponse] = useState<string>("");
  const [customMsg, setCustomMsg] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setStatus(data.status || "Unknown");
      if (data.lastResponse) setLastResponse(data.lastResponse);
    } catch {
      setStatus("Offline");
    }
  };

  const sendCommand = async (action: string, args: string = "") => {
    setLoading(action);
    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, args }),
      });
      const data = await res.json();
      setLastResponse(data.response || "Sent!");
    } catch {
      setLastResponse("Error!");
    }
    setLoading(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚔️ DCMCBot</h1>
        <div style={styles.statusBar}>
          <span style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: status === "Online" ? "#55FF55" : "#FF5555",
            boxShadow: `0 0 8px ${status === "Online" ? "#55FF55" : "#FF5555"}`,
          }} />
          <span style={styles.statusText}>{status}</span>
        </div>
      </header>

<main style={styles.main}>
        <div style={styles.grid}>
          {commands.map((cmd) => (
            <button
              key={cmd.action}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 12px",
                background: `linear-gradient(180deg, ${cmd.color} 0%, ${cmd.color}99 100%)`,
                border: "3px solid #000",
                borderRadius: "4px",
                cursor: loading !== null ? "not-allowed" : "pointer",
                opacity: loading !== null ? 0.5 : 1,
              }}
              onClick={() => sendCommand(cmd.action)}
              disabled={loading !== null}
            >
              <span style={styles.icon}>{cmd.icon}</span>
              <span style={styles.name}>{cmd.name}</span>
              <span style={styles.desc}>{cmd.description}</span>
            </button>
          ))}
        </div>

        <div style={styles.customSection}>
          <input
            style={styles.input}
            placeholder="Custom message..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && customMsg && sendCommand("msg", customMsg)}
          />
          <button
            style={styles.sendButton}
            onClick={() => customMsg && sendCommand("msg", customMsg)}
            disabled={!customMsg || loading !== null}
          >
            Send
          </button>
        </div>

        {lastResponse && (
          <div style={styles.response}>
            <strong>Last Response:</strong>
            <p>{lastResponse}</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
    color: "#fff",
    fontFamily: "'Minecraft', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "linear-gradient(90deg, #3b3b3b 0%, #2d2d2d 100%)",
    borderBottom: "4px solid #555",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#FFF",
    textShadow: "2px 2px 0 #000",
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: (color: string) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: color,
    boxShadow: `0 0 8px ${color}`,
  }),
  statusText: {
    fontSize: "14px",
    color: "#AAA",
  },
  main: {
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  button: (color: string) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 12px",
    background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
    border: "3px solid #000",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 0 #000",
    transition: "transform 0.1s",
  }),
  icon: {
    fontSize: "24px",
    marginBottom: "4px",
  },
  name: {
    fontSize: "14px",
    fontWeight: "bold",
    textShadow: "1px 1px 0 #000",
  },
  desc: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.7)",
  },
  customSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    background: "#2d2d2d",
    border: "3px solid #555",
    borderRadius: "4px",
    color: "#FFF",
    fontSize: "14px",
  },
  sendButton: {
    padding: "12px 24px",
    background: "linear-gradient(180deg, #55AA55 0%, #448844 100%)",
    border: "3px solid #000",
    borderRadius: "4px",
    color: "#FFF",
    fontWeight: "bold",
    cursor: "pointer",
  },
  response: {
    padding: "16px",
    background: "#2d2d2d",
    border: "3px solid #555",
    borderRadius: "4px",
  },
};
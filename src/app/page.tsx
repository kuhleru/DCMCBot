"use client";

import { useState, useEffect } from "react";

const commands = [
  { n: "Coords", i: "📍", a: "coords", c: "#22c55e" },
  { n: "Inv", i: "🎒", a: "inv", c: "#22c55e" },
  { n: "Health", i: "❤️", a: "health", c: "#ef4444" },
  { n: "Food", i: "🍖", a: "food", c: "#f59e0b" },
  { n: "Say", i: "💬", a: "msg", c: "#06b6d4" },
  { n: "Jump", i: "⬆️", a: "jump", c: "#6b7280" },
];

export default function Home() {
  const [s, setS] = useState("...");
  const [r, setR] = useState("");
  const [m, setM] = useState("");
  const [l, setL] = useState(false);

  useEffect(() => {
    const f = async () => {
      try {
        const r = await fetch("/api/status");
        const d = await r.json();
        setS(d.status);
        if (d.lastResponse) setR(d.lastResponse);
      } catch { setS("Offline"); }
    };
    f();
    const t = setInterval(f, 3000);
    return () => clearInterval(t);
  }, []);

  const go = async (a: string, b = "") => {
    setL(true);
    try {
      const r = await fetch("/api/command", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: a, args: b }) });
      const d = await r.json();
      setR(d.response || "Sent!");
    } catch { setR("Error"); }
    setL(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid #222" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600", letterSpacing: "0.5px" }}>DCMCBot</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s === "Online" ? "#4ade80" : "#ef4444" }} />
          <span style={{ fontSize: "13px", color: "#666" }}>{s}</span>
        </div>
      </nav>

      <main style={{ padding: "40px 32px", maxWidth: "480px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {commands.map((c, i) => (
            <button key={i} onClick={() => go(c.a)} disabled={l} style={{
              padding: "20px", background: c.c, border: "none", borderRadius: "12px", color: "#fff",
              cursor: l ? "not-allowed" : "pointer", opacity: l ? 0.5 : 1, transition: "transform 0.1s"
            }}>
              <div style={{ fontSize: "22px", marginBottom: "4px" }}>{c.i}</div>
              <div style={{ fontSize: "13px", fontWeight: "500" }}>{c.n}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input value={m} onChange={e => setM(e.target.value)} onKeyDown={e => e.key === "Enter" && m && go("msg", m)}
            placeholder="Type message..." style={{
              flex: 1, padding: "14px 16px", background: "#111", border: "1px solid #222",
              borderRadius: "8px", color: "#fff", fontSize: "14px", outline: "none"
            }} />
          <button onClick={() => m && go("msg", m)} disabled={!m || l} style={{
            padding: "14px 20px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "500", cursor: "pointer"
          }}>Send</button>
        </div>

        {r && <div style={{ marginTop: "24px", padding: "16px", background: "#111", borderRadius: "8px", border: "1px solid #222" }}>
          <span style={{ fontSize: "12px", color: "#555" }}>RESPONSE</span>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#ddd" }}>{r}</p>
        </div>}
      </main>
    </div>
  );
}
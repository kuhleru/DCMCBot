"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const [l, setL] = useState(false);
  const r = useRouter();

  const sub = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setL(true);
    setE("");
    try {
      const rs = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: p }) });
      const d = await rs.json();
      if (d.token) { document.cookie = `token=${d.token}; path=/; max-age=${7*24*60*60}`; r.push("/"); } 
      else { setE("Invalid password"); }
    } catch { setE("Error"); }
    setL(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", fontFamily: "system-ui, sans-serif" }}>
      <form onSubmit={sub} style={{ width: "280px", padding: "32px", background: "#111", borderRadius: "12px", border: "1px solid #222" }}>
        <h2 style={{ margin: "0 0 24px", fontSize: "18px", fontWeight: "600", textAlign: "center" }}>DCMCBot</h2>
        {e && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "16px" }}>{e}</p>}
        <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="PIN" autoFocus
          style={{ width: "100%", padding: "14px", background: "#000", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "16px", textAlign: "center", letterSpacing: "4px", marginBottom: "16px" }} />
        <button type="submit" disabled={l || !p} style={{
          width: "100%", padding: "14px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "500", cursor: "pointer"
        }}>{l ? "..." : "Unlock"}</button>
      </form>
    </div>
  );
}
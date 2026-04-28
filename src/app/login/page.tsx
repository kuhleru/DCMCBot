"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [load, setLoad] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoad(true);
    setErr("");
    
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const d = await r.json();
      
      if (d.token) {
        document.cookie = `token=${d.token}; path=/; max-age=${7*24*60*60}`;
        router.push("/");
      } else {
        setErr(d.error || "Invalid");
      }
    } catch { setErr("Error"); }
    setLoad(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d" }}>
      <form onSubmit={login} style={{ padding: "40px", background: "#151515", borderRadius: "12px", border: "1px solid #333" }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        {err && <p style={{ color: "#f87171" }}>{err}</p>}
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Password"
          style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", marginBottom: "12px" }}
        />
        <button type="submit" disabled={load} style={{ width: "100%", padding: "12px", background: "#2563eb", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
          {load ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
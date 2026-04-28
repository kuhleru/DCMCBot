"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=${7*24*60*60}`;
        router.push("/");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <div style={styles.icon}>🎮</div>
        <h1 style={styles.title}>DCMCBot</h1>
        <p style={styles.subtitle}>Minecraft Control Panel</p>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "48px",
    background: "#141414",
    borderRadius: "16px",
    border: "1px solid #222",
    minWidth: "320px",
  },
  icon: {
    fontSize: "48px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "2px",
  },
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "13px",
  },
  error: {
    margin: 0,
    color: "#f44",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};
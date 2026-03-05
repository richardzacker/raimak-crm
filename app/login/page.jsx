"use client";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { loginRequest } from "@/lib/authConfig";

export default function LoginPage() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length > 0) {
      window.location.href = "/";
    }
  }, [accounts]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0E2347", flexDirection: "column", gap: 24
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 36,
          color: "#FFFFFF", letterSpacing: 4 }}>RAIMAK</div>
        <div style={{ fontFamily: "monospace", fontSize: 12,
          color: "#93C5DE", letterSpacing: 2, marginTop: 4 }}>CRM • V2.0</div>
      </div>
      <button onClick={handleLogin} style={{
        background: "#0284C7", border: "none", borderRadius: 6,
        color: "#fff", padding: "12px 28px", fontWeight: 700,
        fontSize: 14, cursor: "pointer", fontFamily: "monospace",
        letterSpacing: 1
      }}>
        Sign in with Microsoft
      </button>
      <div style={{ color: "#64748B", fontSize: 11, fontFamily: "monospace" }}>
        Use your Raimak Microsoft account
      </div>
    </div>
  );
}
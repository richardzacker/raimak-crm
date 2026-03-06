"use client";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { loginRequest } from "@/lib/authConfig";

export default function LoginPage() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    // Handle the redirect response when returning from Microsoft login
    instance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          instance.setActiveAccount(response.account);
        }
      })
      .catch((e) => console.error("Redirect error:", e));
  }, [instance]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => console.error(e));
  };

  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0E2347",
      flexDirection: "column", gap: 24, fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 36,
          color: "#FFFFFF", letterSpacing: 4 }}>RAIMAK</div>
        <div style={{ fontFamily: "monospace", fontSize: 12,
          color: "#93C5DE", letterSpacing: 2, marginTop: 4 }}>CRM • V2.0</div>
      </div>

      <div style={{ background: "#132F5A", border: "1px solid #1A3A6B",
        borderRadius: 8, padding: "32px 40px", textAlign: "center", minWidth: 320 }}>
        <div style={{ color: "#93C5DE", fontSize: 13, marginBottom: 24 }}>
          Sign in with your Raimak Microsoft account
        </div>
        <button onClick={handleLogin} style={{
          background: "#0284C7", border: "none", borderRadius: 6,
          color: "#fff", padding: "12px 28px", fontWeight: 700,
          fontSize: 14, cursor: "pointer", fontFamily: "monospace",
          letterSpacing: 1, width: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10
        }}>
          <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>
      </div>

      <div style={{ color: "#2A5298", fontSize: 11, fontFamily: "monospace" }}>
        RAIMAK INTERNAL USE ONLY
      </div>
    </div>
  );
}

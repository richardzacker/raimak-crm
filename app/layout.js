"use client";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "@/lib/authConfig";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

function AuthGuard({ children }) {
  const { accounts } = useMsal();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login" || pathname === "/login/";

  useEffect(() => {
    if (!isLogin && accounts.length === 0) {
      router.replace("/login/");
    }
    if (isLogin && accounts.length > 0) {
      router.replace("/");
    }
  }, [accounts, isLogin, router]);

  if (isLogin) return children;
  if (accounts.length === 0) return null;
  return children;
}

export default function RootLayout({ children }) {
  const [msalInstance, setMsalInstance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const instance = new PublicClientApplication(msalConfig);
    instance.initialize()
      .then(() => {
        instance.addEventCallback((event) => {
          if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
            instance.setActiveAccount(event.payload.account);
          }
        });
        // Handle redirect promise on init
        return instance.handleRedirectPromise();
      })
      .then(() => {
        setMsalInstance(instance);
      })
      .catch((e) => {
        console.error("MSAL init error:", e);
        setError(e.message);
      });
  }, []);

  if (error) return (
    <html lang="en"><body style={{ margin:0, padding:20, fontFamily:"monospace", background:"#0E2347", color:"#fff" }}>
      <div>MSAL Error: {error}</div>
      <div style={{ marginTop:8, fontSize:12, color:"#93C5DE" }}>Check Azure Client ID and Tenant ID configuration.</div>
    </body></html>
  );

  if (!msalInstance) return (
    <html lang="en"><body style={{ margin:0, background:"#0E2347", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"#93C5DE", fontFamily:"monospace", fontSize:12 }}>// INITIALIZING...</div>
    </body></html>
  );

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <MsalProvider instance={msalInstance}>
          <AuthGuard>{children}</AuthGuard>
        </MsalProvider>
      </body>
    </html>
  );
}

"use client";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "@/lib/authConfig";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMsal } from "@azure/msal-react";

function AuthGuard({ children }) {
  const { accounts } = useMsal();
  const pathname = usePathname();
  const router   = useRouter();
  const isLogin  = pathname === "/login";

  useEffect(() => {
    if (!isLogin && accounts.length === 0) {
      router.replace("/login");
    }
    if (isLogin && accounts.length > 0) {
      router.replace("/");
    }
  }, [accounts, isLogin, router]);

  if (isLogin) return children;
  if (accounts.length === 0) return null;
  return children;
}

function MsalWrapper({ children }) {
  const [msalInstance, setMsalInstance] = useState(null);

  useEffect(() => {
    const instance = new PublicClientApplication(msalConfig);
    instance.initialize().then(() => {
      instance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
          instance.setActiveAccount(event.payload.account);
        }
      });
      setMsalInstance(instance);
    });
  }, []);

  if (!msalInstance) return null;

  return (
    <MsalProvider instance={msalInstance}>
      <AuthGuard>{children}</AuthGuard>
    </MsalProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <MsalWrapper>{children}</MsalWrapper>
      </body>
    </html>
  );
}
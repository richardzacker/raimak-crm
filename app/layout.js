"use client";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "@/lib/authConfig";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const msalInstance = new PublicClientApplication(msalConfig);

// Set active account on login success
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

function AuthGuard({ children }) {
  const { accounts } = useMsal();
  const pathname  = usePathname();
  const router    = useRouter();
  const isLogin   = pathname === "/login";

  useEffect(() => {
    if (!isLogin && accounts.length === 0) {
      router.replace("/login");
    }
    if (isLogin && accounts.length > 0) {
      router.replace("/");
    }
  }, [accounts, isLogin, router]);

  // On login page always render (shows login UI)
  if (isLogin) return children;
  // On protected pages only render when authenticated
  if (accounts.length === 0) return null;
  return children;
}

export default function RootLayout({ children }) {
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

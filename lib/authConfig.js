export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: "https://raimak-crm-git-master-richardzackers-projects.vercel.app",
    postLogoutRedirectUri: "https://raimak-crm-git-master-richardzackers-projects.vercel.app/login",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Sites.ReadWrite.All"],
};
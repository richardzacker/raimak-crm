export const msalConfig = {
  auth: {
    clientId:    process.env.NEXT_PUBLIC_AZURE_CLIENT_ID,
    authority:   `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: "https://richardzacker.github.io/raimak-crm",
    postLogoutRedirectUri: "https://richardzacker.github.io/raimak-crm/login",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "Sites.ReadWrite.All",
    "offline_access",
  ],
};
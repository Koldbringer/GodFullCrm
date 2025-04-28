"use client";
import { ReactNode } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "../../src/msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export function MsalClientProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
}

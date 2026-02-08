"use client";

import { ReactNode } from "react";
import { WagmiProvider, http, fallback } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "ChainForge",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      http("https://base-sepolia.drpc.org"),
      http("https://base-sepolia-rpc.publicnode.com"),
      http("https://sepolia.base.org"),
    ]),
  },
  ssr: true,
});

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

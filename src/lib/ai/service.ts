// AI Service Factory
// Returns the appropriate AI provider based on configuration

import { AIProvider } from "./types";
import { placeholderProvider } from "./placeholder";
import { NvidiaAIProvider } from "./nvidia";
import { OpenRouterAIProvider } from "./openrouter";

export type AIMode = "placeholder" | "nvidia" | "openrouter";

function getAIMode(): AIMode {
  const mode = process.env.NEXT_PUBLIC_AI_MODE as AIMode;
  if (mode && ["placeholder", "nvidia", "openrouter"].includes(mode)) {
    return mode;
  }
  return "placeholder";
}

function createNvidiaProvider(): AIProvider {
  const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY;
  if (!apiKey) {
    console.warn("NVIDIA API key not configured, falling back to placeholder");
    return placeholderProvider;
  }
  return new NvidiaAIProvider({
    apiKey,
    baseUrl: process.env.NEXT_PUBLIC_NVIDIA_BASE_URL,
    model: process.env.NEXT_PUBLIC_NVIDIA_MODEL,
  });
}

function createOpenRouterProvider(): AIProvider {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("OpenRouter API key not configured, falling back to placeholder");
    return placeholderProvider;
  }
  return new OpenRouterAIProvider({
    apiKey,
    model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "ChainForge",
  });
}

let cachedProvider: AIProvider | null = null;

/**
 * Get the configured AI provider
 * Uses NEXT_PUBLIC_AI_MODE to determine which provider to use:
 * - "placeholder" (default): Rule-based, no external API needed
 * - "nvidia": NVIDIA NIM API
 * - "openrouter": OpenRouter API (supports multiple models)
 */
export function getAIProvider(): AIProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const mode = getAIMode();

  switch (mode) {
    case "nvidia":
      cachedProvider = createNvidiaProvider();
      break;
    case "openrouter":
      cachedProvider = createOpenRouterProvider();
      break;
    case "placeholder":
    default:
      cachedProvider = placeholderProvider;
      break;
  }

  console.log(`AI Provider initialized: ${cachedProvider.name}`);
  return cachedProvider;
}

/**
 * Reset the cached provider (useful for testing or config changes)
 */
export function resetAIProvider(): void {
  cachedProvider = null;
}

// Re-export types for convenience
export * from "./types";

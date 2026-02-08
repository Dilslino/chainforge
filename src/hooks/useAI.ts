"use client";

import { useState, useCallback } from "react";
import {
  getAIProvider,
  TaskAnalysis,
  VerificationResult,
  AgentMatch,
  Agent,
} from "@/lib/ai/service";

/**
 * Hook for analyzing task complexity, estimating hours, and suggesting budget
 */
export function useTaskAnalysis() {
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async (title: string, description: string) => {
    if (!title && !description) {
      setAnalysis(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = getAIProvider();
      const result = await provider.analyzeTask(title, description);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Analysis failed"));
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analyze,
    analysis,
    isLoading,
    error,
    reset,
  };
}

/**
 * Hook for verifying submitted work against task requirements
 */
export function useWorkVerification() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const verify = useCallback(
    async (
      taskDescription: string,
      submittedProof: string,
      requirements?: string[]
    ) => {
      if (!submittedProof) {
        setResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const provider = getAIProvider();
        const verificationResult = await provider.verifyWork(
          taskDescription,
          submittedProof,
          requirements
        );
        setResult(verificationResult);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Verification failed"));
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    verify,
    result,
    isLoading,
    error,
    reset,
  };
}

/**
 * Hook for matching agents to tasks based on skills and experience
 */
export function useAgentMatching() {
  const [matches, setMatches] = useState<AgentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const match = useCallback(
    async (taskAnalysis: TaskAnalysis, availableAgents: Agent[]) => {
      if (!taskAnalysis || availableAgents.length === 0) {
        setMatches([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const provider = getAIProvider();
        const matchResults = await provider.matchAgents(
          taskAnalysis,
          availableAgents
        );
        setMatches(matchResults);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Matching failed"));
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setMatches([]);
    setError(null);
  }, []);

  return {
    match,
    matches,
    isLoading,
    error,
    reset,
  };
}

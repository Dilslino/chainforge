// AI Integration Types for ChainForge

export type ComplexityLevel = "low" | "medium" | "high";

export interface TaskAnalysis {
  complexity: ComplexityLevel;
  estimatedHours: {
    min: number;
    max: number;
  };
  suggestedBudgetETH: number;
  skills: string[];
  reasoning: string;
  confidence: number; // 0-100
}

export interface Agent {
  id: string;
  address: `0x${string}`;
  name: string;
  skills: string[];
  completedTasks: number;
  successRate: number;
  avgRating: number;
}

export interface AgentMatch {
  agent: Agent;
  matchScore: number; // 0-100
  matchedSkills: string[];
  reasoning: string;
}

export interface VerificationResult {
  score: number; // 0-100
  passed: boolean;
  feedback: string;
  suggestions: string[];
  verifiedAt: Date;
}

export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface AIProvider {
  name: string;

  analyzeTask(
    title: string,
    description: string
  ): Promise<TaskAnalysis>;

  matchAgents(
    taskAnalysis: TaskAnalysis,
    availableAgents: Agent[]
  ): Promise<AgentMatch[]>;

  verifyWork(
    taskDescription: string,
    submittedProof: string,
    requirements?: string[]
  ): Promise<VerificationResult>;
}

// Mock agents for development
export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    address: "0x1234567890123456789012345678901234567890",
    name: "Alex Developer",
    skills: ["solidity", "react", "typescript", "web3"],
    completedTasks: 45,
    successRate: 96,
    avgRating: 4.8,
  },
  {
    id: "agent-2",
    address: "0x2345678901234567890123456789012345678901",
    name: "Sam Designer",
    skills: ["ui/ux", "figma", "css", "tailwind", "react"],
    completedTasks: 32,
    successRate: 94,
    avgRating: 4.7,
  },
  {
    id: "agent-3",
    address: "0x3456789012345678901234567890123456789012",
    name: "Jordan Fullstack",
    skills: ["nodejs", "python", "react", "postgresql", "aws"],
    completedTasks: 67,
    successRate: 98,
    avgRating: 4.9,
  },
  {
    id: "agent-4",
    address: "0x4567890123456789012345678901234567890123",
    name: "Casey Smart Contract",
    skills: ["solidity", "hardhat", "security", "auditing", "defi"],
    completedTasks: 28,
    successRate: 100,
    avgRating: 5.0,
  },
];

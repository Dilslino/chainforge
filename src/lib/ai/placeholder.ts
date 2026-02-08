// Placeholder AI Provider - Rule-based implementation
// Used when no external AI service is configured

import {
  AIProvider,
  TaskAnalysis,
  AgentMatch,
  VerificationResult,
  Agent,
  ComplexityLevel,
} from "./types";

// Skill keywords for extraction
const SKILL_KEYWORDS: Record<string, string[]> = {
  solidity: ["solidity", "smart contract", "evm", "ethereum", "blockchain"],
  react: ["react", "frontend", "ui", "component", "next.js", "nextjs"],
  typescript: ["typescript", "ts", "typed", "javascript"],
  nodejs: ["node", "nodejs", "backend", "api", "server", "express"],
  python: ["python", "django", "flask", "ml", "machine learning"],
  web3: ["web3", "wagmi", "ethers", "viem", "wallet", "dapp"],
  css: ["css", "tailwind", "styling", "responsive", "design"],
  database: ["database", "sql", "postgresql", "mongodb", "redis"],
  security: ["security", "audit", "vulnerability", "penetration"],
  defi: ["defi", "swap", "liquidity", "amm", "lending", "staking"],
};

// Verification keywords that indicate completed work
const VERIFICATION_KEYWORDS = [
  "completed",
  "done",
  "finished",
  "implemented",
  "deployed",
  "tested",
  "fixed",
  "resolved",
  "delivered",
  "submitted",
  "github",
  "repository",
  "commit",
  "pull request",
  "pr",
  "live",
  "demo",
  "screenshot",
  "video",
  "documentation",
];

export class PlaceholderAIProvider implements AIProvider {
  name = "placeholder";

  async analyzeTask(title: string, description: string): Promise<TaskAnalysis> {
    const fullText = `${title} ${description}`.toLowerCase();
    const wordCount = fullText.split(/\s+/).length;

    // Determine complexity by word count
    let complexity: ComplexityLevel;
    let estimatedHours: { min: number; max: number };
    let suggestedBudgetETH: number;

    if (wordCount < 100) {
      complexity = "low";
      estimatedHours = { min: 3, max: 5 };
      suggestedBudgetETH = 0.01;
    } else if (wordCount <= 300) {
      complexity = "medium";
      estimatedHours = { min: 8, max: 15 };
      suggestedBudgetETH = 0.03;
    } else {
      complexity = "high";
      estimatedHours = { min: 20, max: 40 };
      suggestedBudgetETH = 0.08;
    }

    // Extract skills from text
    const skills: string[] = [];
    for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
      if (keywords.some((keyword) => fullText.includes(keyword))) {
        skills.push(skill);
      }
    }

    // Generate reasoning
    const reasoning = `Based on task length (${wordCount} words) and detected technical requirements. ${
      skills.length > 0
        ? `Identified skills: ${skills.join(", ")}.`
        : "No specific technical skills detected."
    }`;

    return {
      complexity,
      estimatedHours,
      suggestedBudgetETH,
      skills: skills.length > 0 ? skills : ["general"],
      reasoning,
      confidence: Math.min(60 + skills.length * 10, 90), // Rule-based = lower confidence
    };
  }

  async matchAgents(
    taskAnalysis: TaskAnalysis,
    availableAgents: Agent[]
  ): Promise<AgentMatch[]> {
    const matches: AgentMatch[] = [];

    for (const agent of availableAgents) {
      // Calculate skill overlap
      const matchedSkills = agent.skills.filter((skill) =>
        taskAnalysis.skills.some(
          (taskSkill) =>
            skill.toLowerCase().includes(taskSkill.toLowerCase()) ||
            taskSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      // Calculate match score
      const skillScore =
        taskAnalysis.skills.length > 0
          ? (matchedSkills.length / taskAnalysis.skills.length) * 50
          : 25;
      const experienceScore = Math.min(agent.completedTasks, 50);
      const successScore = (agent.successRate / 100) * 30;
      const ratingScore = (agent.avgRating / 5) * 20;

      const matchScore = Math.round(
        skillScore * 0.4 +
          experienceScore * 0.2 +
          successScore * 0.2 +
          ratingScore * 0.2
      );

      const reasoning =
        matchedSkills.length > 0
          ? `Matched ${matchedSkills.length} skills. ${agent.completedTasks} tasks completed with ${agent.successRate}% success rate.`
          : `General experience with ${agent.completedTasks} completed tasks.`;

      matches.push({
        agent,
        matchScore,
        matchedSkills,
        reasoning,
      });
    }

    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  async verifyWork(
    taskDescription: string,
    submittedProof: string,
    requirements?: string[]
  ): Promise<VerificationResult> {
    const proofLower = submittedProof.toLowerCase();
    const proofLength = submittedProof.length;

    // Score based on proof length (max 40 points)
    const lengthScore = Math.min(proofLength / 10, 40);

    // Score based on verification keywords (max 30 points)
    const keywordMatches = VERIFICATION_KEYWORDS.filter((keyword) =>
      proofLower.includes(keyword)
    );
    const keywordScore = Math.min(keywordMatches.length * 5, 30);

    // Score based on requirements mentioned (max 30 points)
    let requirementScore = 0;
    const metRequirements: string[] = [];
    if (requirements && requirements.length > 0) {
      for (const req of requirements) {
        if (proofLower.includes(req.toLowerCase())) {
          metRequirements.push(req);
        }
      }
      requirementScore = (metRequirements.length / requirements.length) * 30;
    } else {
      requirementScore = 15; // Neutral if no requirements specified
    }

    const totalScore = Math.round(lengthScore + keywordScore + requirementScore);
    const passed = totalScore >= 60;

    // Generate feedback
    let feedback: string;
    if (totalScore >= 80) {
      feedback = "Excellent submission with comprehensive proof of completion.";
    } else if (totalScore >= 60) {
      feedback = "Acceptable submission. Work appears to be completed.";
    } else if (totalScore >= 40) {
      feedback = "Partial completion detected. Additional proof may be needed.";
    } else {
      feedback = "Insufficient proof of completion provided.";
    }

    // Generate suggestions
    const suggestions: string[] = [];
    if (proofLength < 100) {
      suggestions.push("Provide more detailed description of completed work");
    }
    if (keywordMatches.length < 3) {
      suggestions.push("Include links to deliverables (GitHub, demo, etc.)");
    }
    if (requirements && metRequirements.length < requirements.length) {
      const unmet = requirements.filter((r) => !metRequirements.includes(r));
      suggestions.push(`Address missing requirements: ${unmet.join(", ")}`);
    }
    if (!proofLower.includes("http")) {
      suggestions.push("Add links to prove work completion");
    }

    return {
      score: totalScore,
      passed,
      feedback,
      suggestions,
      verifiedAt: new Date(),
    };
  }
}

export const placeholderProvider = new PlaceholderAIProvider();

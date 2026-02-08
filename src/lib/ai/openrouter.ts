// OpenRouter AI Provider
// Uses OpenRouter API for multi-model AI access
// Documentation: https://openrouter.ai/docs

import {
  AIProvider,
  TaskAnalysis,
  AgentMatch,
  VerificationResult,
  Agent,
  ComplexityLevel,
} from "./types";

export interface OpenRouterConfig {
  apiKey: string;
  model?: string;
  siteUrl?: string;
  siteName?: string;
}

export class OpenRouterAIProvider implements AIProvider {
  name = "openrouter";
  private config: OpenRouterConfig;

  constructor(config: OpenRouterConfig) {
    this.config = config;
  }

  private async callOpenRouter(messages: Array<{ role: string; content: string }>): Promise<string> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": this.config.siteUrl || "https://chainforge.vercel.app",
        "X-Title": this.config.siteName || "ChainForge",
      },
      body: JSON.stringify({
        model: this.config.model || "openai/gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private parseJSON<T>(content: string): T {
    // Try to extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                      content.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
      throw new Error("Failed to parse AI response - no JSON found");
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr.trim());
  }

  async analyzeTask(title: string, description: string): Promise<TaskAnalysis> {
    const systemPrompt = `You are a task analysis AI for a decentralized task marketplace on blockchain.
Analyze the given task and return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "complexity": "low" or "medium" or "high",
  "estimatedHours": { "min": number, "max": number },
  "suggestedBudgetETH": number (0.01 for simple, 0.03 for medium, 0.05-0.1 for complex),
  "skills": ["skill1", "skill2"],
  "reasoning": "brief explanation",
  "confidence": number from 0 to 100
}

Complexity guidelines:
- low: Simple tasks, clear requirements, 1-5 hours
- medium: Moderate complexity, some technical knowledge needed, 5-20 hours
- high: Complex tasks, specialized skills, 20+ hours

Return ONLY the JSON object, nothing else.`;

    const userPrompt = `Analyze this task:

Title: ${title}

Description: ${description}`;

    try {
      const content = await this.callOpenRouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const parsed = this.parseJSON<{
        complexity: string;
        estimatedHours: { min: number; max: number };
        suggestedBudgetETH: number;
        skills: string[];
        reasoning: string;
        confidence: number;
      }>(content);

      return {
        complexity: parsed.complexity as ComplexityLevel,
        estimatedHours: parsed.estimatedHours,
        suggestedBudgetETH: parsed.suggestedBudgetETH,
        skills: parsed.skills,
        reasoning: parsed.reasoning,
        confidence: parsed.confidence,
      };
    } catch (error) {
      console.error("OpenRouter analyzeTask error:", error);
      throw error;
    }
  }

  async matchAgents(
    taskAnalysis: TaskAnalysis,
    availableAgents: Agent[]
  ): Promise<AgentMatch[]> {
    const systemPrompt = `You are an agent matching AI for a decentralized task marketplace.
Given task requirements and available agents, score each agent's suitability.
Return ONLY valid JSON array (no markdown) with this structure for each agent:
[
  {
    "agentId": "agent-id",
    "matchScore": number from 0 to 100,
    "matchedSkills": ["skill1", "skill2"],
    "reasoning": "why this agent matches"
  }
]
Sort by matchScore descending. Return ONLY the JSON array.`;

    const userPrompt = `Task requires these skills: ${taskAnalysis.skills.join(", ")}
Complexity: ${taskAnalysis.complexity}

Available agents:
${availableAgents.map(a => `- ${a.id}: ${a.name}, Skills: ${a.skills.join(", ")}, Completed: ${a.completedTasks}, Success: ${a.successRate}%`).join("\n")}`;

    try {
      const content = await this.callOpenRouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const parsed = this.parseJSON<Array<{
        agentId: string;
        matchScore: number;
        matchedSkills: string[];
        reasoning: string;
      }>>(content);

      return parsed.map(match => {
        const agent = availableAgents.find(a => a.id === match.agentId);
        if (!agent) return null;
        return {
          agent,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          reasoning: match.reasoning,
        };
      }).filter((m): m is AgentMatch => m !== null);
    } catch (error) {
      console.error("OpenRouter matchAgents error:", error);
      throw error;
    }
  }

  async verifyWork(
    taskDescription: string,
    submittedProof: string,
    requirements?: string[]
  ): Promise<VerificationResult> {
    const systemPrompt = `You are a work verification AI for a decentralized task marketplace.
Evaluate if submitted work proof meets the task requirements.
Return ONLY valid JSON (no markdown) with this structure:
{
  "score": number from 0 to 100,
  "passed": true or false (passed if score >= 60),
  "feedback": "detailed feedback about the submission",
  "suggestions": ["suggestion1", "suggestion2"] (improvements if not passed)
}
Return ONLY the JSON object.`;

    const userPrompt = `Task Description:
${taskDescription}

${requirements?.length ? `Requirements:\n${requirements.map(r => `- ${r}`).join("\n")}\n\n` : ""}Submitted Proof:
${submittedProof}`;

    try {
      const content = await this.callOpenRouter([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const parsed = this.parseJSON<{
        score: number;
        passed: boolean;
        feedback: string;
        suggestions: string[];
      }>(content);

      return {
        score: parsed.score,
        passed: parsed.passed,
        feedback: parsed.feedback,
        suggestions: parsed.suggestions,
        verifiedAt: new Date(),
      };
    } catch (error) {
      console.error("OpenRouter verifyWork error:", error);
      throw error;
    }
  }
}

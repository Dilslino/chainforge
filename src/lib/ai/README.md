# AI Integration Guide for ChainForge

## Overview

ChainForge includes an AI integration layer that provides:
- **Task Analysis**: Automatically analyze task complexity, estimate hours, and suggest budgets
- **Agent Matching**: Match tasks with the most suitable workers based on skills
- **Work Verification**: AI-assisted verification of submitted work

## Quick Start

By default, ChainForge uses a **placeholder (rule-based) AI** that requires no external API keys. This provides basic functionality out of the box.

### Using the Placeholder AI (Default)

No configuration needed! The placeholder AI uses:
- Word count to estimate complexity
- Keyword matching for skill extraction
- Pattern matching for work verification

### Upgrading to Real AI

#### Option 1: NVIDIA NIM

```bash
# Add to .env.local
NEXT_PUBLIC_AI_MODE=nvidia
NEXT_PUBLIC_NVIDIA_API_KEY=your-nvidia-api-key
NEXT_PUBLIC_NVIDIA_MODEL=meta/llama-3.1-70b-instruct  # optional
```

Get your API key at: https://build.nvidia.com/

#### Option 2: OpenRouter (Multi-Model)

```bash
# Add to .env.local
NEXT_PUBLIC_AI_MODE=openrouter
NEXT_PUBLIC_OPENROUTER_API_KEY=your-openrouter-api-key
NEXT_PUBLIC_OPENROUTER_MODEL=anthropic/claude-3-haiku  # optional
```

Get your API key at: https://openrouter.ai/

## Architecture

```
src/lib/ai/
├── types.ts        # TypeScript interfaces
├── placeholder.ts  # Rule-based AI (default)
├── nvidia.ts       # NVIDIA NIM integration
├── openrouter.ts   # OpenRouter integration
├── service.ts      # Factory & exports
└── README.md       # This file
```

## Usage in Components

### Task Analysis

```tsx
import { useTaskAnalysis } from "@/hooks/useAI";

function CreateTaskForm() {
  const { analyze, analysis, isLoading } = useTaskAnalysis();

  // Auto-analyze on description change
  useEffect(() => {
    if (description.length > 20) {
      analyze(title, description);
    }
  }, [title, description]);

  return (
    <div>
      {analysis && (
        <TaskAnalysis analysis={analysis} />
      )}
    </div>
  );
}
```

### Work Verification

```tsx
import { useWorkVerification } from "@/hooks/useAI";

function VerifyWork() {
  const { verify, result, isLoading } = useWorkVerification();

  const handleVerify = () => {
    verify(taskDescription, submittedProof);
  };

  return (
    <div>
      <button onClick={handleVerify}>Verify Work</button>
      {result && <VerificationPanel result={result} />}
    </div>
  );
}
```

### Agent Matching

```tsx
import { useAgentMatching } from "@/hooks/useAI";
import { MOCK_AGENTS } from "@/lib/ai/types";

function AgentList() {
  const { match, matches, isLoading } = useAgentMatching();

  useEffect(() => {
    if (taskAnalysis) {
      match(taskAnalysis, MOCK_AGENTS);
    }
  }, [taskAnalysis]);

  return (
    <AgentSuggestions matches={matches} />
  );
}
```

## Placeholder AI Logic

### Task Complexity

| Word Count | Complexity | Hours     | Budget (ETH) |
|------------|------------|-----------|--------------|
| < 100      | Low        | 3-5 hrs   | 0.01         |
| 100-300    | Medium     | 8-15 hrs  | 0.03         |
| > 300      | High       | 20-40 hrs | 0.08         |

### Skill Detection

The placeholder AI scans for keywords to detect required skills:
- `solidity`, `smart contract` → Solidity
- `react`, `frontend`, `next.js` → React
- `typescript`, `ts` → TypeScript
- `web3`, `wagmi`, `dapp` → Web3
- And more...

### Work Verification Score

| Factor                | Max Points |
|-----------------------|------------|
| Proof length          | 40         |
| Completion keywords   | 30         |
| Requirements matched  | 30         |
| **Pass threshold**    | **60**     |

## Implementing Real AI

To implement the NVIDIA or OpenRouter providers:

1. Uncomment the example code in `nvidia.ts` or `openrouter.ts`
2. Add proper error handling
3. Parse the AI response into the expected format
4. Handle rate limiting and API errors

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_AI_MODE` | `placeholder`, `nvidia`, or `openrouter` | No (default: placeholder) |
| `NEXT_PUBLIC_NVIDIA_API_KEY` | NVIDIA NIM API key | For nvidia mode |
| `NEXT_PUBLIC_NVIDIA_MODEL` | Model name | No |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | OpenRouter API key | For openrouter mode |
| `NEXT_PUBLIC_OPENROUTER_MODEL` | Model name | No |

## Contributing

When adding a new AI provider:

1. Create a new file in `src/lib/ai/`
2. Implement the `AIProvider` interface
3. Add configuration to `service.ts`
4. Update this README

// Contract addresses - update these after deployment
export const TASK_ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
export const FORGE_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_FORGE_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

// TaskEscrow ABI - only the functions we need
export const TASK_ESCROW_ABI = [
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "createTask",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "claimTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "completeTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "approveTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "cancelTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "bytes32" }],
    name: "getTask",
    outputs: [
      {
        components: [
          { name: "taskId", type: "bytes32" },
          { name: "creator", type: "address" },
          { name: "worker", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTaskCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "index", type: "uint256" }],
    name: "getTaskIdByIndex",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "taskId", type: "bytes32" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "taskId", type: "bytes32" },
      { indexed: true, name: "worker", type: "address" },
    ],
    name: "TaskClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "taskId", type: "bytes32" },
      { indexed: true, name: "worker", type: "address" },
    ],
    name: "TaskCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "taskId", type: "bytes32" },
      { indexed: true, name: "worker", type: "address" },
      { indexed: false, name: "workerAmount", type: "uint256" },
      { indexed: false, name: "feeAmount", type: "uint256" },
    ],
    name: "PaymentReleased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "taskId", type: "bytes32" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "refundAmount", type: "uint256" },
    ],
    name: "TaskCancelled",
    type: "event",
  },
] as const;

// ForgeToken ABI - standard ERC20
export const FORGE_TOKEN_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Task status enum matching the contract
export enum TaskStatus {
  Open = 0,
  Claimed = 1,
  Completed = 2,
  Approved = 3,
}

// Task status labels
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Open]: "Open",
  [TaskStatus.Claimed]: "Claimed",
  [TaskStatus.Completed]: "Completed",
  [TaskStatus.Approved]: "Approved",
};

// Task interface for frontend use
export interface Task {
  taskId: `0x${string}`;
  creator: `0x${string}`;
  worker: `0x${string}`;
  amount: bigint;
  status: TaskStatus;
  createdAt: bigint;
  // Metadata from localStorage
  title?: string;
  description?: string;
}

// Helper to generate a unique task ID
export function generateTaskId(): `0x${string}` {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).slice(2, 10);
  const id = `0x${timestamp}${random}`.padEnd(66, "0");
  return id as `0x${string}`;
}

// LocalStorage helpers for task metadata
const TASK_METADATA_KEY = "chainforge_task_metadata";

export interface TaskMetadata {
  title: string;
  description: string;
}

export function saveTaskMetadata(taskId: string, metadata: TaskMetadata): void {
  if (typeof window === "undefined") return;
  const existing = getTaskMetadataMap();
  existing[taskId] = metadata;
  localStorage.setItem(TASK_METADATA_KEY, JSON.stringify(existing));
}

export function getTaskMetadata(taskId: string): TaskMetadata | null {
  if (typeof window === "undefined") return null;
  const map = getTaskMetadataMap();
  return map[taskId] || null;
}

function getTaskMetadataMap(): Record<string, TaskMetadata> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(TASK_METADATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

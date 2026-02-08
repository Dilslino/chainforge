"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  usePublicClient,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  TASK_ESCROW_ADDRESS,
  TASK_ESCROW_ABI,
  Task,
  TaskStatus,
  generateTaskId,
  saveTaskMetadata,
  getTaskMetadata,
} from "@/lib/contracts";

// Hook for creating a task
export function useCreateTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createTask = useCallback(
    async (title: string, description: string, budgetEth: string) => {
      const taskId = generateTaskId();

      // Save metadata to localStorage first
      saveTaskMetadata(taskId, { title, description });

      // Create task on chain
      writeContract({
        address: TASK_ESCROW_ADDRESS,
        abi: TASK_ESCROW_ABI,
        functionName: "createTask",
        args: [taskId],
        value: parseEther(budgetEth),
      });

      return taskId;
    },
    [writeContract]
  );

  return {
    createTask,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook for claiming a task
export function useClaimTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimTask = useCallback(
    (taskId: `0x${string}`) => {
      writeContract({
        address: TASK_ESCROW_ADDRESS,
        abi: TASK_ESCROW_ABI,
        functionName: "claimTask",
        args: [taskId],
      });
    },
    [writeContract]
  );

  return {
    claimTask,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook for completing a task
export function useCompleteTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const completeTask = useCallback(
    (taskId: `0x${string}`) => {
      writeContract({
        address: TASK_ESCROW_ADDRESS,
        abi: TASK_ESCROW_ABI,
        functionName: "completeTask",
        args: [taskId],
      });
    },
    [writeContract]
  );

  return {
    completeTask,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook for approving a task
export function useApproveTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveTask = useCallback(
    (taskId: `0x${string}`) => {
      writeContract({
        address: TASK_ESCROW_ADDRESS,
        abi: TASK_ESCROW_ABI,
        functionName: "approveTask",
        args: [taskId],
      });
    },
    [writeContract]
  );

  return {
    approveTask,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook for cancelling a task
export function useCancelTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelTask = useCallback(
    (taskId: `0x${string}`) => {
      writeContract({
        address: TASK_ESCROW_ADDRESS,
        abi: TASK_ESCROW_ABI,
        functionName: "cancelTask",
        args: [taskId],
      });
    },
    [writeContract]
  );

  return {
    cancelTask,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// Hook for fetching all tasks
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const publicClient = usePublicClient();

  const { data: taskCount } = useReadContract({
    address: TASK_ESCROW_ADDRESS,
    abi: TASK_ESCROW_ABI,
    functionName: "getTaskCount",
  });

  const fetchTasks = useCallback(async () => {
    if (!publicClient || taskCount === undefined) return;

    setIsLoading(true);
    setError(null);

    try {
      const count = Number(taskCount);
      const fetchedTasks: Task[] = [];

      for (let i = 0; i < count; i++) {
        // Get task ID
        const taskId = await publicClient.readContract({
          address: TASK_ESCROW_ADDRESS,
          abi: TASK_ESCROW_ABI,
          functionName: "getTaskIdByIndex",
          args: [BigInt(i)],
        });

        // Get task details
        const taskData = await publicClient.readContract({
          address: TASK_ESCROW_ADDRESS,
          abi: TASK_ESCROW_ABI,
          functionName: "getTask",
          args: [taskId],
        });

        // Get metadata from localStorage
        const metadata = getTaskMetadata(taskId);

        fetchedTasks.push({
          taskId: taskData.taskId,
          creator: taskData.creator,
          worker: taskData.worker,
          amount: taskData.amount,
          status: taskData.status as TaskStatus,
          createdAt: taskData.createdAt,
          title: metadata?.title || `Task #${i + 1}`,
          description: metadata?.description || "No description available",
        });
      }

      // Sort by creation time, newest first
      fetchedTasks.sort((a, b) => Number(b.createdAt - a.createdAt));
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tasks"));
    } finally {
      setIsLoading(false);
    }
  }, [publicClient, taskCount]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  };
}

// Hook for getting task action based on status and user
export function useTaskAction(task: Task) {
  const { address } = useAccount();

  const isCreator = address?.toLowerCase() === task.creator.toLowerCase();
  const isWorker = address?.toLowerCase() === task.worker.toLowerCase();

  let action: "claim" | "complete" | "approve" | "cancel" | null = null;
  let actionLabel = "";

  if (task.status === TaskStatus.Open) {
    if (isCreator) {
      action = "cancel";
      actionLabel = "Cancel Task";
    } else if (address) {
      action = "claim";
      actionLabel = "Claim Task";
    }
  } else if (task.status === TaskStatus.Claimed && isWorker) {
    action = "complete";
    actionLabel = "Mark Complete";
  } else if (task.status === TaskStatus.Completed && isCreator) {
    action = "approve";
    actionLabel = "Approve & Pay";
  }

  return { action, actionLabel, isCreator, isWorker };
}

// Format ETH amount for display
export function formatTaskAmount(amount: bigint): string {
  return formatEther(amount);
}

"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus, TASK_STATUS_LABELS } from "@/lib/contracts";
import {
  useTaskAction,
  useClaimTask,
  useCompleteTask,
  useApproveTask,
  useCancelTask,
  formatTaskAmount,
} from "@/hooks/useTaskContract";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { isConnected } = useAccount();
  const { action, actionLabel, isCreator, isWorker } = useTaskAction(task);

  const { claimTask, isPending: isClaimPending, isConfirming: isClaimConfirming } = useClaimTask();
  const { completeTask, isPending: isCompletePending, isConfirming: isCompleteConfirming } = useCompleteTask();
  const { approveTask, isPending: isApprovePending, isConfirming: isApproveConfirming } = useApproveTask();
  const { cancelTask, isPending: isCancelPending, isConfirming: isCancelConfirming } = useCancelTask();

  const isLoading =
    isClaimPending ||
    isClaimConfirming ||
    isCompletePending ||
    isCompleteConfirming ||
    isApprovePending ||
    isApproveConfirming ||
    isCancelPending ||
    isCancelConfirming;

  const handleAction = () => {
    switch (action) {
      case "claim":
        claimTask(task.taskId);
        break;
      case "complete":
        completeTask(task.taskId);
        break;
      case "approve":
        approveTask(task.taskId);
        break;
      case "cancel":
        cancelTask(task.taskId);
        break;
    }
  };

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Open:
        return "default";
      case TaskStatus.Claimed:
        return "secondary";
      case TaskStatus.Completed:
        return "outline";
      case TaskStatus.Approved:
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Open:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case TaskStatus.Claimed:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case TaskStatus.Completed:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case TaskStatus.Approved:
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "";
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
          <Badge className={getStatusColor(task.status)} variant={getStatusVariant(task.status)}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {task.description}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-semibold text-cyan-500">
              {formatTaskAmount(task.amount)} ETH
            </span>
          </div>
          {task.status !== TaskStatus.Open && task.worker !== "0x0000000000000000000000000000000000000000" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worker</span>
              <span className="font-mono text-xs">
                {task.worker.slice(0, 6)}...{task.worker.slice(-4)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Creator</span>
            <span className="font-mono text-xs">
              {task.creator.slice(0, 6)}...{task.creator.slice(-4)}
              {isCreator && <span className="ml-1 text-purple-500">(You)</span>}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isConnected && action && (
          <Button
            className="w-full"
            onClick={handleAction}
            disabled={isLoading}
            variant={action === "cancel" ? "destructive" : action === "approve" ? "default" : "secondary"}
          >
            {isLoading ? "Processing..." : actionLabel}
          </Button>
        )}
        {!isConnected && task.status === TaskStatus.Open && (
          <p className="text-sm text-muted-foreground text-center w-full">
            Connect wallet to claim this task
          </p>
        )}
        {isConnected && !action && task.status !== TaskStatus.Approved && (
          <p className="text-sm text-muted-foreground text-center w-full">
            {isWorker ? "Waiting for approval" : "Task in progress"}
          </p>
        )}
        {task.status === TaskStatus.Approved && (
          <p className="text-sm text-purple-500 text-center w-full font-medium">
            Task completed and paid
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

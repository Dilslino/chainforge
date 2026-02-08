"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { useTasks } from "@/hooks/useTaskContract";
import { TaskStatus, TASK_STATUS_LABELS } from "@/lib/contracts";

export default function TasksPage() {
  const { isConnected } = useAccount();
  const { tasks, isLoading, error, refetch } = useTasks();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      search === "" ||
      task.title?.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Find tasks to work on and earn ETH
          </p>
        </div>
        <Link href="/tasks/create">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
            Post a Task
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={statusFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Badge>
          {Object.entries(TASK_STATUS_LABELS).map(([status, label]) => (
            <Badge
              key={status}
              variant={statusFilter === Number(status) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter(Number(status) as TaskStatus)}
            >
              {label}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-auto">
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">Failed to load tasks</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Be the first to post a task!"}
          </p>
          {!search && statusFilter === "all" && (
            <Link href="/tasks/create">
              <Button>Post a Task</Button>
            </Link>
          )}
        </div>
      )}

      {/* Task Grid */}
      {!isLoading && !error && filteredTasks.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              
            />
          ))}
        </div>
      )}

      {/* Connection Prompt */}
      {!isConnected && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium mb-2">Connect your wallet</p>
          <p className="text-xs text-muted-foreground">
            Connect your wallet to claim tasks and earn ETH
          </p>
        </div>
      )}
    </div>
  );
}

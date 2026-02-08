"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTask } from "@/hooks/useTaskContract";
import { TaskAnalysisComponent } from "@/components/TaskAnalysis";
import { TaskAnalysis } from "@/lib/ai/types";

export function CreateTaskForm() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createTask, isPending, isConfirming, isSuccess, error } = useCreateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [formError, setFormError] = useState("");
  const [_analysis, setAnalysis] = useState<TaskAnalysis | null>(null);

  const handleAnalysisChange = useCallback((newAnalysis: TaskAnalysis | null) => {
    setAnalysis(newAnalysis);
    // Auto-fill suggested budget if user hasn't entered one
    if (newAnalysis && !budget) {
      setBudget(newAnalysis.suggestedBudgetETH.toString());
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!budget || parseFloat(budget) <= 0) {
      setFormError("Budget must be greater than 0");
      return;
    }

    try {
      await createTask(title.trim(), description.trim(), budget);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  // Redirect to tasks page on success
  if (isSuccess) {
    setTimeout(() => {
      router.push("/tasks");
    }, 2000);
  }

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            You need to connect your wallet to create a task.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Task</CardTitle>
        <CardDescription>
          Post a task and lock ETH in escrow. Workers can claim and complete your task to earn the reward.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Build a landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending || isConfirming}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your task in detail. Include requirements, deliverables, and any other relevant information."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending || isConfirming}
              rows={5}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/1000 characters
            </p>
          </div>

          {/* AI Analysis */}
          <TaskAnalysisComponent
            title={title}
            description={description}
            onAnalysisChange={handleAnalysisChange}
          />

          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">
              Budget (ETH)
            </label>
            <Input
              id="budget"
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={isPending || isConfirming}
            />
            <p className="text-xs text-muted-foreground">
              98% goes to the worker, 2% platform fee
            </p>
          </div>

          {(formError || error) && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
              {formError || error?.message || "An error occurred"}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 text-sm text-green-500 bg-green-500/10 rounded-lg">
              Task created successfully! Redirecting to tasks...
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            disabled={isPending || isConfirming || isSuccess}
          >
            {isPending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Creating Task..."
              : isSuccess
              ? "Task Created!"
              : "Create Task & Lock ETH"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

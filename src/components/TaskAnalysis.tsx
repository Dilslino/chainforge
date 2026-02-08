"use client";

import { useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskAnalysis } from "@/hooks/useAI";
import { TaskAnalysis as TaskAnalysisType } from "@/lib/ai/types";

interface TaskAnalysisProps {
  title: string;
  description: string;
  onAnalysisChange?: (analysis: TaskAnalysisType | null) => void;
}

export function TaskAnalysisComponent({
  title,
  description,
  onAnalysisChange,
}: TaskAnalysisProps) {
  const { analyze, analysis, isLoading, error } = useTaskAnalysis();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced analysis - 1 second delay
  const debouncedAnalyze = useCallback(
    (t: string, d: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (t.length > 3 || d.length > 20) {
          analyze(t, d);
        }
      }, 1000);
    },
    [analyze]
  );

  useEffect(() => {
    debouncedAnalyze(title, description);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [title, description, debouncedAnalyze]);

  useEffect(() => {
    onAnalysisChange?.(analysis);
  }, [analysis, onAnalysisChange]);

  if (!title && !description) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-sm">Analyzing task...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/50">
        <CardContent className="py-4">
          <p className="text-sm text-red-500">Analysis failed: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const complexityColors = {
    low: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Card className="border-purple-500/30 bg-purple-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-purple-500">AI Analysis</span>
          <Badge variant="outline" className="text-xs">
            {analysis.confidence}% confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Complexity & Estimates */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Complexity</p>
            <Badge className={complexityColors[analysis.complexity]}>
              {analysis.complexity.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Est. Hours</p>
            <p className="font-semibold text-sm">
              {analysis.estimatedHours.min}-{analysis.estimatedHours.max}h
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Suggested Budget</p>
            <p className="font-semibold text-sm text-cyan-500">
              {analysis.suggestedBudgetETH} ETH
            </p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1">
            {analysis.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Analysis</p>
          <p className="text-xs text-muted-foreground">{analysis.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}

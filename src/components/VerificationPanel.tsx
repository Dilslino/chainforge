"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationResult } from "@/lib/ai/types";

interface VerificationPanelProps {
  result: VerificationResult;
}

export function VerificationPanel({ result }: VerificationPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className={result.passed ? "border-green-500/30" : "border-red-500/30"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            {result.passed ? (
              <span className="text-green-500 text-lg">✓</span>
            ) : (
              <span className="text-red-500 text-lg">✗</span>
            )}
            Work Verification
          </span>
          <Badge
            variant="outline"
            className={result.passed ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
          >
            {result.passed ? "PASSED" : "FAILED"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${result.score * 1.76} 176`}
                className={getScoreColor(result.score)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                {result.score}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium">{result.feedback}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Verified at {result.verifiedAt.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Score</span>
            <span>{result.score}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getScoreBg(result.score)}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>

        {/* Suggestions */}
        {result.suggestions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Suggestions for Improvement
            </p>
            <ul className="space-y-1">
              {result.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-orange-500 mt-0.5">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentMatch } from "@/lib/ai/types";

interface AgentSuggestionsProps {
  matches: AgentMatch[];
  onSelectAgent?: (agent: AgentMatch) => void;
  isLoading?: boolean;
}

export function AgentSuggestions({
  matches,
  onSelectAgent,
  isLoading,
}: AgentSuggestionsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
            <span className="text-sm">Finding best agents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground text-center">
            No agents matched. Try adjusting task requirements.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (score >= 40) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Suggested Agents ({matches.length})
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match, index) => (
          <Card
            key={match.agent.id}
            className={`transition-all hover:shadow-md ${
              index === 0 ? "border-purple-500/50 bg-purple-500/5" : ""
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="text-purple-500 text-xs">★ Best Match</span>
                  )}
                  {match.agent.name}
                </span>
                <Badge className={getMatchBadgeColor(match.matchScore)}>
                  {match.matchScore}% match
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-cyan-500">
                    {match.agent.completedTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-500">
                    {match.agent.successRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-500">
                    {match.agent.avgRating}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Matched Skills */}
              {match.matchedSkills.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.matchedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-purple-500/10 text-purple-500"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* All Skills */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">All Skills</p>
                <div className="flex flex-wrap gap-1">
                  {match.agent.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-xs text-muted-foreground">{match.reasoning}</p>

              {/* Action */}
              {onSelectAgent && (
                <Button
                  size="sm"
                  className="w-full"
                  variant={index === 0 ? "default" : "outline"}
                  onClick={() => onSelectAgent(match)}
                >
                  Select Agent
                </Button>
              )}

              {/* Address */}
              <p className="text-xs text-muted-foreground font-mono text-center">
                {match.agent.address.slice(0, 6)}...{match.agent.address.slice(-4)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

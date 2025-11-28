import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Assessment } from "@shared/schema";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function History() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: assessment, isLoading } = useQuery<Assessment | null>({
    queryKey: ["/api/user-assessment", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await fetch(`/api/user-assessment?userId=${user?.uid}`, {
        credentials: "include",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch assessment");
      return await res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <h1 className="text-lg font-semibold">Assessment History</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {assessment ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Career Assessment</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Taken on {formatDate(new Date(assessment.createdAt))}
                    </p>
                  </div>
                  <Badge>{assessment.matchScore}% Match</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Top Career Match</h3>
                  <p className="text-primary font-semibold text-xl">{assessment.topCareer}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Responses</h3>
                  <div className="space-y-3">
                    {assessment.answers.map((answer, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">Question {answer.questionId}</p>
                        <p className="font-medium">Answer: {answer.selectedOption}</p>
                        <p className="text-xs text-muted-foreground mt-1">Score: {answer.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setLocation("/dashboard")} className="flex-1">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold">No Assessment History</p>
                <p className="text-muted-foreground">You haven't completed a career assessment yet.</p>
                <Button onClick={() => setLocation("/quiz")}>
                  Take Career Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, TrendingUp, DollarSign, Activity, Brain } from "lucide-react";
import type { Assessment, Career } from "@shared/schema";
import { formatSalary } from "@/lib/careerData";

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

  const { data: assessment, isLoading: assessmentLoading } = useQuery<Assessment | null>({
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

  const { data: careerData, isLoading: careerLoading } = useQuery<Career | null>({
    queryKey: ["/api/career-by-name", assessment?.topCareer],
    enabled: !!assessment?.topCareer,
    queryFn: async () => {
      const res = await fetch(`/api/careers-realtime`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch careers");
      const careers = await res.json();
      return careers.find((c: Career) => c.title === assessment?.topCareer) || null;
    },
  });

  if (assessmentLoading || careerLoading) {
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
          {assessment && careerData ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{assessment.topCareer}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Assessed on {formatDate(new Date(assessment.createdAt))}
                    </p>
                  </div>
                  <Badge className="text-lg px-4 py-2">{assessment.matchScore}% Match</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Assessment Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Match Score */}
                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">Match Score</span>
                      </div>
                      <p className="text-3xl font-bold text-primary">{assessment.matchScore}%</p>
                    </CardContent>
                  </Card>

                  {/* Salary Range */}
                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">Salary Range</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatSalary(careerData.salaryRange.min, careerData.salaryRange.max)}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Growth Potential */}
                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">Growth Potential</span>
                      </div>
                      <Progress value={careerData.growthPotential} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{careerData.growthPotential}%</span>
                        <span className="text-xs text-muted-foreground">
                          {careerData.growthPotential > 85 ? "Excellent" : careerData.growthPotential > 70 ? "Good" : "Moderate"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stress Index */}
                  <Card className="bg-card">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">Stress Index</span>
                      </div>
                      <Progress value={careerData.stressIndex} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{careerData.stressIndex}%</span>
                        <span className="text-xs text-muted-foreground">
                          {careerData.stressIndex < 50 ? "Low" : careerData.stressIndex < 75 ? "Moderate" : "High"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Career Description */}
                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">About This Career</h3>
                    <p className="text-muted-foreground leading-relaxed">{careerData.description}</p>
                  </CardContent>
                </Card>

                {/* Required Skills */}
                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {careerData.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setLocation("/dashboard")} className="flex-1">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => setLocation("/")} variant="outline" className="flex-1">
                    Back to Home
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

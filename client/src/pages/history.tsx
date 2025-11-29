import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, TrendingUp, DollarSign, Activity, Brain, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-foreground">Loading Assessment History</p>
            <p className="text-lg text-muted-foreground">Retrieving your career insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DreamWeave
            </span>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Assessment History</h1>
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="h-12 px-6 text-base hover:bg-accent"
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-12 max-w-6xl">
        <div className="space-y-12">
          {assessment && careerData ? (
            <div className="space-y-8">
              {/* Assessment Header */}
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-base px-4 py-2 border-2">
                  Previous Assessment
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {assessment.topCareer}
                </h1>
                <p className="text-xl text-muted-foreground">
  Assessed on {formatDate(assessment.createdAt ? new Date(assessment.createdAt) : new Date())}
</p>
                <Badge className="text-lg px-6 py-3 bg-primary text-primary-foreground text-base font-semibold">
                  {assessment.matchScore}% Overall Match
                </Badge>
              </div>

              {/* Main Assessment Card */}
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-8 space-y-10">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Match Score Card */}
                    <Card className="bg-card border-2 p-1">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Brain className="w-7 h-7 text-primary" />
                          <span className="font-semibold text-lg">Your Match Score</span>
                        </div>
                        <p className="text-4xl font-bold text-primary text-center">{assessment.matchScore}%</p>
                        <div className="text-center">
                          <Progress value={assessment.matchScore} className="h-3 mt-2" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Salary Range Card */}
                    <Card className="bg-card border-2 p-1">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-7 h-7 text-primary" />
                          <span className="font-semibold text-lg">Salary Range</span>
                        </div>
                        <p className="text-2xl font-bold text-primary text-center">
                          {formatSalary(careerData.salaryRange.min)} - {formatSalary(careerData.salaryRange.max)}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Growth Potential Card */}
                    <Card className="bg-card border-2 p-1">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-7 h-7 text-primary" />
                          <span className="font-semibold text-lg">Growth Potential</span>
                        </div>
                        <div className="space-y-3">
                          <Progress value={careerData.growthPotential} className="h-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">{careerData.growthPotential}%</span>
                            <Badge variant="outline" className="text-sm">
                              {careerData.growthPotential > 85 ? "Excellent" : careerData.growthPotential > 70 ? "Good" : "Moderate"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stress Index Card */}
                    <Card className="bg-card border-2 p-1">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Activity className="w-7 h-7 text-primary" />
                          <span className="font-semibold text-lg">Stress Index</span>
                        </div>
                        <div className="space-y-3">
                          <Progress value={careerData.stressIndex} className="h-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">{careerData.stressIndex}%</span>
                            <Badge variant="outline" className="text-sm">
                              {careerData.stressIndex < 50 ? "Low" : careerData.stressIndex < 75 ? "Moderate" : "High"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Career Description */}
                  <Card className="bg-card border-2">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-xl mb-2">About This Career Path</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{careerData.description}</p>
                    </CardContent>
                  </Card>

                  {/* Required Skills */}
                  <Card className="bg-card border-2">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-xl mb-2">Required Skills & Competencies</h3>
                      <div className="flex flex-wrap gap-3">
                        {careerData.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-base px-4 py-2 border-2">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personality Traits */}
                  {careerData.personalityTraits && careerData.personalityTraits.length > 0 && (
                    <Card className="bg-card border-2">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-xl mb-2">Ideal Personality Traits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {careerData.personalityTraits.map((trait, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border">
                              <span className="text-primary text-lg">✦</span>
                              <span className="text-base font-medium">{trait}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Industry Trends */}
                  <Card className="bg-card border-2">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-xl mb-2">Industry Trends & Outlook</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {careerData.industryTrends}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button 
                      onClick={() => setLocation("/dashboard")} 
                      className="flex-1 h-14 text-lg font-semibold"
                      size="lg"
                    >
                      Explore More Careers
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                    <Button 
                      onClick={() => setLocation("/quiz")} 
                      variant="outline" 
                      className="flex-1 h-14 text-lg font-semibold border-2"
                      size="lg"
                    >
                      Retake Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Empty State */
            <Card className="border-2 shadow-xl text-center py-16">
              <CardContent className="space-y-8 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">No Assessment History</h3>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    You haven't completed a career assessment yet. Take the quiz to discover your ideal career path!
                  </p>
                </div>
                <Button 
                  onClick={() => setLocation("/quiz")} 
                  size="lg"
                  className="h-14 text-lg font-semibold px-8"
                >
                  Start Career Assessment
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
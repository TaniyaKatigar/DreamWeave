import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, Download, TrendingUp, DollarSign, Activity, Brain } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { CareerMatchResponse, QuizAnswer } from "@shared/schema";
import { formatSalary } from "@/lib/careerData";
import { generateCareerReport } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";

export default function Results() {
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const stored = sessionStorage.getItem("quizAnswers");
    if (!stored) {
      setLocation("/quiz");
      return;
    }
    setAnswers(JSON.parse(stored));
  }, [setLocation]);

  const saveAssessmentMutation = useMutation({
    mutationFn: async (data: { answers: QuizAnswer[]; topCareer: string; matchScore: number }) => {
      const res = await apiRequest("POST", "/api/save-assessment", {
        userId: user?.uid,
        ...data,
      });
      return await res.json();
    },
  });

  const { data: matchResults, isLoading } = useQuery<CareerMatchResponse>({
    queryKey: ["/api/match", JSON.stringify(answers)],
    enabled: answers.length > 0,
    queryFn: async () => {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to get career matches");
      }
      const data = await res.json();
      
      if (data.topMatches && data.topMatches.length > 0) {
        const topMatch = data.topMatches[0];
        saveAssessmentMutation.mutate({
          answers,
          topCareer: topMatch.career.title,
          matchScore: topMatch.matchScore,
        });
      }
      
      return data;
    },
  });

  if (isLoading || !matchResults) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  const topMatch = matchResults.topMatches[0];
  const career = topMatch.career;

  const handleDownloadReport = () => {
    try {
      generateCareerReport(topMatch);
      toast({
        title: "Report Downloaded",
        description: "Your career report has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewAR = () => {
    sessionStorage.setItem("selectedCareer", JSON.stringify(career));
    setLocation("/ar-preview");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWave</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-home">
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-sm">
              Your Career Match Results
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              {career.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {career.description}
            </p>
          </div>

          <Card className="p-8">
            <CardContent className="p-0 space-y-8">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - topMatch.matchScore / 100)}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary" data-testid="match-score">
                      {topMatch.matchScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Match Score</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Salary Range</span>
                  </div>
                  <div className="text-2xl font-semibold" data-testid="salary-range">
                    {formatSalary(career.salaryRange.min, career.salaryRange.max)}
                  </div>
                  <p className="text-sm text-muted-foreground">Annual (₹ Lakhs)</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Growth Potential</span>
                  </div>
                  <Progress value={career.growthPotential} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{career.growthPotential}%</span>
                    <span className="text-muted-foreground">Excellent</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>Stress Index</span>
                  </div>
                  <Progress value={career.stressIndex} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{career.stressIndex}%</span>
                    <span className="text-muted-foreground">
                      {career.stressIndex < 50 ? "Low" : career.stressIndex < 75 ? "Moderate" : "High"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="h-4 w-4" />
                    <span>Mismatch Risk</span>
                  </div>
                  <Progress value={career.mismatchProbability} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{career.mismatchProbability}%</span>
                    <span className="text-muted-foreground">
                      {career.mismatchProbability < 20 ? "Very Low" : career.mismatchProbability < 35 ? "Low" : "Moderate"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Personality Match</span>
                  <span className="font-semibold">{topMatch.breakdown.personalityMatch}%</span>
                </div>
                <Progress value={topMatch.breakdown.personalityMatch} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skills Match</span>
                  <span className="font-semibold">{topMatch.breakdown.skillsMatch}%</span>
                </div>
                <Progress value={topMatch.breakdown.skillsMatch} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Interests Match</span>
                  <span className="font-semibold">{topMatch.breakdown.interestsMatch}%</span>
                </div>
                <Progress value={topMatch.breakdown.interestsMatch} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Industry Trends & Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {career.industryTrends}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {career.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1" 
              onClick={handleViewAR}
              data-testid="button-view-ar"
            >
              View AR Preview
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              onClick={handleDownloadReport}
              data-testid="button-download-report"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/quiz")}
              data-testid="button-retake-quiz"
            >
              Take Quiz Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

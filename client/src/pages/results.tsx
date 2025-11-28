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
import { useCareerMetrics } from "@/lib/useCareerMetrics";

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

  // Call hook at top level before any conditionals
  const careerName = matchResults?.topMatches?.[0]?.career?.title || null;
  const { data: metricsData, isLoading: metricsLoading } = useCareerMetrics(careerName);

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

  // Validate and extract salary range properly
  const validateSalaryRange = (range: any) => {
    if (range?.min && range?.max) {
      const min = typeof range.min === 'number' ? range.min : parseInt(range.min, 10);
      const max = typeof range.max === 'number' ? range.max : parseInt(range.max, 10);
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    }
    return null;
  };

  // Use Gemini metrics if available, otherwise use career data
  const validGeminiRange = validateSalaryRange(metricsData?.salaryRange);
  const salaryRange = validGeminiRange || career.salaryRange;
  const growthPotential = metricsData?.growthPotential || career.growthPotential;
  const stressIndex = metricsData?.stressIndex || career.stressIndex;
  const mismatchProbability = metricsData?.mismatchProbability || career.mismatchProbability;
  const industryTrends = metricsData?.industryTrends || career.industryTrends;
  const personalityMatch = metricsData?.personalityMatch || topMatch.breakdown.personalityMatch;
  const skillsMatch = metricsData?.skillsMatch || topMatch.breakdown.skillsMatch;
  const interestsMatch = metricsData?.interestsMatch || topMatch.breakdown.interestsMatch;

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

  const handleTryCareer = (matchResult: typeof topMatch) => {
    sessionStorage.setItem("selectedCareerMatch", JSON.stringify(matchResult));
    setLocation("/career-detail");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-home">
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {career.image && (
            <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
              <img 
                src={career.image} 
                alt={career.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
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
                    {formatSalary(salaryRange.min, salaryRange.max)} {metricsLoading && <span className="text-xs text-muted-foreground">(updating...)</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">Annual (₹ Lakhs)</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>Growth Potential</span>
                  </div>
                  <Progress value={growthPotential} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{growthPotential}%</span>
                    <span className="text-muted-foreground">Excellent</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span>Stress Index</span>
                  </div>
                  <Progress value={stressIndex} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{stressIndex}%</span>
                    <span className="text-muted-foreground">
                      {stressIndex < 50 ? "Low" : stressIndex < 75 ? "Moderate" : "High"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="h-4 w-4" />
                    <span>Mismatch Risk</span>
                  </div>
                  <Progress value={mismatchProbability} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{mismatchProbability}%</span>
                    <span className="text-muted-foreground">
                      {mismatchProbability < 20 ? "Very Low" : mismatchProbability < 35 ? "Low" : "Moderate"}
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
                  <span className="font-semibold">{personalityMatch}%</span>
                </div>
                <Progress value={personalityMatch} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skills Match</span>
                  <span className="font-semibold">{skillsMatch}%</span>
                </div>
                <Progress value={skillsMatch} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Interests Match</span>
                  <span className="font-semibold">{interestsMatch}%</span>
                </div>
                <Progress value={interestsMatch} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Fit Overview {metricsLoading && <span className="text-xs text-muted-foreground ml-2">(AI-powered)</span>}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Industry Insights</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {industryTrends}
                </p>
              </div>
              {metricsData?.careerFitAnalysis && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-3">Why This Career Fits You</p>
                  <ul className="space-y-2">
                    {metricsData.careerFitAnalysis.split('\n').filter((line: string) => line.trim()).map((point: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary font-semibold flex-shrink-0">•</span>
                        <span>{point.trim().replace(/^[-•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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

          {/* Other Career Matches */}
          {matchResults.topMatches.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Explore Other Career Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchResults.topMatches.slice(1).map((match) => (
                    <Card key={match.career.id} className="hover-elevate overflow-hidden flex flex-col">
                      {match.career.image && (
                        <div className="w-full h-40 overflow-hidden">
                          <img 
                            src={match.career.image} 
                            alt={match.career.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="pt-6 space-y-4 flex-1 flex flex-col">
                        <div>
                          <h3 className="text-lg font-semibold">{match.career.title}</h3>
                          <p className="text-sm text-muted-foreground">{match.career.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Match Score</p>
                            <p className="text-2xl font-bold text-primary">{match.matchScore}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Salary</p>
                            <p className="text-sm font-semibold">{formatSalary(match.career.salaryRange.min)}</p>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleTryCareer(match)}
                          className="w-full mt-auto"
                          data-testid={`button-try-career-${match.career.id}`}
                        >
                          Try This Career
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

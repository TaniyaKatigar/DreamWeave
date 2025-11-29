import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { Sparkles, ArrowRight, Download, TrendingUp, DollarSign, Activity, Brain, Eye, Home } from "lucide-react";
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

  const [progress, setProgress] = useState(33);

  useEffect(() => {
    if (isLoading || !matchResults) {
      setProgress(33);
    } else if (metricsLoading) {
      setProgress(66);
    } else {
      setProgress(100);
    }
  }, [isLoading, matchResults, metricsLoading]);

  if (isLoading || !matchResults || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-8">
        <div className="w-full fixed top-0 left-0 z-50">
          <Progress value={progress} className="h-2 rounded-none" />
        </div>
        <div className="text-center space-y-8 max-w-md">
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">
                {isLoading || !matchResults ? "Analyzing Your Responses" : "Generating Career Insights"}
              </p>
              <p className="text-lg text-muted-foreground">
                {isLoading || !matchResults 
                  ? "Processing your quiz answers with our AI matching algorithm..." 
                  : "Fetching real-time career metrics and industry trends..."}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>
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
        title: "Report Downloaded Successfully!",
        description: "Your comprehensive career report has been generated and saved.",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DreamWeave
            </span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")} 
            className="h-12 px-6 text-base hover:bg-accent"
            data-testid="button-home"
          >
            <Home className="mr-3 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12 max-w-6xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <Badge variant="outline" className="text-base px-6 py-3 border-2">
              🎉 Your Career Match Results
            </Badge>
            
            {career.image && (
              <div className="w-full max-w-4xl mx-auto h-80 rounded-2xl overflow-hidden border-2 shadow-xl">
                <img 
                  src={career.image} 
                  alt={career.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {career.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {career.description}
              </p>
            </div>
          </div>

          {/* Main Match Card */}
          <Card className="border-2 shadow-2xl">
            <CardContent className="p-10 space-y-12">
              {/* Match Score Visualization */}
              <div className="flex flex-col items-center space-y-8">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="116"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="116"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 116}`}
                      strokeDashoffset={`${2 * Math.PI * 116 * (1 - topMatch.matchScore / 100)}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <div className="text-6xl font-bold text-primary" data-testid="match-score">
                      {topMatch.matchScore}%
                    </div>
                    <div className="text-lg font-semibold text-muted-foreground">Overall Match Score</div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-7 w-7 text-primary" />
                      <span className="font-semibold text-lg">Salary Range</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary" data-testid="salary-range">
                        {formatSalary(salaryRange.min)} - {formatSalary(salaryRange.max)}
                      </div>
                      <p className="text-base text-muted-foreground">Annual (₹ Lakhs)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-7 w-7 text-primary" />
                      <span className="font-semibold text-lg">Growth Potential</span>
                    </div>
                    <div className="space-y-3">
                      <Progress value={growthPotential} className="h-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{growthPotential}%</span>
                        <Badge variant="outline" className="text-sm">
                          {growthPotential > 85 ? "Excellent" : growthPotential > 70 ? "Good" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-7 w-7 text-primary" />
                      <span className="font-semibold text-lg">Stress Index</span>
                    </div>
                    <div className="space-y-3">
                      <Progress value={stressIndex} className="h-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{stressIndex}%</span>
                        <Badge variant="outline" className="text-sm">
                          {stressIndex < 50 ? "Low" : stressIndex < 75 ? "Moderate" : "High"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-7 w-7 text-primary" />
                      <span className="font-semibold text-lg">Mismatch Risk</span>
                    </div>
                    <div className="space-y-3">
                      <Progress value={mismatchProbability} className="h-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{mismatchProbability}%</span>
                        <Badge variant="outline" className="text-sm">
                          {mismatchProbability < 20 ? "Very Low" : mismatchProbability < 35 ? "Low" : "Moderate"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Match Breakdown */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Detailed Match Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground font-medium">Personality Alignment</span>
                    <span className="font-bold text-lg">{personalityMatch}%</span>
                  </div>
                  <Progress value={personalityMatch} className="h-3" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground font-medium">Skills Compatibility</span>
                    <span className="font-bold text-lg">{skillsMatch}%</span>
                  </div>
                  <Progress value={skillsMatch} className="h-3" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground font-medium">Interests Match</span>
                    <span className="font-bold text-lg">{interestsMatch}%</span>
                  </div>
                  <Progress value={interestsMatch} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Insights */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                Career Fit Overview 
                <Badge variant="outline" className="text-sm">AI-Powered Insights</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Industry Insights & Trends</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {industryTrends}
                </p>
              </div>
              {metricsData?.careerFitAnalysis && (
                <div className="pt-6 border-t space-y-6">
                  <h3 className="text-xl font-semibold">Why This Career Fits You</h3>
                  <ul className="space-y-4">
                    {metricsData.careerFitAnalysis.split('\n').filter((line: string) => line.trim()).map((point: string, idx: number) => (
                      <li key={idx} className="text-base text-muted-foreground flex gap-4 items-start">
                        <span className="text-primary text-lg font-semibold flex-shrink-0 mt-0.5">✦</span>
                        <span className="leading-relaxed">{point.trim().replace(/^[-•]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Required Skills & Competencies</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4">
                {career.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-base px-4 py-2 border-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Button 
              size="lg" 
              className="flex-1 h-14 text-lg font-semibold" 
              onClick={handleViewAR}
              data-testid="button-view-ar"
            >
              <Eye className="mr-3 h-6 w-6" />
              Experience AR Preview
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1 h-14 text-lg font-semibold border-2"
              onClick={handleDownloadReport}
              data-testid="button-download-report"
            >
              <Download className="mr-3 h-6 w-6" />
              Download Career Report
            </Button>
          </div>

          {/* Other Career Matches */}
          {matchResults.topMatches.length > 1 && (
            <Card className="border-2 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Explore Other Career Matches</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {matchResults.topMatches.slice(1).map((match) => (
                    <Card key={match.career.id} className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 overflow-hidden flex flex-col">
                      {match.career.image && (
                        <div className="w-full h-48 overflow-hidden">
                          <img 
                            src={match.career.image} 
                            alt={match.career.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold">{match.career.title}</h3>
                          <Badge variant="outline" className="w-fit">{match.career.category}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Match Score</p>
                            <p className="text-3xl font-bold text-primary">{match.matchScore}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Salary Range</p>
                            <p className="text-lg font-semibold">{formatSalary(match.career.salaryRange.min)}</p>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleTryCareer(match)}
                          className="w-full h-12 text-base font-semibold mt-auto"
                          data-testid={`button-try-career-${match.career.id}`}
                        >
                          Explore This Career
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
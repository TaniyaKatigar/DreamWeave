import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, DollarSign, Activity, Brain, Eye, Sparkles, Download } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import type { CareerMatchResult } from "@shared/schema";
import { formatSalary } from "@/lib/careerData";
import CareerFitmap from "@/components/career-fitmap";
import { generateCareerReport } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function CareerDetail() {
  const [, setLocation] = useLocation();
  const [matchResult, setMatchResult] = useState<CareerMatchResult | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCareerMatch");
    if (!stored) {
      setLocation("/");
      return;
    }
    const matchData = JSON.parse(stored);
    setMatchResult(matchData);
    
    // Track career exploration
    if (user?.uid && matchData.career) {
      fetch("/api/track-career-exploration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, careerTitle: matchData.career.title }),
        credentials: "include",
      }).catch(err => console.error("Error tracking career exploration:", err));
    }
  }, [setLocation, user]);

  if (!matchResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-xl text-muted-foreground">Loading Career Details...</p>
        </div>
      </div>
    );
  }

  const { career, matchScore } = matchResult;

  const handleViewAR = () => {
    sessionStorage.setItem("selectedCareer", JSON.stringify(career));
    setLocation("/ar-preview");
  };

  const handleDownloadReport = () => {
    try {
      generateCareerReport(matchResult);
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
            onClick={() => setLocation("/results")}
            className="flex items-center gap-3 h-12 px-6 text-base hover:bg-accent"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12 max-w-7xl">
        <div className="space-y-12">
          {/* Career Header Section */}
          <div className="text-center space-y-6">
            <Badge variant="outline" className="text-base px-4 py-2 border-2">
              {career.category}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {career.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {career.description}
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Key Metrics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Match Score Card */}
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold text-primary">
                      {matchScore}%
                    </div>
                    <div className="text-lg font-semibold text-muted-foreground">
                      Overall Match Score
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Card */}
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-7 h-7 text-primary" />
                    <span className="font-semibold text-lg">Salary Range</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatSalary(career.salaryRange.min)} - {formatSalary(career.salaryRange.max)}
                  </p>
                </CardContent>
              </Card>

              {/* Growth Potential Card */}
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-primary" />
                    <span className="font-semibold text-lg">Growth Potential</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={career.growthPotential} className="flex-1 h-3" />
                    <span className="font-bold text-lg min-w-12">{career.growthPotential}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Stress Index Card */}
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-7 h-7 text-primary" />
                    <span className="font-semibold text-lg">Stress Index</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={career.stressIndex} className="flex-1 h-3" />
                    <span className="font-bold text-lg min-w-12">{career.stressIndex}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Fitmap Visualization */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card className="border-2 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      Career Fit Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CareerFitmap matchResult={matchResult} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Skills & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Required Skills Card */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {career.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm px-4 py-2 border-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-2 bg-primary/5">
                <CardContent className="p-6 space-y-4">
                  <Button 
                    size="lg" 
                    onClick={handleViewAR}
                    className="w-full h-14 text-lg font-semibold"
                    data-testid="button-try-ar"
                  >
                    <Eye className="mr-3 w-5 h-5" />
                    Experience AR Preview
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleDownloadReport}
                    className="w-full h-14 text-lg font-semibold border-2"
                    data-testid="button-download-report"
                  >
                    <Download className="mr-3 w-5 h-5" />
                    Download Career Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Industry Trends Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Industry Trends & Market Outlook</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {career.industryTrends}
              </p>
            </CardContent>
          </Card>

          {/* Personality Traits Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Ideal Personality Traits</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {career.personalityTraits.map((trait) => (
                  <div key={trait} className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border">
                    <span className="text-primary text-lg">✦</span>
                    <span className="text-base font-semibold">{trait}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
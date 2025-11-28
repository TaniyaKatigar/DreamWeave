import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, DollarSign, Activity, Brain, Eye, Sparkles, Download } from "lucide-react";
import { useLocation } from "wouter";
import type { CareerMatchResult } from "@shared/schema";
import { formatSalary } from "@/lib/careerData";
import CareerFitmap from "@/components/career-fitmap";
import { generateCareerReport } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function CareerDetail() {
  const [, setLocation] = useLocation();
  const [matchResult, setMatchResult] = useState<CareerMatchResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCareerMatch");
    if (!stored) {
      setLocation("/");
      return;
    }
    setMatchResult(JSON.parse(stored));
  }, [setLocation]);

  const { toast } = useToast();

  if (!matchResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/results")}
            className="flex items-center gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="space-y-8">
          {/* Career Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-sm">
              {career.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">{career.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {career.description}
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Metrics */}
            <div className="md:col-span-1 space-y-4">
              {/* Salary */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Salary Range</span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {formatSalary(career.salaryRange.min)} - {formatSalary(career.salaryRange.max)}
                  </p>
                </CardContent>
              </Card>

              {/* Growth */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Growth Potential</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={career.growthPotential} className="flex-1" />
                    <span className="font-bold text-sm">{career.growthPotential}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Stress */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Stress Index</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={career.stressIndex} className="flex-1" />
                    <span className="font-bold text-sm">{career.stressIndex}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Fitmap */}
            <div className="md:col-span-1">
              <CareerFitmap matchResult={matchResult} />
            </div>

            {/* Right Column - Skills & Actions */}
            <div className="md:col-span-1 space-y-4">
              {/* Required Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  onClick={handleViewAR}
                  className="w-full"
                  data-testid="button-try-ar"
                >
                  <Eye className="mr-2 w-4 h-4" />
                  Try AR Preview
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleDownloadReport}
                  className="w-full"
                  data-testid="button-download-report"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          {/* Industry Trends */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Industry Trends & Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {career.industryTrends}
              </p>
            </CardContent>
          </Card>

          {/* Personality Traits */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Ideal Personality Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {career.personalityTraits.map((trait) => (
                  <div key={trait} className="flex items-center gap-2 p-3 bg-primary/5 rounded-md">
                    <span className="text-primary">●</span>
                    <span className="text-sm font-medium">{trait}</span>
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

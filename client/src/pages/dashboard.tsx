import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ArrowRight, Download } from "lucide-react";
import { careers } from "@/lib/careerData";
import type { Assessment, CareerMatchResult } from "@shared/schema";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function formatSalary(salary: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary);
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: assessment, isLoading } = useQuery<Assessment>({
    queryKey: ["/api/user-assessment", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await fetch(`/api/user-assessment?userId=${user?.uid}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch assessment");
      return await res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your career matches...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-lg font-semibold">No Assessment Found</p>
            <p className="text-muted-foreground">Start by taking the career quiz to get your personalized matches.</p>
            <Button onClick={() => setLocation("/quiz")} className="w-full">
              Take Career Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate match results from assessment answers
  const matchResults: CareerMatchResult[] = assessment.answers
    .flatMap((answer) => {
      const option = careers
        .flatMap((c) => c.options || [])
        .find((opt) => opt.id === answer.selectedOption);
      return option?.careers || [];
    })
    .reduce((acc, careerTitle) => {
      const career = careers.find((c) => c.title === careerTitle);
      if (career) {
        const existing = acc.find((m) => m.career.id === career.id);
        if (existing) {
          existing.matchScore += answer.value;
        } else {
          acc.push({
            career,
            matchScore: answer.value,
            breakdown: { personalityMatch: answer.value, skillsMatch: 0, interestsMatch: 0 },
          });
        }
      }
      return acc;
    }, [] as CareerMatchResult[])
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  const handleViewAR = (match: CareerMatchResult) => {
    sessionStorage.setItem("selectedCareer", JSON.stringify(match.career));
    setLocation("/ar-preview");
  };

  const handleDownloadReport = async (match: CareerMatchResult) => {
    setIsDownloading(true);
    try {
      const reportElement = document.createElement("div");
      reportElement.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px;">
          <h1 style="color: #333; margin-bottom: 10px;">${match.career.title}</h1>
          <p style="color: #666; font-size: 14px; margin-bottom: 30px;">Career Assessment Report</p>
          
          <h2 style="color: #333; margin-top: 30px;">Match Score</h2>
          <p style="font-size: 24px; color: #7c3aed; font-weight: bold;">${match.matchScore}%</p>
          
          <h2 style="color: #333; margin-top: 30px;">Category</h2>
          <p style="color: #666;">${match.career.category}</p>
          
          <h2 style="color: #333; margin-top: 30px;">Salary Range</h2>
          <p style="color: #666;">${formatSalary(match.career.salaryRange.min)} - ${formatSalary(
        match.career.salaryRange.max
      )}</p>
          
          <h2 style="color: #333; margin-top: 30px;">Description</h2>
          <p style="color: #666; line-height: 1.6;">${match.career.description}</p>
          
          <h2 style="color: #333; margin-top: 30px;">Required Skills</h2>
          <ul style="color: #666;">
            ${match.career.requiredSkills.map((skill) => `<li>${skill}</li>`).join("")}
          </ul>
          
          <p style="color: #999; font-size: 12px; margin-top: 40px;">Generated by DreamWeave Career Platform</p>
        </div>
      `;

      const canvas = await html2canvas(reportElement);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${match.career.title}-Report.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <h1 className="text-lg font-semibold">Your Career Matches</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-3xl font-bold text-primary">{matchResults.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Top Match Score</p>
                <p className="text-3xl font-bold text-primary">{matchResults[0]?.matchScore || 0}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(matchResults.reduce((sum, m) => sum + m.matchScore, 0) / matchResults.length) || 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Career Matches Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Explore Your Career Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchResults.map((match) => (
                <Card key={match.career.id} className="hover-elevate flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{match.career.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{match.career.category}</p>
                      </div>
                      <Badge variant="secondary">{match.matchScore}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">{match.career.description}</p>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Salary Range</p>
                      <p className="font-semibold">
                        {formatSalary(match.career.salaryRange.min)} - {formatSalary(match.career.salaryRange.max)}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleViewAR(match)}
                        size="sm"
                        className="flex-1"
                        data-testid={`button-view-ar-${match.career.id}`}
                      >
                        View AR
                      </Button>
                      <Button
                        onClick={() => handleDownloadReport(match)}
                        size="sm"
                        variant="outline"
                        disabled={isDownloading}
                        data-testid={`button-download-${match.career.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setLocation(`/career-detail?careerTitle=${match.career.title}`)}
                        size="sm"
                        variant="outline"
                        data-testid={`button-details-${match.career.id}`}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Browse More */}
          <Card className="bg-muted/30 border-0">
            <CardContent className="pt-6 text-center space-y-4">
              <h3 className="text-lg font-semibold">Want to explore more careers?</h3>
              <p className="text-muted-foreground">Check out all available careers and their AR previews.</p>
              <Button onClick={() => setLocation("/browse-careers")} variant="outline">
                Browse All Careers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

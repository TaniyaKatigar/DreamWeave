import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, DollarSign, Activity, Brain } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { formatSalary } from "@/lib/careerData";
import { useRealtimeCareers } from "@/lib/useRealtimeCareers";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: careers = [], isLoading: careersLoading } = useRealtimeCareers();
  const [selectedCareer, setSelectedCareer] = useState<typeof careers[0] | null>(null);
  const { user } = useAuth();

  const trackCareerExploration = async (careerTitle: string) => {
    if (user?.uid) {
      try {
        await fetch("/api/track-career-exploration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, careerTitle }),
          credentials: "include",
        });
      } catch (err) {
        console.error("Error tracking career exploration:", err);
      }
    }
  };

  const handleTryAR = (career: typeof careers[0]) => {
    sessionStorage.setItem("selectedCareer", JSON.stringify(career));
    trackCareerExploration(career.title);
    setLocation("/ar-preview");
  };

  const handleClose = () => {
    setSelectedCareer(null);
  };

  if (selectedCareer) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="mb-6"
            data-testid="button-back"
          >
            ← Back
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{selectedCareer.title}</CardTitle>
                  <Badge className="bg-accent text-accent-foreground">{selectedCareer.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedCareer.workspace3dModel && (
                <div className="w-full h-80 bg-muted rounded-lg overflow-hidden border border-border">
                  <model-viewer
                    src={selectedCareer.workspace3dModel}
                    alt={`${selectedCareer.title} Workspace`}
                    auto-rotate
                    camera-controls
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              <p className="text-lg text-muted-foreground">{selectedCareer.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Salary Range</span>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {formatSalary(selectedCareer.salaryRange.min)} - {formatSalary(selectedCareer.salaryRange.max)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Growth Potential</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedCareer.growthPotential} className="flex-1" />
                      <span className="font-bold text-sm">{selectedCareer.growthPotential}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Stress Index</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedCareer.stressIndex} className="flex-1" />
                      <span className="font-bold text-sm">{selectedCareer.stressIndex}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Skills Match</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCareer.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Industry Trends */}
              <Card className="bg-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Industry Trends</h3>
                  <p className="text-muted-foreground">{selectedCareer.industryTrends}</p>
                </CardContent>
              </Card>

              {/* CTA */}
              <Button 
                size="lg" 
                onClick={() => handleTryAR(selectedCareer)}
                className="w-full"
                data-testid="button-try-ar"
              >
                Try AR Preview <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (careersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading real-time career data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Careers</h1>
          <p className="text-lg text-muted-foreground">Browse all career options powered by real-time AI insights and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((career) => (
            <Card 
              key={career.id} 
              className="hover-elevate cursor-pointer transition-all overflow-hidden flex flex-col"
              onClick={() => setSelectedCareer(career)}
              data-testid={`card-career-${career.id}`}
            >
              {career.workspace3dModel && (
                <div className="w-full h-48 bg-muted border-b border-border overflow-hidden">
                  <model-viewer
                    src={career.workspace3dModel}
                    alt={`${career.title} Workspace`}
                    auto-rotate
                    camera-controls
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{career.title}</CardTitle>
                <Badge className="w-fit">{career.category}</Badge>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-2">{career.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Growth: {career.growthPotential}%</span>
                    <span>Stress: {career.stressIndex}%</span>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {formatSalary(career.salaryRange.min)} - {formatSalary(career.salaryRange.max)}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto"
                  data-testid={`button-explore-${career.id}`}
                >
                  Explore <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

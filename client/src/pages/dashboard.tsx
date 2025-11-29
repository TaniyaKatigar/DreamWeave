import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, DollarSign, Activity, Brain, ArrowLeft, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="mb-8 h-12 px-6 text-base hover:bg-accent"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back to Dashboard
          </Button>

          {/* Career Detail Card */}
          <Card className="mb-8 overflow-hidden border-2 shadow-2xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <CardTitle className="text-4xl font-bold tracking-tight">{selectedCareer.title}</CardTitle>
                  <Badge className="bg-accent text-accent-foreground text-base px-4 py-2">
                    {selectedCareer.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              {/* Career Image */}
              {selectedCareer.image && (
                <div className="w-full h-96 bg-muted rounded-xl overflow-hidden border-2 border-border shadow-lg">
                  <img 
                    src={selectedCareer.image} 
                    alt={selectedCareer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <p className="text-xl text-muted-foreground leading-relaxed">{selectedCareer.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary Card */}
                <Card className="bg-card border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-lg">Salary Range</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {formatSalary(selectedCareer.salaryRange.min)} - {formatSalary(selectedCareer.salaryRange.max)}
                    </p>
                  </CardContent>
                </Card>

                {/* Growth Potential Card */}
                <Card className="bg-card border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-lg">Growth Potential</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={selectedCareer.growthPotential} className="flex-1 h-3" />
                      <span className="font-bold text-lg min-w-12">{selectedCareer.growthPotential}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Stress Index Card */}
                <Card className="bg-card border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-lg">Stress Index</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={selectedCareer.stressIndex} className="flex-1 h-3" />
                      <span className="font-bold text-lg min-w-12">{selectedCareer.stressIndex}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Card */}
                <Card className="bg-card border-2 p-1">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-primary" />
                      <span className="font-semibold text-lg">Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-sm px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Industry Trends */}
              <Card className="bg-card border-2">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-xl mb-2">Industry Trends & Outlook</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{selectedCareer.industryTrends}</p>
                </CardContent>
              </Card>

              {/* Personality Traits */}
              <Card className="bg-card border-2">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-xl mb-2">Personality Traits</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedCareer.personalityTraits.map((trait, idx) => (
                      <Badge key={idx} className="bg-primary/20 text-primary text-base px-4 py-2">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <Button 
                size="lg" 
                onClick={() => handleTryAR(selectedCareer)}
                className="w-full h-14 text-lg font-semibold mt-4"
                data-testid="button-try-ar"
              >
                Experience AR Workspace Preview 
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (careersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-foreground">Loading Career Insights</p>
            <p className="text-lg text-muted-foreground">Fetching real-time career data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Career Dashboard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore real-time career insights powered by AI. Discover opportunities and experience workspaces through immersive AR previews.
          </p>
        </div>

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {careers.map((career) => (
            <Card 
              key={career.id} 
              className="hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col border-2 group"
              onClick={() => setSelectedCareer(career)}
              data-testid={`card-career-${career.id}`}
            >
              {career.image && (
                <div className="w-full h-52 overflow-hidden bg-muted">
                  <img 
                    src={career.image} 
                    alt={career.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="p-6 pb-4">
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-bold tracking-tight">{career.title}</CardTitle>
                  <Badge className="w-fit text-sm px-3 py-1 bg-accent text-accent-foreground">
                    {career.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-6 flex-1 flex flex-col">
                <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 flex-1">
                  {career.description}
                </p>
                
                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-medium">Growth Potential</span>
                    <span className="font-bold text-primary">{career.growthPotential}%</span>
                  </div>
                  <div className="flex justify-between items-center text-base">
                    <span className="font-medium">Stress Index</span>
                    <span className="font-bold text-orange-500">{career.stressIndex}%</span>
                  </div>
                  <div className="text-lg font-bold text-primary text-center pt-2">
                    {formatSalary(career.salaryRange.min)} - {formatSalary(career.salaryRange.max)}
                  </div>
                </div>

                {/* Explore Button */}
                <Button 
                  size="lg" 
                  className="w-full h-12 text-base font-semibold mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  data-testid={`button-explore-${career.id}`}
                >
                  Explore Career 
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {careers.length === 0 && !careersLoading && (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">No Careers Available</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Career data is currently being updated. Please check back soon for the latest insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
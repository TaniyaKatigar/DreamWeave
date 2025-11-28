import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Info } from "lucide-react";
import { useLocation } from "wouter";
import type { Career } from "@shared/schema";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ARPreview() {
  const [, setLocation] = useLocation();
  const [career, setCareer] = useState<Career | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedCareer");
    if (!stored) {
      setLocation("/");
      return;
    }
    setCareer(JSON.parse(stored));
  }, [setLocation]);

  if (!career) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const careerContextPoints: Record<string, string[]> = {
    "Software Engineer": [
      "Use keyboard and mouse to write and test code",
      "Collaborate with team members via video calls and chat",
      "Debug issues using developer tools and logs",
      "Review code and participate in technical discussions",
    ],
    "UX Designer": [
      "Sketch ideas and create wireframes on digital canvas",
      "Interview users to understand their needs and pain points",
      "Build interactive prototypes for user testing",
      "Collaborate with developers to implement designs",
    ],
    "Data Scientist": [
      "Clean and analyze large datasets using Python/R",
      "Build predictive models using machine learning",
      "Create visualizations to communicate insights",
      "Present findings to stakeholders and leadership",
    ],
    "Healthcare Professional": [
      "Examine patients and diagnose medical conditions",
      "Perform medical procedures and treatments",
      "Maintain detailed patient records and charts",
      "Collaborate with medical team for patient care",
    ],
  };

  const contextPoints = careerContextPoints[career.title] || [
    "Experience the day-to-day work environment",
    "Interact with common tools and equipment",
    "Understand the workspace layout and setup",
    "Get a feel for the career atmosphere",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/results")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 bg-muted/30 flex items-center justify-center p-6 min-h-[70vh]">
          <div className="w-full max-w-4xl">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <model-viewer
                    src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                    alt={`${career.title} workspace preview`}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    data-testid="ar-model-viewer"
                  >
                    <div slot="progress-bar" className="progress-bar">
                      <div className="update-bar"></div>
                    </div>
                  </model-viewer>
                </div>
                <div className="p-6 bg-background border-t">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1"
                      data-testid="button-view-in-space"
                    >
                      View in Your Space (AR)
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      data-testid="button-fullscreen"
                    >
                      Fullscreen View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">AR Controls</p>
                <p>
                  Drag to rotate • Pinch to zoom • On mobile, tap "View in Your Space" to see this in AR through your camera
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 border-l bg-background p-6 space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              {career.category}
            </div>
            <h1 className="text-2xl font-bold">{career.title}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {career.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What You'll Do</h3>
            <ul className="space-y-3">
              {contextPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-semibold">Key Traits for Success</h3>
            <div className="flex flex-wrap gap-2">
              {career.personalityTraits.map((trait, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button 
              className="w-full" 
              onClick={() => setLocation("/results")}
              data-testid="button-back-to-results"
            >
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

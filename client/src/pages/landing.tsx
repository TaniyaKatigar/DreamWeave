import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Eye, TrendingUp, Award, LogOut, Headphones } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ProfileDropdown } from "@/components/profile-dropdown";
import heroImage from "@assets/generated_images/hero_section_ar_student_illustration.png";
import arDemoImage from "@assets/generated_images/ar_demo_interface_mockup.png";
import logoImage from "@assets/Dream__1_-removebg-preview_1764358132723.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Eye,
      title: "WebAR Career Previews",
      description: "Experience realistic workplace environments through your smartphone camera with immersive AR overlays.",
    },
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze your personality, skills, and interests to recommend the perfect career fit.",
    },
    {
      icon: TrendingUp,
      title: "Future Predictions",
      description: "Get insights on salary ranges, growth potential, stress levels, and industry trends for each career.",
    },
    {
      icon: Award,
      title: "Personalized Reports",
      description: "Download comprehensive PDF reports with your match breakdown and recommended next steps.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="DreamWeave" className="h-30 w-40" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setLocation("/browse-careers")} className="h-12 px-6" data-testid="button-browse-careers-nav">
                  Browse All Careers
                </Button>
                <ProfileDropdown />
              </div>
            ) : (
              <Button variant="outline" size="lg" onClick={() => setLocation("/login")} className="h-12 px-6" data-testid="button-signin-nav">
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Experience Your Future Career
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Make informed career decisions with immersive WebAR workplace previews and AI-powered matching. 
                  Discover your ideal path in just 6 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button 
                    size="lg" 
                    className="h-16 text-lg px-10 py-6 font-semibold"
                    onClick={() => setLocation("/quiz")}
                    data-testid="button-start-quiz-hero"
                  >
                    Start Career Assessment
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-16 text-lg px-10 py-6 font-semibold border-2"
                    onClick={() => setLocation("/browse-careers")}
                    data-testid="button-try-ar-careers"
                  >
                    <Eye className="mr-3 h-6 w-6" />
                    Try AR Previews
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-base text-muted-foreground">
                  <Badge variant="outline" className="text-sm px-4 py-2">Free Forever</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2">6-Minute Quiz</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2">No Credit Card</Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={heroImage} 
                alt="Student experiencing AR career preview" 
                className="w-full max-w-2xl h-auto rounded-3xl shadow-2xl border-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Career Choice Crisis</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Too many students choose careers based on assumptions, family pressure, or generic tests. 
                This leads to dissatisfaction, dropouts, and wasted years.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <Card className="p-8 border-2 text-center">
                  <CardContent className="p-0 space-y-3">
                    <div className="text-5xl font-bold text-primary">67%</div>
                    <div className="text-base font-medium text-muted-foreground">Career Mismatch</div>
                  </CardContent>
                </Card>
                <Card className="p-8 border-2 text-center">
                  <CardContent className="p-0 space-y-3">
                    <div className="text-5xl font-bold text-primary">42%</div>
                    <div className="text-base font-medium text-muted-foreground">College Dropouts</div>
                  </CardContent>
                </Card>
                <Card className="p-8 border-2 text-center">
                  <CardContent className="p-0 space-y-3">
                    <div className="text-5xl font-bold text-primary">53%</div>
                    <div className="text-base font-medium text-muted-foreground">Employability Gap</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>
                  Traditional career counseling lacks <strong className="text-foreground font-semibold">experiential understanding</strong>. 
                  Students can't visualize what a role actually involves.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>
                  Generic aptitude tests ignore <strong className="text-foreground font-semibold">personality fit</strong> and 
                  provide no insight into <strong className="text-foreground font-semibold">future outcomes</strong>.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <p>
                  DreamWeave bridges this gap with immersive AR previews and predictive AI matching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Three simple steps to discover your ideal career path with confidence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Take Assessment", desc: "Answer 6 insightful questions about your interests, skills, and personality traits" },
              { step: "02", title: "Explore AR Previews", desc: "View immersive workplace environments through your smartphone camera" },
              { step: "03", title: "Get AI Insights", desc: "Receive personalized career recommendations with future projections" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="p-10 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2">
                  <CardContent className="p-0 space-y-8 text-center">
                    <div className="w-40 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                      <span className="text-6xl font-bold text-primary">{item.step}</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-1 bg-border transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to make confident, informed career decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 h-full">
                  <CardContent className="p-0 space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold leading-tight">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AR Demo Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <img 
                src={arDemoImage} 
                alt="AR interface demo" 
                className="w-full max-w-2xl h-auto rounded-3xl shadow-2xl border-2"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Immersive WebAR Experience</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    View realistic 3D workplace environments directly through your smartphone camera
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Interact with tools and equipment used in different professional careers
                  </p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Experience career environments before committing to years of education and training
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-8 max-w-5xl text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to Discover Your Ideal Career?</h2>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto">
            Join thousands of students making informed career decisions with DreamWeave's immersive technology
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-16 text-lg px-12 py-6 font-semibold bg-background text-foreground hover:bg-background/90 border-2"
            onClick={() => setLocation("/quiz")}
            data-testid="button-start-quiz-cta"
          >
            Start Your Journey Today
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <div className="flex justify-center gap-6 text-base opacity-75">
            <span>Free Forever</span>
            <span>•</span>
            <span>6-Minute Assessment</span>
            <span>•</span>
            <span>No Credit Card Required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 bg-background">
        <div className="container mx-auto px-8 max-w-7xl text-center">
          <div className="flex items-center justify-center mb-8">
            <img src={logoImage} alt="DreamWeave" className="h-34 w-36" />
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Transforming career counseling with immersive WebAR technology and AI-powered insights. 
            Helping students make confident decisions about their future.
          </p>
        </div>
      </footer>
    </div>
  );
}
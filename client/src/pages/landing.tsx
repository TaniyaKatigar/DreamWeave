import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Brain, Eye, TrendingUp, Users, Award, BarChart3, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/generated_images/hero_section_ar_student_illustration.png";
import arDemoImage from "@assets/generated_images/ar_demo_interface_mockup.png";
import student1 from "@assets/generated_images/student_testimonial_portrait_1.png";
import student2 from "@assets/generated_images/student_testimonial_portrait_2.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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
      icon: BarChart3,
      title: "Career Library",
      description: "Explore detailed profiles of 50+ careers across technology, healthcare, design, business, and more.",
    },
    {
      icon: Award,
      title: "Personalized Reports",
      description: "Download comprehensive PDF reports with your match breakdown and recommended next steps.",
    },
    {
      icon: Users,
      title: "Expert Insights",
      description: "Access curated career data validated by industry professionals and career counselors.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      school: "Delhi University",
      quote: "DreamWeave helped me visualize what being a UX designer actually looks like. The AR preview was amazing!",
      image: student1,
    },
    {
      name: "Rahul Mehta",
      school: "IIT Bombay",
      quote: "I was torn between software engineering and data science. The AI matching gave me clarity I needed.",
      image: student2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setLocation("/quiz")} data-testid="button-quiz-nav">
                  Take Quiz
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  data-testid="button-signout-nav"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setLocation("/login")} data-testid="button-signin-nav">
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="text-sm">
                Trusted by 10,000+ Students
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                Experience Your Future Career
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Make informed career decisions with immersive WebAR workplace previews and AI-powered matching. 
                Discover your ideal path in just 6 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setLocation("/quiz")}
                  data-testid="button-start-quiz-hero"
                >
                  Start Career Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  data-testid="button-watch-demo"
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Free • No credit card • 6-minute quiz
              </p>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Student experiencing AR career preview" 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold">The Problem</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Too many students choose careers based on assumptions, family pressure, or generic tests. 
                This leads to dissatisfaction, dropouts, and wasted years.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <Card className="p-6">
                  <CardContent className="p-0 space-y-2">
                    <div className="text-4xl font-bold text-primary">67%</div>
                    <div className="text-sm text-muted-foreground">Career Mismatch</div>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0 space-y-2">
                    <div className="text-4xl font-bold text-primary">42%</div>
                    <div className="text-sm text-muted-foreground">College Dropouts</div>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardContent className="p-0 space-y-2">
                    <div className="text-4xl font-bold text-primary">53%</div>
                    <div className="text-sm text-muted-foreground">Employability Gap</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Traditional career counseling lacks <strong className="text-foreground">experiential understanding</strong>. 
                Students can't visualize what a role actually involves.
              </p>
              <p>
                Generic aptitude tests ignore <strong className="text-foreground">personality fit</strong> and 
                provide no insight into <strong className="text-foreground">future outcomes</strong>.
              </p>
              <p>
                DreamWeave bridges this gap with immersive AR previews and predictive AI matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to discover your ideal career path
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Take Quiz", desc: "Answer 6 questions about your interests, skills, and personality" },
              { step: "02", title: "Explore AR", desc: "View immersive workplace previews through your phone camera" },
              { step: "03", title: "Get Insights", desc: "Receive personalized career recommendations and future projections" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="p-8 h-full hover-elevate transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-5xl font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-center">{item.title}</h3>
                    <p className="text-muted-foreground text-center leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold">Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make confident career decisions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 hover-elevate transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src={arDemoImage} 
              alt="AR interface demo" 
              className="w-full h-auto rounded-2xl"
            />
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold">WebAR Preview Demo</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">View realistic 3D workplace environments directly through your phone</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Interact with tools and equipment used in different careers</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Experience before you commit to years of education</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Students Helped" },
              { value: "50+", label: "Careers Explored" },
              { value: "25,000+", label: "AR Previews Completed" },
              { value: "92%", label: "Average Match Score" },
            ].map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold">Student Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who found their path with DreamWeave
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-8">
                <CardContent className="p-0 space-y-6">
                  <p className="text-lg leading-relaxed text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.school}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to discover your ideal career?</h2>
          <p className="text-lg md:text-xl opacity-90">
            Join thousands of students making informed career decisions with DreamWeave
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90"
            onClick={() => setLocation("/quiz")}
            data-testid="button-start-quiz-cta"
          >
            Start Career Quiz
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm opacity-75">Free • No credit card • 6-minute quiz</p>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">DreamWeave</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transforming career counseling with immersive WebAR technology and AI-powered insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers Library</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 DreamWeave. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

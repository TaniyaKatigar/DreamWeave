import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles, Brain } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { quizQuestions } from "@/lib/careerData";
import { useAuth } from "@/lib/auth-context";
import type { QuizAnswer, Assessment } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Check if user already completed the quiz
  const { data: userAssessment, isLoading } = useQuery<Assessment>({
    queryKey: ["/api/user-assessment", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await fetch(`/api/user-assessment?userId=${user?.uid}`, {
        credentials: "include",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch assessment");
      return await res.json();
    },
  });

  useEffect(() => {
    if (userAssessment) {
      setLocation("/dashboard");
    }
  }, [userAssessment, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-foreground">Loading Assessment</p>
            <p className="text-lg text-muted-foreground">Checking your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleSelectOption = (optionId: string, value: number) => {
    setSelectedOption(optionId);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: question.id,
      selectedOption: optionId,
      value,
    };
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    if (isLastQuestion) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
      // Redirect to results page to show match results
      setLocation("/results");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1]?.selectedOption || null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]?.selectedOption || null);
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DreamWeave
            </span>
          </div>
          <div className="flex items-center gap-3 text-lg font-semibold text-muted-foreground">
            <Brain className="h-6 w-6" />
            Career Discovery Quiz
          </div>
        </div>
      </header>

      {/* Main Quiz Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-12">
          {/* Progress Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-base font-medium text-muted-foreground">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" data-testid="quiz-progress" />
          </div>

          {/* Question Card */}
          <Card className="border-2 shadow-2xl">
            <CardContent className="p-10 space-y-12">
              {/* Question Header */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wide border border-primary/20">
                  {question.category}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id, option.value)}
                    className={`w-full p-8 text-left rounded-xl border-2 transition-all duration-300 ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/5 shadow-lg scale-105"
                        : "border-border hover:shadow-lg hover:scale-102 hover:border-primary/30"
                    }`}
                    data-testid={`option-${option.id}`}
                  >
                    <p className="text-lg md:text-xl leading-relaxed font-medium">{option.text}</p>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-6 pt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1 h-14 text-lg font-semibold border-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-3 h-6 w-6" />
                  {currentQuestion === 0 ? "Back to Home" : "Previous"}
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="flex-1 h-14 text-lg font-semibold"
                  data-testid="button-next"
                >
                  {isLastQuestion ? "View Your Results" : "Next Question"}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Helper Text */}
          <div className="text-center space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your honest responses help us match you with careers that truly align with your personality, 
              strengths, and interests for long-term satisfaction.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>🎯 Personalized Matching</span>
              <span>•</span>
              <span>🔒 Private & Secure</span>
              <span>•</span>
              <span>⚡ 6-Minute Assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
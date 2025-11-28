import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
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
      setLocation("/results");
    }
  }, [userAssessment, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading...</p>
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DreamWeave</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Career Discovery Quiz
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-1" data-testid="quiz-progress" />
          </div>

          <Card className="p-8 md:p-12">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide">
                  {question.category}
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold leading-tight">
                  {question.question}
                </h2>
              </div>

              <div className="space-y-4">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id, option.value)}
                    className={`w-full p-6 text-left rounded-lg border-2 transition-all ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover-elevate"
                    }`}
                    data-testid={`option-${option.id}`}
                  >
                    <p className="text-base md:text-lg">{option.text}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="flex-1"
                  data-testid="button-next"
                >
                  {isLastQuestion ? "See Results" : "Next"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Your responses help us match you with careers that align with your strengths and interests.
          </p>
        </div>
      </div>
    </div>
  );
}

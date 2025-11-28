import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth-context";
import Landing from "@/pages/landing";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import ARPreview from "@/pages/ar-preview";
import BrowseCareers from "@/pages/browse-careers";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={Results} />
      <Route path="/ar-preview" component={ARPreview} />
      <Route path="/browse-careers" component={BrowseCareers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

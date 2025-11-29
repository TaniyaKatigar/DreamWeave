import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <Card className="w-full max-w-2xl mx-auto border-2 shadow-2xl">
        <CardContent className="p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center border-8 border-destructive/20">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-10">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Technical Info */}
          <div className="bg-muted/50 rounded-xl p-6 mb-10 max-w-lg mx-auto">
            <p className="text-base text-muted-foreground font-medium">
              If you're a developer, check if this page has been added to the router configuration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation("/")}
              className="h-12 text-base font-semibold px-8"
              size="lg"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Home
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="h-12 text-base font-semibold px-8 border-2"
              size="lg"
            >
              <ArrowLeft className="mr-3 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact support if you believe this is an error.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import googleLogoUrl from "@assets/image_1764335543800.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      await signInWithGoogle();
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to DreamWeave! Your account has been created successfully.",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Welcome Back!",
          description: "You have been signed in successfully.",
        });
      }

      setLocation("/");
    } catch (err: any) {
      const errorMessage = err.code === "auth/email-already-in-use"
        ? "Email already in use"
        : err.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err.code === "auth/weak-password"
        ? "Password is too weak"
        : err.message || "Authentication failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-lg border-2 shadow-2xl">
        <CardHeader className="space-y-6 text-center p-8 pb-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DreamWeave
            </span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </CardTitle>
            <p className="text-base text-muted-foreground leading-relaxed">
              {isSignUp
                ? "Join DreamWeave to explore your future career with immersive AR experiences"
                : "Sign in to continue your career discovery journey"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-8 pt-2">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg text-base border border-destructive/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 text-base font-medium border-2"
            data-testid="button-signin-google"
          >
            <img 
              src={googleLogoUrl}
              alt="Google" 
              className="h-6 w-6 aspect-square object-contain"
            />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="email" className="flex items-center gap-3 text-base font-semibold">
                <Mail className="w-5 h-5 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base px-4"
                data-testid="input-email"
                required
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="password" className="flex items-center gap-3 text-base font-semibold">
                <Lock className="w-5 h-5 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "Create a secure password (min. 6 characters)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base px-4"
                data-testid="input-password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
              data-testid={isSignUp ? "button-signup" : "button-signin"}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center text-base pt-4">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <Button
  variant="ghost"
  className="p-0 h-auto text-base font-semibold underline hover:no-underline"
  onClick={() => {
    setIsSignUp(!isSignUp);
    setError("");
  }}
  data-testid="button-toggle-auth"
>
  {isSignUp ? "Sign In" : "Create Account"}
</Button>
          </div>

          {/* Guest Access Option */}
          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setLocation("/browse-careers")}
              data-testid="button-browse-as-guest"
            >
              Continue as guest to explore careers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="mt-8 text-center max-w-md space-y-3">
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🔒 Secure Authentication</span>
          <span>•</span>
          <span>🚀 Instant Access</span>
          <span>•</span>
          <span>🎯 Personalized Experience</span>
        </div>
      </div>
    </div>
  );
}
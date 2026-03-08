import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authSideImg from "@/assets/auth-side.jpg";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({ title: "Account created!", description: "Let's set up your financial profile." });
        navigate("/onboarding");
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left side — Renaissance image */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src={authSideImg}
          alt="Renaissance scholar in a grand library"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-10">
          <p className="font-display text-3xl font-bold text-foreground drop-shadow-md">
            Knowledge is the new currency.
          </p>
          <p className="mt-2 text-finora-text-secondary drop-shadow-sm">
            Like the great scholars of the Renaissance, understanding the world around you is the first step to mastering it.
          </p>
        </div>
      </div>

      {/* Right side — Auth form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <Card className="w-full max-w-md border-none bg-transparent shadow-none">
          <CardHeader className="text-center lg:text-left">
            <div className="mb-4 inline-flex rounded-md bg-accent p-3 lg:mx-0">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-display text-3xl">
              {isSignUp ? "Begin your journey" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-base">
              {isSignUp
                ? "Create your account and start understanding your economy in 60 seconds"
                : "Sign in to your Finora dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-md border-border bg-card text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12 rounded-md border-border bg-card text-base"
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full bg-primary text-base hover:bg-finora-green-hover"
                disabled={loading}
              >
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

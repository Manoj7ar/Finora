import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
        <BarChart3 className="h-8 w-8 text-primary" />
      </div>
      <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        This page doesn't exist — but your financial insights do.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}

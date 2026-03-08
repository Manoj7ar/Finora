import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent shadow-card">
        <img src={logoImg} alt="Finora" className="h-10 w-10" />
      </div>
      <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        This page doesn't exist — but your financial insights do.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="outline" size="lg" className="gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>
    </motion.div>
  );
}

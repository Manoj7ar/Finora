import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const INCOME_RANGES = [
  "Under $25,000",
  "$25,000 – $50,000",
  "$50,000 – $75,000",
  "$75,000 – $100,000",
  "$100,000 – $150,000",
  "$150,000+",
];

const DEBT_TYPES = [
  { key: "credit_card", label: "Credit Card", placeholder: "e.g. $5,000" },
  { key: "student_loan", label: "Student Loans", placeholder: "e.g. $30,000" },
  { key: "mortgage", label: "Mortgage", placeholder: "e.g. $250,000" },
  { key: "auto", label: "Auto Loan", placeholder: "e.g. $15,000" },
];

const SAVINGS_RANGES = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
];

const INVESTMENT_LEVELS = [
  { key: "none", label: "No investments", description: "I don't currently invest" },
  { key: "some", label: "Some stocks/funds", description: "I have a small portfolio" },
  { key: "heavy", label: "Heavy investor", description: "Significant portfolio value" },
];

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [incomeRange, setIncomeRange] = useState("");
  const [debts, setDebts] = useState<Record<string, number>>({});
  const [savingsRange, setSavingsRange] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [investmentLevel, setInvestmentLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const canProceed = () => {
    switch (step) {
      case 1: return !!incomeRange;
      case 2: return true; // debts optional
      case 3: return !!savingsRange;
      case 4: return zipCode.length >= 5;
      case 5: return !!investmentLevel;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        income_range: incomeRange,
        debt_types: debts,
        savings_range: savingsRange,
        zip_code: zipCode,
        investment_level: investmentLevel,
        onboarding_completed: true,
      });
      if (error) throw error;
      toast({ title: "Profile saved!", description: "Welcome to your personalised dashboard." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === TOTAL_STEPS) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center py-12">
      <div className="mb-8 w-full max-w-lg">
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                {step === 1 && "What's your annual income range?"}
                {step === 2 && "Do you have any debts?"}
                {step === 3 && "How much do you have in savings?"}
                {step === 4 && "Where do you live?"}
                {step === 5 && "How do you invest?"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "This helps us calculate how economic changes affect you."}
                {step === 2 && "Enter approximate amounts. Skip any that don't apply."}
                {step === 3 && "Including checking, savings, and emergency funds."}
                {step === 4 && "We'll use this for local housing and cost-of-living data."}
                {step === 5 && "This affects how market changes impact your wealth."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {INCOME_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setIncomeRange(range)}
                      className={`rounded-md border p-3 text-left text-sm transition-all ${
                        incomeRange === range
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {DEBT_TYPES.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                        {label}
                      </Label>
                      <Input
                        type="number"
                        placeholder={placeholder}
                        value={debts[key] || ""}
                        onChange={(e) =>
                          setDebts({ ...debts, [key]: Number(e.target.value) || 0 })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  {SAVINGS_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSavingsRange(range)}
                      className={`rounded-md border p-3 text-left text-sm transition-all ${
                        savingsRange === range
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    ZIP Code
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. 10001"
                    maxLength={10}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-3">
                  {INVESTMENT_LEVELS.map(({ key, label, description }) => (
                    <button
                      key={key}
                      onClick={() => setInvestmentLevel(key)}
                      className={`w-full rounded-md border p-4 text-left transition-all ${
                        investmentLevel === key
                          ? "border-primary bg-accent"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={next}
                  disabled={!canProceed() || loading}
                  className="gap-1 bg-primary hover:bg-finora-green-hover"
                >
                  {step === TOTAL_STEPS ? (
                    loading ? "Saving..." : <>Finish <Check className="h-4 w-4" /></>
                  ) : (
                    <>Next <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

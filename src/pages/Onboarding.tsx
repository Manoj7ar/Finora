import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$" },
  { code: "DE", name: "Germany", currency: "EUR", symbol: "€" },
  { code: "FR", name: "France", currency: "EUR", symbol: "€" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$" },
  { code: "MX", name: "Mexico", currency: "MXN", symbol: "MX$" },
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$" },
  { code: "AE", name: "UAE", currency: "AED", symbol: "د.إ" },
  { code: "OTHER", name: "Other", currency: "USD", symbol: "$" },
];

const INCOME_RANGES = [
  "Under $25,000",
  "$25,000 – $50,000",
  "$50,000 – $75,000",
  "$75,000 – $100,000",
  "$100,000 – $150,000",
  "$150,000+",
];

const DEBT_TYPES = [
  { key: "credit_card", label: "Credit Card", placeholder: "e.g. 5000" },
  { key: "student_loan", label: "Student Loans", placeholder: "e.g. 30000" },
  { key: "mortgage", label: "Mortgage", placeholder: "e.g. 250000" },
  { key: "auto", label: "Auto Loan", placeholder: "e.g. 15000" },
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

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
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
      case 1: return !!country;
      case 2: return !!incomeRange;
      case 3: return true;
      case 4: return !!savingsRange;
      case 5: return zipCode.length >= 3;
      case 6: return !!investmentLevel;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        country,
        income_range: incomeRange,
        debt_types: debts,
        savings_range: savingsRange,
        zip_code: zipCode,
        investment_level: investmentLevel,
        onboarding_completed: true,
      } as any);
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

  const locationLabel = country === "US" ? "ZIP Code" : "Postal / Area Code";
  const locationPlaceholder = country === "US" ? "e.g. 10001" : country === "GB" ? "e.g. SW1A 1AA" : "e.g. postal code";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container flex min-h-[80vh] flex-col items-center justify-center px-4 py-8 sm:py-12"
    >
      <div className="mb-6 w-full max-w-lg sm:mb-8">
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
        <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
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
              <CardTitle className="font-display text-xl sm:text-2xl">
                {step === 1 && "Where are you based?"}
                {step === 2 && "What's your annual income range?"}
                {step === 3 && "Do you have any debts?"}
                {step === 4 && "How much do you have in savings?"}
                {step === 5 && `What's your ${locationLabel.toLowerCase()}?`}
                {step === 6 && "How do you invest?"}
              </CardTitle>
              <CardDescription className="text-sm">
                {step === 1 && "This helps us tailor currency and economic data to your region."}
                {step === 2 && "This helps us calculate how economic changes affect you."}
                {step === 3 && "Enter approximate amounts. Skip any that don't apply."}
                {step === 4 && "Including checking, savings, and emergency funds."}
                {step === 5 && "We'll use this for local housing and cost-of-living data."}
                {step === 6 && "This affects how market changes impact your wealth."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {COUNTRIES.slice(0, 8).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCountry(c.code)}
                        className={`flex items-center gap-2 rounded-md border p-2.5 text-left text-xs transition-all sm:p-3 sm:text-sm ${
                          country === c.code
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                  <Select value={COUNTRIES.slice(8).some(c => c.code === country) ? country : ""} onValueChange={setCountry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="More countries..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.slice(8).map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {INCOME_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setIncomeRange(range)}
                      className={`rounded-md border p-2.5 text-left text-xs transition-all sm:p-3 sm:text-sm ${
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

              {step === 3 && (
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

              {step === 4 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {SAVINGS_RANGES.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSavingsRange(range)}
                      className={`rounded-md border p-2.5 text-left text-xs transition-all sm:p-3 sm:text-sm ${
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

              {step === 5 && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {locationLabel}
                  </Label>
                  <Input
                    type="text"
                    placeholder={locationPlaceholder}
                    maxLength={10}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              )}

              {step === 6 && (
                <div className="space-y-3">
                  {INVESTMENT_LEVELS.map(({ key, label, description }) => (
                    <button
                      key={key}
                      onClick={() => setInvestmentLevel(key)}
                      className={`w-full rounded-md border p-3 text-left transition-all sm:p-4 ${
                        investmentLevel === key
                          ? "border-primary bg-accent"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground sm:text-base">{label}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
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
    </motion.div>
  );
}

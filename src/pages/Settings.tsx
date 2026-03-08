import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Globe } from "lucide-react";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "NG", name: "Nigeria" },
  { code: "ZA", name: "South Africa" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "UAE" },
  { code: "OTHER", name: "Other" },
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

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [country, setCountry] = useState("US");
  const [incomeRange, setIncomeRange] = useState("");
  const [debts, setDebts] = useState<Record<string, number>>({});
  const [savingsRange, setSavingsRange] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [investmentLevel, setInvestmentLevel] = useState("");

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();

    if (error || !data) {
      navigate("/onboarding");
      return;
    }
    setCountry((data as any).country || "US");
    setIncomeRange(data.income_range || "");
    setDebts((data.debt_types as Record<string, number>) || {});
    setSavingsRange(data.savings_range || "");
    setZipCode(data.zip_code || "");
    setInvestmentLevel(data.investment_level || "");
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        income_range: incomeRange,
        debt_types: debts,
        savings_range: savingsRange,
        zip_code: zipCode,
        investment_level: investmentLevel,
      }).eq("id", user.id);

      if (error) throw error;
      toast({ title: "Profile updated", description: "Your financial info has been saved." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const OptionGrid = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-md border p-2.5 text-left text-xs transition-all sm:p-3 sm:text-sm ${
            value === opt
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-background hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-2xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-center gap-4 sm:mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      <h1 className="mb-1 font-display text-2xl font-bold text-foreground sm:text-3xl">Profile Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground sm:mb-8">
        Update your financial information to keep insights accurate.
      </p>

      <div className="space-y-6 sm:space-y-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Annual Income</CardTitle>
            <CardDescription>Select your current income range</CardDescription>
          </CardHeader>
          <CardContent>
            <OptionGrid options={INCOME_RANGES} value={incomeRange} onChange={setIncomeRange} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Debts</CardTitle>
            <CardDescription>Approximate amounts — leave blank if none</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Savings</CardTitle>
            <CardDescription>Including checking, savings, and emergency funds</CardDescription>
          </CardHeader>
          <CardContent>
            <OptionGrid options={SAVINGS_RANGES} value={savingsRange} onChange={setSavingsRange} />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Location</CardTitle>
            <CardDescription>Used for local housing and cost-of-living data</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="e.g. 10001"
              maxLength={10}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Investments</CardTitle>
            <CardDescription>Your current investment activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {INVESTMENT_LEVELS.map(({ key, label, description }) => (
              <button
                key={key}
                type="button"
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
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-primary px-8 hover:bg-finora-green-hover"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

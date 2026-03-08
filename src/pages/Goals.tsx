import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Target, Plus, Sparkles, Trash2, Pencil, Loader2, TrendingUp, Calendar, DollarSign,
  Shield, Wallet, Palmtree, CreditCard, BarChart3, Home, GraduationCap, CircleDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  category: string;
  ai_nudge: string | null;
  nudge_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "emergency", label: "Emergency Fund" },
  { value: "savings", label: "General Savings" },
  { value: "retirement", label: "Retirement" },
  { value: "debt", label: "Debt Payoff" },
  { value: "investment", label: "Investment" },
  { value: "purchase", label: "Big Purchase" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const categoryIcon: Record<string, string> = {
  emergency: "🛡️",
  savings: "💰",
  retirement: "🏖️",
  debt: "💳",
  investment: "📈",
  purchase: "🏠",
  education: "🎓",
  other: "🎯",
};

export default function Goals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [nudgingId, setNudgingId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formCurrent, setFormCurrent] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [formCategory, setFormCategory] = useState("savings");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchGoals();
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();
    setProfile(data);
  };

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading goals", description: error.message, variant: "destructive" });
    } else {
      setGoals((data as unknown as Goal[]) || []);
    }
    setLoading(false);
  };

  const openNew = () => {
    setEditingGoal(null);
    setFormName("");
    setFormTarget("");
    setFormCurrent("");
    setFormDeadline("");
    setFormCategory("savings");
    setDialogOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormTarget(String(goal.target_amount));
    setFormCurrent(String(goal.current_amount));
    setFormDeadline(goal.deadline || "");
    setFormCategory(goal.category);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formTarget) return;
    setSaving(true);

    const payload = {
      user_id: user!.id,
      name: formName.trim(),
      target_amount: parseFloat(formTarget),
      current_amount: parseFloat(formCurrent) || 0,
      deadline: formDeadline || null,
      category: formCategory,
    };

    if (editingGoal) {
      const { error } = await supabase
        .from("financial_goals")
        .update(payload)
        .eq("id", editingGoal.id);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Goal updated!" });
      }
    } else {
      const { error } = await supabase
        .from("financial_goals")
        .insert(payload);
      if (error) {
        toast({ title: "Create failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Goal created! 🎯" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchGoals();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("financial_goals").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      toast({ title: "Goal removed" });
    }
  };

  const fetchNudge = async (goal: Goal) => {
    setNudgingId(goal.id);
    try {
      const { data, error } = await supabase.functions.invoke("ai-goal-nudge", {
        body: { goal, profile },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      // Save nudge to DB
      await supabase
        .from("financial_goals")
        .update({ ai_nudge: data.nudge, nudge_updated_at: new Date().toISOString() })
        .eq("id", goal.id);

      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id
            ? { ...g, ai_nudge: data.nudge, nudge_updated_at: new Date().toISOString() }
            : g
        )
      );
    } catch (err: any) {
      toast({ title: "Nudge failed", description: err.message, variant: "destructive" });
    } finally {
      setNudgingId(null);
    }
  };

  const getProgress = (goal: Goal) =>
    goal.target_amount > 0
      ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
      : 0;

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current_amount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <PageTransition>
      <div className="container py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Financial Goals
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Set targets, track progress, and get AI-powered nudges
            </p>
          </div>
          <Button onClick={openNew} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        </div>

        {/* Summary stats */}
        {goals.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Goals</p>
                  <p className="font-mono text-xl font-bold text-foreground">{goals.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Saved</p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    ${totalCurrent.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Overall Progress</p>
                  <p className="font-mono text-xl font-bold text-foreground">{overallProgress}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goal cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : goals.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">No goals yet</h3>
              <p className="max-w-sm text-center text-sm text-muted-foreground">
                Set your first financial goal to start tracking progress and receive personalized AI nudges.
              </p>
              <Button onClick={openNew} className="gap-2">
                <Plus className="h-4 w-4" /> Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {goals.map((goal, i) => {
                const progress = getProgress(goal);
                const daysLeft = getDaysLeft(goal.deadline);
                const isPastDue = daysLeft !== null && daysLeft < 0;
                const isClose = daysLeft !== null && daysLeft <= 30 && daysLeft >= 0;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="shadow-card transition-shadow hover:shadow-card-hover">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{categoryIcon[goal.category] || "🎯"}</span>
                            <div>
                              <CardTitle className="text-base font-bold text-foreground">
                                {goal.name}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground capitalize">
                                {CATEGORIES.find((c) => c.value === goal.category)?.label || goal.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(goal)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(goal.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="mb-2 flex items-end justify-between">
                            <span className="font-mono text-2xl font-bold text-foreground">
                              ${goal.current_amount.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              of ${goal.target_amount.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <p className="mt-1 text-right text-xs font-medium text-primary">
                            {progress}% complete
                          </p>
                        </div>

                        {/* Deadline */}
                        {goal.deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span
                              className={
                                isPastDue
                                  ? "font-medium text-destructive"
                                  : isClose
                                  ? "font-medium text-yellow-600 dark:text-yellow-400"
                                  : "text-muted-foreground"
                              }
                            >
                              {isPastDue
                                ? `${Math.abs(daysLeft!)} days overdue`
                                : `${daysLeft} days left`}
                            </span>
                          </div>
                        )}

                        {/* AI Nudge */}
                        {goal.ai_nudge && (
                          <div className="rounded-xl bg-accent/50 p-3">
                            <div className="mb-1 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs font-semibold text-primary">AI Nudge</span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground">
                              {goal.ai_nudge}
                            </p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5"
                          onClick={() => fetchNudge(goal)}
                          disabled={nudgingId === goal.id}
                        >
                          {nudgingId === goal.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          {nudgingId === goal.id ? "Generating..." : "Get AI Nudge"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingGoal ? "Edit Goal" : "New Financial Goal"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g. Emergency Fund"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {categoryIcon[c.value]} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target ($)</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min="0"
                    placeholder="10000"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-current">Current ($)</Label>
                  <Input
                    id="goal-current"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Deadline (optional)</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={saving || !formName.trim() || !formTarget}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingGoal ? "Save Changes" : "Create Goal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

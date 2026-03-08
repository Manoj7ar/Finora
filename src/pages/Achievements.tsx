import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trophy, Target, BookOpen, Sparkles, Zap, MessageSquare,
  TrendingUp, Shield, Star, Award, Flame
} from "lucide-react";

interface Badge {
  id: string;
  icon: React.ElementType;
  name: string;
  description: string;
  unlocked: boolean;
  tier: "bronze" | "silver" | "gold";
}

export default function Achievements() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    const [
      { count: lessonsCount },
      { count: goalsCount },
      { count: chatCount },
      { data: profileData },
    ] = await Promise.all([
      supabase.from("lesson_progress").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("financial_goals").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
      supabase.from("chat_messages").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("role", "user"),
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
    ]);

    const lessons = lessonsCount || 0;
    const goals = goalsCount || 0;
    const chats = chatCount || 0;
    const profile = profileData;
    const hasProfile = !!profile?.onboarding_completed;

    setBadges([
      { id: "onboarded", icon: Shield, name: "First Steps", description: "Complete your financial profile", unlocked: hasProfile, tier: "bronze" },
      { id: "lesson1", icon: BookOpen, name: "Eager Learner", description: "Complete your first lesson", unlocked: lessons >= 1, tier: "bronze" },
      { id: "lesson4", icon: Star, name: "Honor Student", description: "Complete all 4 lessons", unlocked: lessons >= 4, tier: "gold" },
      { id: "goal1", icon: Target, name: "Goal Setter", description: "Create your first financial goal", unlocked: goals >= 1, tier: "bronze" },
      { id: "goal3", icon: Flame, name: "Ambitious", description: "Set 3 or more financial goals", unlocked: goals >= 3, tier: "silver" },
      { id: "chat1", icon: MessageSquare, name: "Curious Mind", description: "Ask the AI advisor a question", unlocked: chats >= 1, tier: "bronze" },
      { id: "chat10", icon: Sparkles, name: "Power User", description: "Have 10+ advisor conversations", unlocked: chats >= 10, tier: "silver" },
      { id: "investor", icon: TrendingUp, name: "Investor", description: "Set investment level to 'heavy'", unlocked: profile?.investment_level === "heavy", tier: "silver" },
      { id: "crisis", icon: Zap, name: "Crisis Ready", description: "Run a crisis simulation", unlocked: false, tier: "silver" }, // would need tracking
      { id: "allbadges", icon: Trophy, name: "Finora Master", description: "Unlock all other badges", unlocked: false, tier: "gold" },
    ]);

    // Check if all except last are unlocked
    setBadges(prev => {
      const allOthers = prev.slice(0, -1).every(b => b.unlocked);
      return prev.map(b => b.id === "allbadges" ? { ...b, unlocked: allOthers } : b);
    });

    setLoading(false);
  };

  const tierStyles = {
    bronze: { bg: "bg-[hsl(30,50%,55%)]/15", border: "border-[hsl(30,50%,55%)]/30", text: "text-[hsl(30,50%,45%)]" },
    silver: { bg: "bg-muted/50", border: "border-muted-foreground/20", text: "text-muted-foreground" },
    gold: { bg: "bg-[hsl(45,80%,50%)]/15", border: "border-[hsl(45,80%,50%)]/30", text: "text-[hsl(45,80%,40%)]" },
  };

  const unlocked = badges.filter(b => b.unlocked).length;
  const total = badges.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-3xl px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Button>
      </div>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {unlocked}/{total} badges unlocked
        </p>
        <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-muted/50">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="shadow-card animate-pulse">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-xl bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-36 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {badges.map((badge, i) => {
            const style = tierStyles[badge.tier];
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`shadow-card transition-all ${
                  badge.unlocked
                    ? "border-primary/20 hover:shadow-hover"
                    : "opacity-50 grayscale"
                }`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                      badge.unlocked ? `${style.bg} ${style.border}` : "bg-muted/30 border-muted"
                    }`}>
                      <Icon className={`h-5 w-5 ${badge.unlocked ? style.text : "text-muted-foreground/50"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{badge.name}</p>
                        {badge.unlocked && (
                          <Award className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{badge.description}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        badge.unlocked ? `${style.bg} ${style.text}` : "bg-muted/30 text-muted-foreground/50"
                      }`}>
                        {badge.tier}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

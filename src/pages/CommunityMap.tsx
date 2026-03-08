import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Shield, Loader2, Lock, TrendingUp, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function CommunityMap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [communityStats, setCommunityStats] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    setProfile(p);
  };

  const refreshScore = async () => {
    if (!profile?.age_group || !profile?.city) {
      toast({ title: "Profile incomplete", description: "Set your age group and city in Settings to join the community map.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("community-resilience", {
        body: { userId: user!.id, profile, healthScore: 65 },
      });
      if (error) throw error;
      setUserScore(data.user_score);
      setPercentile(data.percentile);
      setCommunityStats(data.community_stats || []);
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Community Resilience</h1>
          </div>
          <p className="text-muted-foreground">Anonymous benchmarks — see how your financial resilience compares</p>
        </div>
        <Button onClick={refreshScore} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Loading...</> : "Refresh Score"}
        </Button>
      </div>

      {userScore != null && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{userScore}</p>
                <p className="text-sm text-muted-foreground mt-1">Your Score</p>
              </div>
              <div className="flex-1">
                <Progress value={userScore} className="h-3 mb-2" />
                {percentile != null && (
                  <p className="text-sm font-medium">
                    <TrendingUp className="h-4 w-4 inline mr-1 text-primary" />
                    You're in the <strong>top {100 - percentile}%</strong> of all users
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {communityStats.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Community Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Age Group</th>
                    <th className="text-left py-2 px-3 font-medium">City</th>
                    <th className="text-center py-2 px-3 font-medium">Avg Score</th>
                    <th className="text-center py-2 px-3 font-medium">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {communityStats.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 px-3">{row.age_group}</td>
                      <td className="py-2 px-3">{row.city}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={Number(row.avg_score) >= 60 ? "default" : "secondary"}>
                          {row.avg_score}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-center text-muted-foreground">{row.user_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {(!profile?.age_group || !profile?.city) && (
        <Card className="mb-6 border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-6 flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-muted-foreground">Set your age group and city in Settings to participate in the community resilience map.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <strong>Privacy-preserving aggregation:</strong> Only grouped averages with 5+ users are shown. Individual scores are never exposed. Your data is anonymized using differential privacy principles.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

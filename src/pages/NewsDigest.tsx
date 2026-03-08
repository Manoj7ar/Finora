import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Newspaper, Loader2, RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NewsStory {
  title: string;
  source: string;
  impact: "positive" | "negative" | "neutral";
  summary: string;
  personalImpact: string;
  category: string;
}

interface Digest {
  date: string;
  headline: string;
  stories: NewsStory[];
}

export default function NewsDigest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const loadDigest = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-news-digest", {
        body: { profile },
      });
      if (error) throw error;
      setDigest(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const impactIcon = (impact: string) => {
    switch (impact) {
      case "positive": return <TrendingUp className="h-4 w-4 text-primary" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const impactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "bg-accent text-accent-foreground";
      case "negative": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          AI News Digest
        </h1>
        <p className="mt-1 text-muted-foreground">
          Today's economic news, explained through your wallet
        </p>
      </div>

      {!digest ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
                Your Daily Economic Briefing
              </h2>
              <p className="mb-6 text-muted-foreground">
                Get the top 5 economic stories and how each one personally affects your finances.
              </p>
              <Button
                onClick={loadDigest}
                disabled={loading || !profile}
                className="gap-2 bg-primary px-8 hover:bg-finora-green-hover"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Get Today's Digest"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{digest.date}</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">
                    {digest.headline}
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={loadDigest} disabled={loading} className="gap-1">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {digest.stories?.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="shadow-card transition-shadow hover:shadow-card-hover">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    {impactIcon(story.impact)}
                    <Badge variant="outline" className="text-xs">{story.category}</Badge>
                    <span className="text-xs text-muted-foreground">{story.source}</span>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    {story.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                    {story.summary}
                  </p>
                  <div className={`rounded-lg p-3 ${impactColor(story.impact)}`}>
                    <p className="text-xs font-medium uppercase tracking-wider opacity-70">Your Impact</p>
                    <p className="mt-1 text-sm font-medium">{story.personalImpact}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

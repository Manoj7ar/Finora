import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, VolumeX, Loader2, Clock, Sunrise, Eye, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchFredData } from "@/lib/fred";

export default function MorningBriefing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<any>(null);
  const [speaking, setSpeaking] = useState(false);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const metrics = await fetchFredData();
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      const { data, error } = await supabase.functions.invoke("morning-briefing", {
        body: { metrics, profile },
      });
      if (error) throw error;
      setBriefing(data);
    } catch (e: any) {
      toast({ title: "Briefing failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!briefing?.full_script) return;
    const utterance = new SpeechSynthesisUtterance(briefing.full_script);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-3xl py-6 sm:py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Radio className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">Morning Briefing</h1>
        </div>
        <p className="text-muted-foreground">Your 60-second personalized macro briefing</p>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        <Button onClick={generateBriefing} disabled={loading} size="lg">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating...</> : <><Sunrise className="h-4 w-4 mr-2" />Generate Today's Briefing</>}
        </Button>
        {briefing && (
          <Button onClick={toggleSpeech} variant="outline" size="lg">
            {speaking ? <><VolumeX className="h-4 w-4 mr-2" />Stop</> : <><Volume2 className="h-4 w-4 mr-2" />Listen</>}
          </Button>
        )}
      </div>

      {briefing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{briefing.estimated_read_seconds || 60}s read
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <p className="text-lg font-medium">{briefing.greeting}</p>
                <div className="rounded-lg bg-background p-4">
                  <p className="font-medium text-primary mb-1">📰 Headline</p>
                  <p>{briefing.headline}</p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="font-medium text-primary mb-1">👤 What This Means For You</p>
                  <p>{briefing.personal_impact}</p>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="font-medium text-primary mb-1">👁️ Watch Today</p>
                  <p>{briefing.watch_today}</p>
                </div>
                <p className="text-muted-foreground italic">{briefing.closing}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!briefing && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mic className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-medium mb-1">No briefing yet</p>
            <p className="text-sm text-muted-foreground">Tap "Generate Today's Briefing" for your personalized morning update with optional audio playback.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

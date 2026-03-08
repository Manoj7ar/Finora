import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trophy, Loader2, CheckCircle, Clock, Brain, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchFredData } from "@/lib/fred";

const EVENT_TYPES = [
  { value: "fed_rate_decision", label: "Fed Rate Decision" },
  { value: "cpi_release", label: "CPI Release" },
  { value: "unemployment_report", label: "Unemployment Report" },
  { value: "gdp_report", label: "GDP Report" },
  { value: "housing_data", label: "Housing Data Release" },
];

export default function PredictFed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [prediction, setPrediction] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);

  useEffect(() => {
    if (user) loadPredictions();
  }, [user]);

  const loadPredictions = async () => {
    const { data } = await supabase
      .from("fed_predictions")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setPredictions(data || []);
  };

  const avgScore = predictions.filter(p => p.score != null).reduce((sum, p, _, a) => sum + p.score / a.length, 0);

  const submitPrediction = async () => {
    if (!eventType || !eventDate || !prediction.trim()) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const metrics = await fetchFredData();
      const { data: evalData, error } = await supabase.functions.invoke("predict-fed-score", {
        body: { eventType, eventDate, userPrediction: prediction, metrics },
      });
      if (error) throw error;
      setEvaluation(evalData);

      await supabase.from("fed_predictions").insert({
        user_id: user!.id,
        event_type: eventType,
        event_date: eventDate,
        user_prediction: prediction,
        score: evalData?.score || null,
        explanation: evalData?.explanation || null,
      });

      // Log bias event for overconfidence tracking
      await supabase.from("cognitive_bias_events").insert({
        user_id: user!.id,
        bias_type: "prediction_made",
        context: JSON.stringify({ eventType, prediction: prediction.substring(0, 100) }),
        source_page: "predict_fed",
      });

      loadPredictions();
      setPrediction("");
    } catch (e: any) {
      toast({ title: "Evaluation failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-4xl py-6 sm:py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold">Predict the Fed</h1>
        </div>
        <p className="text-muted-foreground">Make predictions about economic events. Build your Economic IQ.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{Math.round(avgScore) || "—"}</p>
            <p className="text-xs text-muted-foreground">Economic IQ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{predictions.length}</p>
            <p className="text-xs text-muted-foreground">Predictions Made</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{predictions.filter(p => p.resolved_at).length}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>New Prediction</CardTitle>
          <CardDescription>What do you think will happen?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger><SelectValue placeholder="Event type" /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
          </div>
          <Input
            placeholder="Your prediction (e.g., 'Fed will hold rates at 5.25-5.50%')"
            value={prediction}
            onChange={e => setPrediction(e.target.value)}
          />
          <Button onClick={submitPrediction} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Evaluating...</> : "Submit Prediction"}
          </Button>
        </CardContent>
      </Card>

      {evaluation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">AI Evaluation</h3>
                <Badge variant="secondary" className="text-lg">{evaluation.score}/100</Badge>
              </div>
              <p className="text-sm"><strong>Reasoning:</strong> {evaluation.reasoning_quality}</p>
              <p className="text-sm"><strong>Explanation:</strong> {evaluation.explanation}</p>
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm font-medium flex items-center gap-2"><Brain className="h-4 w-4 text-primary" />Teaching Moment</p>
                <p className="text-sm text-muted-foreground mt-1">{evaluation.teaching_moment}</p>
              </div>
              <p className="text-sm text-muted-foreground"><strong>Watch:</strong> {evaluation.what_to_watch}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {predictions.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">History</h2>
          <div className="space-y-3">
            {predictions.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-start gap-3">
                    {p.resolved_at ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium">{p.event_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</p>
                      <p className="text-xs text-muted-foreground">{p.user_prediction}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(p.event_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {p.score != null && <Badge>{p.score}/100</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

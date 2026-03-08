
-- 1. cognitive_bias_events
CREATE TABLE public.cognitive_bias_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bias_type TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT '',
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_page TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.cognitive_bias_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own bias events" ON public.cognitive_bias_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own bias events" ON public.cognitive_bias_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bias events" ON public.cognitive_bias_events FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. economic_forecasts
CREATE TABLE public.economic_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  forecast_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL DEFAULT '',
  outlook TEXT NOT NULL DEFAULT 'cloudy',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.economic_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own forecasts" ON public.economic_forecasts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own forecasts" ON public.economic_forecasts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own forecasts" ON public.economic_forecasts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. fed_predictions
CREATE TABLE public.fed_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  user_prediction TEXT NOT NULL,
  actual_outcome TEXT,
  score INTEGER,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE public.fed_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own predictions" ON public.fed_predictions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own predictions" ON public.fed_predictions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON public.fed_predictions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own predictions" ON public.fed_predictions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. financial_twin_snapshots
CREATE TABLE public.financial_twin_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  projections JSONB NOT NULL DEFAULT '{}'::jsonb,
  key_insight TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_twin_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own snapshots" ON public.financial_twin_snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own snapshots" ON public.financial_twin_snapshots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own snapshots" ON public.financial_twin_snapshots FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. legislation_alerts
CREATE TABLE public.legislation_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bill_name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  personal_impact TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);
ALTER TABLE public.legislation_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own alerts" ON public.legislation_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own alerts" ON public.legislation_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.legislation_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.legislation_alerts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. negotiation_opportunities
CREATE TABLE public.negotiation_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opportunity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  script TEXT NOT NULL DEFAULT '',
  macro_context TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dismissed BOOLEAN NOT NULL DEFAULT false
);
ALTER TABLE public.negotiation_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own opportunities" ON public.negotiation_opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own opportunities" ON public.negotiation_opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON public.negotiation_opportunities FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON public.negotiation_opportunities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 7. community_scores
CREATE TABLE public.community_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  age_group TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  resilience_score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.community_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can upsert own score" ON public.community_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own score" ON public.community_scores FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own score" ON public.community_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 8. Add age_group and city to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_group TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;

-- 9. Community aggregation function (privacy-preserving)
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS TABLE(age_group text, city text, avg_score numeric, user_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT age_group, city, ROUND(AVG(resilience_score)::numeric, 1), COUNT(*)
  FROM public.community_scores
  WHERE age_group != '' AND city != ''
  GROUP BY age_group, city
  HAVING COUNT(*) >= 5
$$;

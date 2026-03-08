

# Implementation Plan: 8 Advanced Features for Finora

This is a large-scale implementation covering 8 new features. Each requires database tables, edge functions, new pages, and navigation updates. Here is the full breakdown.

---

## Database Migrations

A single migration will create all new tables:

1. **`cognitive_bias_events`** -- Tracks user interaction patterns (lesson answers, simulation choices, what-if scenarios) with detected bias type, context, and timestamp. Columns: `id`, `user_id`, `bias_type` (text), `context` (text), `detected_at`, `source_page` (text).

2. **`economic_forecasts`** -- Stores daily AI-generated "weather" reports. Columns: `id`, `user_id`, `forecast_date`, `summary` (text), `outlook` (text: sunny/cloudy/stormy), `details` (jsonb), `created_at`.

3. **`fed_predictions`** -- Stores user predictions for economic events. Columns: `id`, `user_id`, `event_type` (text), `event_date` (date), `user_prediction` (text), `actual_outcome` (text, nullable), `score` (integer, nullable), `explanation` (text, nullable), `created_at`, `resolved_at` (nullable).

4. **`financial_twin_snapshots`** -- Stores the latest "digital twin" projection. Columns: `id`, `user_id`, `snapshot_date`, `projections` (jsonb -- contains current_path, best_case, worst_case scenarios), `key_insight` (text), `created_at`.

5. **`legislation_alerts`** -- Stores parsed legislation impact alerts. Columns: `id`, `user_id`, `bill_name` (text), `summary` (text), `personal_impact` (text), `severity` (text), `created_at`, `read` (boolean default false).

6. **`negotiation_opportunities`** -- Stores AI-detected negotiation windows. Columns: `id`, `user_id`, `opportunity_type` (text), `title` (text), `script` (text), `macro_context` (text), `created_at`, `dismissed` (boolean default false).

7. **`community_scores`** -- Stores anonymized aggregate resilience data. Columns: `id`, `user_id`, `age_group` (text), `city` (text), `resilience_score` (integer), `updated_at`. This uses privacy-preserving aggregation (only expose grouped averages, never individual data).

All tables get standard RLS: users can only CRUD their own rows. `community_scores` gets a special SELECT policy allowing reading aggregated data via a database function.

**Database function for community aggregation:**
```sql
CREATE FUNCTION public.get_community_stats()
RETURNS TABLE(age_group text, city text, avg_score numeric, user_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT age_group, city, ROUND(AVG(resilience_score), 1), COUNT(*)
  FROM public.community_scores
  GROUP BY age_group, city
  HAVING COUNT(*) >= 5
$$;
```

We also need to add `age_group` and `city` columns to the `profiles` table (collected during onboarding or settings).

---

## Edge Functions (8 new)

All follow existing patterns: CORS headers, Lovable AI Gateway with `google/gemini-3-flash-preview`, error handling for 429/402.

1. **`cognitive-bias-analysis`** -- Receives user interaction history, uses AI to identify cognitive biases. Returns bias type, frequency count, financial cost estimate, and teaching explanation.

2. **`economic-weather`** -- Fetches latest FRED data + uses AI to generate a 30-day personalized "weather forecast." Returns outlook (sunny/cloudy/stormy), summary, and action items. Also creates a notification.

3. **`predict-fed-score`** -- Takes a prediction + event info, calls AI to evaluate the prediction after the event resolves. Returns score (0-100), explanation, and teaching content.

4. **`financial-twin`** -- Takes user profile + current FRED metrics, uses AI to project net worth, debt cost, and savings purchasing power across 3 scenarios (current, best-case, worst-case) over 1, 3, and 5 years.

5. **`morning-briefing`** -- Fetches FRED snapshot + uses AI to generate a 60-second text briefing personalized to the user's profile. Returns structured text suitable for TTS or reading.

6. **`legislation-radar`** -- Uses AI to analyze recent/proposed economic legislation and map impacts to the user's profile. Returns bill name, summary, personal impact, and severity.

7. **`negotiation-coach`** -- Takes user profile + current FRED metrics, identifies negotiation opportunities (mortgage refinance, credit card APR, salary timing) and generates word-for-word scripts.

8. **`community-resilience`** -- Computes the user's resilience score and upserts it into `community_scores`. Fetches aggregated stats via the database function. Returns user's score, percentile, and heatmap data.

---

## New Pages (8)

Each page follows the existing design language: `motion.div` wrapper, `container py-6 sm:py-8`, `font-display` headings, Card-based layouts.

1. **`/bias-mirror`** -- `src/pages/BiasMirror.tsx`
   - Shows detected biases as cards with frequency, cost estimate, and teaching content
   - Timeline view of recent bias detections
   - "Scan my patterns" button triggers analysis

2. **`/weather`** -- `src/pages/EconomicWeather.tsx`
   - Weather metaphor UI: sun/cloud/storm icons based on outlook
   - 30-day forecast timeline
   - Personalized action items
   - "Generate forecast" button

3. **`/predict`** -- `src/pages/PredictFed.tsx`
   - Active prediction cards for upcoming events (Fed meetings, CPI releases)
   - Prediction form with options
   - Historical score tracker ("Economic IQ" score)
   - Resolved predictions with explanations

4. **`/twin`** -- `src/pages/FinancialTwin.tsx`
   - 3-scenario projection cards (current, best, worst)
   - Net worth, debt cost, savings purchasing power for each
   - Key insight highlighted
   - "Update projection" button

5. **`/briefing`** -- `src/pages/MorningBriefing.tsx`
   - Clean reading view of the daily briefing
   - "Generate briefing" button
   - Optional: audio playback using browser SpeechSynthesis API (free, no ElevenLabs needed)

6. **`/legislation`** -- `src/pages/LegislationRadar.tsx`
   - List of legislation alerts as cards with severity badges
   - Personal impact explanation per bill
   - "Scan for legislation" button
   - Mark as read functionality

7. **`/negotiate`** -- `src/pages/NegotiationCoach.tsx`
   - Opportunity cards showing current macro conditions in user's favor
   - Expandable scripts with copy-to-clipboard
   - "Find opportunities" button

8. **`/community`** -- `src/pages/CommunityMap.tsx`
   - User's resilience score prominently displayed
   - Grid/table showing age group x city averages
   - Percentile ranking ("You're in the top 30%")
   - Privacy notice explaining aggregation

---

## Navigation Updates

**`src/components/Layout.tsx`** -- Add new items. Since there are now many pages, organize into groups:

- **Main nav**: Dashboard, Goals, Crisis Sim, Learn
- **AI dropdown**: Expand to include all AI features. Group them:
  - Existing: AI Advisor, Action Plan, News Digest, What If
  - New: Bias Mirror, Weather, Predict Fed, Financial Twin, Briefing, Legislation, Negotiate, Community

The AI dropdown will be reorganized into a larger flyout/grid menu to accommodate 12 items cleanly.

**`src/App.tsx`** -- Add 8 new protected routes.

---

## Config Updates

**`supabase/config.toml`** -- Add 8 new function entries with `verify_jwt = false`.

---

## Bias Detection Integration

The Cognitive Bias Mirror needs to silently log interaction patterns. We'll add lightweight tracking calls in:
- **Education.tsx** -- After quiz submission, log answer patterns (e.g., always picking safe answers = loss aversion)
- **Simulation.tsx** -- Log which crises users pick and how they react
- **WhatIf.tsx** -- Log scenario choices (always worst-case = negativity bias)
- **PredictFed.tsx** -- Log prediction patterns (overconfidence detection)

These are simple `supabase.from("cognitive_bias_events").insert(...)` calls added to existing handlers.

---

## Community Score Collection

On each dashboard load, after metrics are fetched, silently compute and upsert the user's resilience score into `community_scores` (using the existing HealthScore calculation). This requires the user to have `age_group` and `city` set in their profile.

**Settings.tsx and Onboarding.tsx** will get new optional fields for age group and city.

---

## Summary of Changes

| Area | Count |
|------|-------|
| New database tables | 7 |
| New profile columns | 2 (age_group, city) |
| New database functions | 1 (get_community_stats) |
| New edge functions | 8 |
| New pages | 8 |
| Modified pages | 4 (Education, Simulation, WhatIf, Settings) |
| Modified components | 2 (Layout, App) |
| Config updates | 1 (config.toml) |


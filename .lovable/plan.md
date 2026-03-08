

# Finora — Implementation Plan

## 1. Design System & Layout Foundation
- Set up the color palette (#FAF7F2 background, #2D6A4F green accents, cream cards) in Tailwind config and CSS variables
- Add Google Fonts: Playfair Display, Inter, JetBrains Mono
- Define typography scale, spacing, shadows, and component styles (cards, buttons, badges, pill indicators, pulsing live dot animation)
- Create reusable layout shell with max-width 1200px, navbar with Finora branding

## 2. Supabase Backend Setup
- Enable Lovable Cloud with auth (email/password signup)
- Create tables: `profiles` (income_range, debt_types, savings_range, zip_code, investment_level), `lesson_progress`
- Set up RLS policies so users can only access their own data
- Auto-create profile on signup via database trigger

## 3. Onboarding Flow (60-Second Quiz)
- Multi-step card wizard with progress bar in forest green
- Steps: Income range → Debt types & amounts → Savings range → City/ZIP → Investment allocation
- Each step is one question, premium quiz feel with smooth transitions
- Saves profile to Supabase on completion, redirects to dashboard

## 4. Living Dashboard (Hero Feature)
- Create edge function to fetch 6 FRED API indicators (FEDFUNDS, CPIAUCSL, UNRATE, DGS10, DRCCLACBS, CSUSHPINSA) with caching
- Dashboard displays 6 metric cards, each showing: current value (JetBrains Mono), 30-day trend arrow, pulsing green live dot, personal dollar impact calculated from user's profile, one-line plain-English explanation
- Impact calculator: e.g., Fed rate × user's variable debt = extra annual cost; CPI × savings = purchasing power loss
- Auto-refresh data periodically

## 5. AI Insight Engine
- Edge function using Lovable AI (Gemini) with user's financial profile injected into system prompt
- Triggers when macro data crosses thresholds (rate changes, CPI spikes, unemployment jumps)
- Generates personalized insight cards: severity badge (green/amber/red pill), headline, personal dollar figure, 3-paragraph lesson, expandable "Learn more" section
- Cards appear on dashboard with timestamp and "Live data" label

## 6. Crisis Simulation (WOW Feature)
- Edge function that fetches historical FRED data for 4 crises (2008, 2020 COVID, 2022 Inflation, 1970s Stagflation)
- Runs user's profile through month-by-month simulation: calculates debt cost changes, savings impact, net worth trajectory
- Cinematic step-through UI: animated month cards with fade transitions
- Financial Resilience Score (0–100) displayed as circular gauge in forest green
- AI-generated 5-item personalized action plan

## 7. Education Hub
- Lesson pages for key macro concepts (Fed rate, inflation, yield curve, recessions)
- AI-generated lessons personalized to user's profile via Lovable AI edge function
- 3-question comprehension check at end of each lesson
- Progress tracking saved to Supabase, shown on dashboard

## 8. Navigation & Polish
- Routes: `/` (landing), `/onboarding`, `/dashboard`, `/simulation`, `/education`, `/education/:topic`
- Protected routes requiring auth
- Landing page with hero section showcasing Finora's value proposition
- Responsive design, smooth page transitions, loading states


# Finora AI — The Economy, Personalised

> **"The economy is moving. See exactly what it means for you."**

Finora is a macro-financial intelligence platform that democratizes hedge-fund-level economic insights for everyday people. It pulls real-time data from the Federal Reserve (FRED API), runs it through AI-powered analysis, and delivers plain-English explanations tailored to each user's income, savings, debt, and goals.

No jargon. No noise. Just clarity on how inflation, interest rates, employment shifts, and policy changes affect *your* wallet.

---

## 🧠 Why Finora Exists

Most people hear about GDP, CPI, or the Fed Funds Rate on the news — but have no idea what it means for their rent, their savings account, or their next career move. Finora bridges that gap by:

1. **Ingesting live macroeconomic data** from the Federal Reserve Economic Data (FRED) API
2. **Contextualizing it** against your personal financial profile (income range, savings, debt types, location, age group)
3. **Translating it** into actionable insights using AI — not generic advice, but recommendations shaped by real economic conditions

---

## ✨ Core Features

### 📊 Smart Dashboard
The central hub of Finora. At a glance you see:
- **Financial Health Score** — A composite 0–100 score reflecting your financial position relative to current economic conditions
- **Peer Benchmarks** — How you compare to others in your age group and city
- **Live Metric Cards** — Key economic indicators (inflation, unemployment, GDP growth, interest rates) with trend arrows and plain-language explanations of what each means for you
- **Quick Stats** — Savings health, debt exposure, and investment positioning at a glance

### 🤖 AI Financial Advisor
A conversational AI assistant that understands both your financial profile and the current macro environment. Ask it anything:
- *"Should I lock in a fixed-rate mortgage right now?"*
- *"How does the latest jobs report affect my industry?"*
- *"What should I prioritize — paying off debt or investing?"*

Every response is grounded in real FRED data and your onboarding profile. Chat history is persisted so the advisor remembers context across sessions.

### 📋 AI Action Plan
An AI-generated, prioritized list of financial actions based on:
- Your current goals and progress
- The latest economic indicators
- Your debt types, income range, and savings level

Each action item includes a clear explanation of *why* it matters right now and *what* economic signal triggered it. The plan regenerates as conditions change.

### 🌦️ Economic Weather
A 30-day macro outlook presented as an intuitive weather metaphor:
- ☀️ **Sunny** — Favorable conditions (low inflation, strong employment, stable rates)
- ⛅ **Cloudy** — Mixed signals worth monitoring
- 🌧️ **Stormy** — Headwinds that may impact your finances

Powered by real FRED data analysis, not speculation. Includes detailed breakdowns of which indicators are driving the forecast.

### 🎯 Goal Tracker
Set financial goals (emergency fund, debt payoff, home down payment, retirement, etc.) with:
- **Target and current amounts** with visual progress tracking
- **Deadlines** with time-remaining calculations
- **AI Nudges** — Smart suggestions that adapt to economic conditions. For example, if interest rates drop, Finora might nudge you to refinance debt rather than aggressively save.

### 🧪 Crisis Simulation
Test your financial resilience against real historical economic crises:
- **2008 Financial Crisis** — What would happen to your portfolio and job security?
- **COVID-19 Recession** — How would a sudden economic shutdown affect you?
- **1970s Stagflation** — Could your finances survive persistent inflation with stagnant growth?

The simulator uses your actual financial profile to model personalized impact scenarios with AI-generated survival strategies.

### 🪞 Bias Mirror
A cognitive bias detection system that monitors your financial decisions and flags common psychological traps:
- **Anchoring bias** — Fixating on a single number when making decisions
- **Recency bias** — Overweighting recent events
- **Loss aversion** — Fear of losses outweighing equivalent gains
- **Confirmation bias** — Seeking information that confirms existing beliefs

Events are logged and surfaced with explanations to help you make more rational financial choices.

### 🗺️ Community Map
See aggregated (anonymous) financial resilience data across demographics:
- Compare resilience scores by **city** and **age group**
- Understand how your community is positioned relative to national averages
- Identify regional economic strengths and vulnerabilities

### 📰 News Digest
AI-curated macroeconomic news with a personal twist:
- Each story includes a **personal impact analysis** explaining what it means for your specific situation
- Severity ratings help you prioritize what to pay attention to
- Filters out noise — only surfaces news that materially affects your financial position

### 📚 Financial Education
Interactive lessons covering:
- Macroeconomics fundamentals (inflation, monetary policy, fiscal policy)
- Personal finance strategies (budgeting, investing, debt management)
- Behavioral economics (understanding your own biases)

Each lesson includes AI-generated quiz questions with scoring and progress tracking.

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite | Fast SPA with type safety |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first design system with accessible components |
| **Animations** | Framer Motion | Smooth page transitions and micro-interactions |
| **Backend** | Lovable Cloud (Supabase) | Auth, database, edge functions, file storage |
| **AI** | Lovable AI Gateway | Multi-model AI (Gemini, GPT) for all intelligent features |
| **Economic Data** | FRED API | Real-time Federal Reserve data (GDP, CPI, unemployment, Fed Funds Rate) |
| **Auth** | Email/password | With email verification and password reset flow |
| **PWA** | vite-plugin-pwa | Installable on mobile with offline caching |
| **Charts** | Recharts | Data visualization for economic trends |
| **PDF Export** | jsPDF | Downloadable reports |

### Data Flow

```
FRED API (Federal Reserve)
    ↓
Edge Functions (data processing + AI enrichment)
    ↓
Supabase Database (user profiles, goals, chat history, scores)
    ↓
React Frontend (personalized dashboard, insights, recommendations)
```

### Backend Functions

All backend logic runs as serverless edge functions:

| Function | Description |
|----------|-------------|
| `ai-chat` | Conversational AI advisor with financial context |
| `ai-action-plan` | Generates prioritized financial action items |
| `ai-insights` | Produces personalized metric explanations |
| `ai-news-digest` | Curates and analyzes macro news |
| `ai-goal-nudge` | Adaptive goal recommendations |
| `cognitive-bias-analysis` | Detects cognitive biases in user behavior |
| `community-resilience` | Calculates community-level financial scores |
| `crisis-simulation` | Models historical crisis impacts |
| `economic-weather` | 30-day macro outlook generation |
| `education-lesson` | Generates interactive lessons and quizzes |
| `fred-data` | Fetches and processes FRED API data |
| `delete-account` | Secure account deletion with full data wipe |

### Database Schema

Key tables include:
- `profiles` — User financial profile (income, savings, debt, location, age group)
- `financial_goals` — Goal tracking with AI nudges
- `chat_messages` — Persistent AI advisor conversation history
- `notifications` — Real-time alerts on economic changes
- `economic_forecasts` — Cached AI-generated forecasts
- `cognitive_bias_events` — Logged bias detection events
- `community_scores` — Aggregated resilience data
- `lesson_progress` — Education module completion tracking

All tables are protected with Row-Level Security (RLS) policies ensuring users can only access their own data.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/        # Dashboard widgets (HealthScore, MetricCard, PeerBenchmark, etc.)
│   ├── landing/          # Landing page sections (Hero, HowItWorks, Features, CTA, Footer)
│   └── ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── hooks/
│   ├── use-mobile.tsx    # Responsive breakpoint detection
│   ├── use-notifications.ts  # Real-time notification polling
│   └── use-toast.ts      # Toast notification system
├── integrations/
│   └── supabase/         # Auto-generated client and type definitions
├── lib/
│   ├── fred.ts           # FRED API data fetching utilities
│   ├── pdf-export.ts     # PDF report generation
│   └── utils.ts          # Shared utility functions
├── pages/
│   ├── Landing.tsx        # Public landing page
│   ├── Auth.tsx           # Login / Sign up
│   ├── Dashboard.tsx      # Main dashboard
│   ├── AdvisorChat.tsx    # AI financial advisor
│   ├── ActionPlan.tsx     # AI action plan
│   ├── Goals.tsx          # Goal tracker
│   ├── Simulation.tsx     # Crisis simulation
│   ├── Education.tsx      # Financial education
│   ├── BiasMirror.tsx     # Cognitive bias detection
│   ├── EconomicWeather.tsx # 30-day outlook
│   ├── CommunityMap.tsx   # Community resilience
│   ├── NewsDigest.tsx     # AI news digest
│   ├── AIHub.tsx          # AI tools overview
│   ├── Settings.tsx       # User settings + account deletion
│   ├── Onboarding.tsx     # Profile setup wizard
│   └── Install.tsx        # PWA installation guide
supabase/
├── functions/             # Serverless edge functions
└── config.toml            # Backend configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd finora

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

The following are automatically configured via Lovable Cloud:
- `VITE_SUPABASE_URL` — Backend API endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public API key for client-side auth

---

## 🔐 Security

- **Authentication** — Email/password with mandatory email verification
- **Row-Level Security** — Every database table has RLS policies; users can only read/write their own data
- **Edge Functions** — All AI and data processing runs server-side; no API keys are exposed to the client
- **Account Deletion** — Users can permanently delete their account and all associated data from Settings
- **No Anonymous Access** — All data routes require authentication

---

## 📱 Progressive Web App

Finora is installable as a native-like app on both Android and iOS:
- **Android** — Uses the native install prompt via the Web App Manifest
- **iOS** — Step-by-step instructions for "Add to Home Screen" in Safari
- **Offline Caching** — Static assets and Google Fonts are cached via Workbox for faster subsequent loads

Visit `/install` in the app for platform-specific installation instructions.

---

## 👤 Author

**Manoj** — [LinkedIn](https://www.linkedin.com/in/manoj07ar/)

---

## 📄 License

This project is private and not licensed for redistribution.

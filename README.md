# Finora AI — Your Personal Economic Intelligence Platform

Finora turns complex macroeconomic data into clear, actionable insights tailored to your financial profile. Built with real-time data from the Federal Reserve (FRED API) and AI-powered analysis, Finora helps everyday people understand how the economy affects *them*.

## ✨ Features

- **Smart Dashboard** — Health score, peer benchmarks, and personalized metrics updated in real-time
- **AI Financial Advisor** — Chat with an AI that understands your financial context and current economic conditions
- **Action Plan** — AI-generated, prioritized steps based on your goals and the macro environment
- **Economic Weather** — 30-day outlook translating Fed data into plain-language forecasts
- **Goal Tracker** — Set financial goals with AI nudges that adapt to economic shifts
- **Bias Mirror** — Detects cognitive biases in your financial decisions
- **Community Map** — See how your financial resilience compares across demographics
- **Crisis Simulation** — Test your finances against historical economic crises
- **News Digest** — AI-curated macro news with personal impact analysis
- **Financial Education** — Interactive lessons with quizzes on economics and personal finance

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Lovable Cloud (Supabase) |
| AI | Lovable AI Gateway (Gemini, GPT) |
| Data | FRED API (Federal Reserve Economic Data) |
| Auth | Email/password with email verification |
| PWA | Installable on mobile via `vite-plugin-pwa` |

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── dashboard/    # Dashboard widgets
│   ├── landing/      # Landing page sections
│   └── ui/           # shadcn/ui primitives
├── contexts/         # Auth context
├── hooks/            # Custom React hooks
├── integrations/     # Supabase client & types
├── lib/              # Utilities (FRED API, PDF export)
├── pages/            # Route-level page components
supabase/
├── functions/        # Edge functions (AI, data processing)
└── config.toml       # Backend configuration
```

## 🔐 Authentication

Users sign up with email and password. Email verification is required before access is granted. All data routes are protected — unauthenticated users see only the landing page.

## 📱 PWA Support

Finora is installable as a Progressive Web App on both Android and iOS. Visit `/install` for platform-specific instructions.

## 👤 Author

**Manoj** — [LinkedIn](https://www.linkedin.com/in/manoj07ar/)

## 📄 License

This project is private and not licensed for redistribution.

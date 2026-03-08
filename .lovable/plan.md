

# Landing Page Redesign Plan

## Vision
Create a premium, immersive landing page that feels **alive** — not like a template. Drawing from 2026 SaaS best practices: interactive elements, proof density, texture layers, and delightful micro-interactions.

---

## Architecture (5 Sections Total)

```text
┌────────────────────────────────────────────┐
│  HERO: Full-viewport immersive experience  │
│  - Animated gradient mesh background       │
│  - Floating particles (economic symbols)   │
│  - Bold headline with typewriter effect    │
│  - Live metric ticker (Fed rate, etc.)     │
│  - Primary CTA with magnetic hover         │
└────────────────────────────────────────────┘
              ▼
┌────────────────────────────────────────────┐
│  SOCIAL PROOF MARQUEE                      │
│  - Infinite scrolling logo bar             │
│  - Real-time "X users joined today"        │
└────────────────────────────────────────────┘
              ▼
┌────────────────────────────────────────────┐
│  BENTO GRID: Features as visual cards      │
│  - 6 cards in asymmetric grid layout       │
│  - Hover reveals mini-animation/preview    │
│  - Icons with glassmorphism containers     │
│  - One card is an interactive demo         │
└────────────────────────────────────────────┘
              ▼
┌────────────────────────────────────────────┐
│  HOW IT WORKS: Visual timeline             │
│  - 3 steps with connecting line animation  │
│  - Each step reveals on scroll (parallax)  │
│  - Illustration on opposite side           │
└────────────────────────────────────────────┘
              ▼
┌────────────────────────────────────────────┐
│  CTA: Immersive final section              │
│  - Radial gradient pulse background        │
│  - Large headline with glow effect         │
│  - Floating secondary elements             │
│  - Minimal footer integrated               │
└────────────────────────────────────────────┘
```

---

## Key Design Elements

### 1. Hero Section (New Component)
- **Gradient mesh background**: Animated blobs using CSS/Framer Motion
- **Floating economic symbols**: Dollar signs, chart arrows, percent symbols as particles with float animation
- **Headline**: Large serif font with a text gradient reveal animation on load
- **Live ticker**: Subtle horizontal scroll showing "Fed Rate: 5.25% • Inflation: 2.9% • ..." — feels alive
- **Stats row**: Animated number counters that count up on scroll-in-view
- **Magnetic CTA**: Button that subtly follows cursor on hover

### 2. Social Proof Marquee (New Component)
- Infinite horizontal scroll of grayscale logos (placeholder/mock logos)
- Counter showing "127 people joined this week" with subtle pulse
- Thin divider line with gradient accent

### 3. Bento Grid Features (New Component)
- Asymmetric grid: 2 large cards, 4 medium cards
- Each card has:
  - Glassmorphism border with subtle inner shadow
  - Icon with background glow matching brand colors
  - Title + 1-2 line description
  - Hover effect: scale + shadow lift + border glow
- **Easter egg**: One card contains a mini interactive demo — clicking toggles a fake "crisis simulation" animation

### 4. How It Works (Enhanced)
- Vertical timeline with animated connecting line
- Each step appears with staggered fade-in-up
- Alternating left/right layout with illustrations
- Progress dots that fill as user scrolls

### 5. Final CTA Section
- Full-width gradient background with subtle animated pulse
- Large display headline with text-shadow glow
- Floating decorative elements (circles, dots pattern)
- Footer links integrated subtly at bottom

---

## Animation Specifications

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline | Character-by-character fade-in | Page load |
| Floating particles | Continuous float (6-8s loop) | Always |
| Stats numbers | Count-up animation | Scroll into view |
| Bento cards | Staggered scale-in | Scroll into view |
| Timeline line | Draw-in animation | Scroll progress |
| CTA background | Subtle radial pulse | Continuous |
| All buttons | Scale + shadow on hover | Hover |

---

## Easter Eggs
1. **Konami code**: Type arrow sequence to trigger confetti burst
2. **Click counter**: Clicking the logo 5 times reveals a hidden message
3. **Hover the hero image**: Subtle parallax tilt following cursor

---

## Technical Details

### Files to Create
- `src/components/landing/HeroSectionNew.tsx` — Immersive hero
- `src/components/landing/SocialProofMarquee.tsx` — Logo ticker
- `src/components/landing/BentoFeatures.tsx` — Asymmetric feature grid
- `src/components/landing/HowItWorksTimeline.tsx` — Visual timeline
- `src/components/landing/FinalCTA.tsx` — Closing CTA with footer

### Files to Modify
- `src/pages/Landing.tsx` — Replace all sections with new components
- `src/index.css` — Add gradient mesh, glow effects, marquee animations

### Animation Library
Using existing Framer Motion (already installed) for:
- `whileInView` scroll triggers
- Staggered children animations
- Layout animations for hover states

---

## Color & Texture Approach
- Keep existing Finora brand colors (forest green primary, warm cream background)
- Add **noise texture overlay** on hero for depth
- **Glassmorphism** cards with `backdrop-blur` and semi-transparent borders
- **Gradient accents**: Primary-to-secondary gradients on key elements
- **Subtle shadows**: Multiple layered shadows for depth (not flat)

---

## Mobile Considerations
- Bento grid collapses to single column
- Hero image hidden, focus on text content
- Marquee remains but slower
- Timeline becomes vertical centered
- Touch-friendly button sizes (min 48px)


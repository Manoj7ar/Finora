

# Landing Page Redesign

The user loves the "How it works" section -- its inverted dark background, mono step numbers, border-top separators, and clean 2-column layout. The plan is to rebuild the entire landing page using that same visual language: high contrast, typographic hierarchy, mono accents, generous whitespace, and section-level color inversions.

## Design Direction

The "How it works" section's DNA:
- Dark `bg-foreground text-background` inversions for contrast
- Mono `font-mono` step numbers as subtle labels
- `border-t border-background/20` dividers between items
- Two-column asymmetric layouts (heading left, content right)
- Muted opacity text (`text-background/60`, `text-background/70`)
- No cards, no borders, no rounded containers -- just typography and space

Apply this across all sections. Remove the hero dashboard image (it looks washed out in the current light theme). Replace with pure typographic hero.

## Section-by-Section

### 1. Navbar
- Floating pill navbar: logo left, "Get Started" button right. Already exists, keep as-is.

### 2. Hero (light bg)
- Remove the dashboard image entirely. Center-aligned, full-width typographic hero.
- Small mono label: `— 01` style prefix
- Massive headline, centered
- Subtitle underneath, muted
- Single CTA button (rounded-full, dark bg)
- Stats row below with mono labels, using `border-t` dividers between them (horizontal, inline)

### 3. Core Features (dark inverted section, `bg-foreground text-background`)
- Two-column: left side has section label + heading, right side has 4 features listed vertically
- Each feature: mono number (`01`-`04`), `border-t border-background/20`, title, description
- Matches the "How it works" step pattern exactly

### 4. AI Suite (light bg)
- Section label + heading centered
- 2-column x 4-row grid but styled minimally: no card borders, just a mono number prefix, title, one-line description
- Subtle `border-b border-border` between rows, grouped in pairs

### 5. How It Works (dark inverted -- keep as-is, it's already great)
- Preserve exactly

### 6. Final CTA (light bg)
- Centered, typographic. Large heading, subtitle, single button
- Minimal -- just text and a button

### 7. Footer
- Keep minimal, same as current

## Technical Changes

**Single file edit**: `src/pages/Landing.tsx` -- full rewrite. No new components needed. All sections live in one file using the existing `motion` helpers and `fadeIn`/`fadeUp` patterns.

Key removals:
- `heroDashboard` image import (no longer used)
- Card-based AI features grid (replaced with list layout)
- `Bot` icon import (no longer needed for badge)

The result will be a cohesive editorial-style page where every section feels like it belongs to the same design system as the "How it works" block.


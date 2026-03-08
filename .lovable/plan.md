

# Landing Page Redesign — Auth0-Inspired Dark Theme

Taking inspiration from the Auth0 reference image: a dark, immersive landing page with gradient hero, glowing card sections, alternating left-right feature showcases with images, icon grids, and a community CTA section.

## Design Direction

The reference uses:
- **Full dark background** with subtle gradient overlays (purple/blue tints)
- **Gradient hero** with centered headline, subtitle, dual CTAs, and a product screenshot/visual below
- **Feature showcase sections** alternating image-left/text-right and vice versa, with rounded card screenshots
- **Icon grid** for framework/integration logos
- **Announcement banner** with gradient card
- **Two-column value props** with icons
- **Community section** with social links
- **Rich footer** with multiple columns

## Adaptation for Finora

We'll translate this into Finora's identity — keeping the dark aesthetic but using Finora's forest green accent palette instead of purple/blue:

### Sections (top to bottom):

1. **Hero** — Dark bg with subtle radial green gradient glow. Centered small badge ("Personal Economic Intelligence"), large headline, subtitle, two CTAs ("Get Started Free" primary green + "See How It Works" outline), then a glowing dashboard mockup visual below (CSS-generated, no image needed — a stylized card with fake chart lines using CSS/SVG).

2. **3-Column Feature Cards** — Three cards with icons on dark card bg: "Live Economic Data", "AI-Powered Insights", "Crisis Ready". Subtle border glow on hover.

3. **Alternating Feature Sections** (4 sections) — Each has text on one side, a glowing rounded card visual on the other, alternating left/right:
   - "Track live economic vitals" — with a mini dashboard card visual
   - "AI insights personalized to you" — with insight card visual
   - "Run crisis simulations" — with simulation visual
   - "12 AI tools, one financial brain" — with AI tools grid visual

4. **How It Works** — 3-step horizontal layout with numbered circles and connecting lines

5. **Pricing/Value Section** — Simple centered block: "Free for everyone" with feature bullets

6. **Final CTA** — Large gradient card with headline + CTA button

7. **Footer** — Multi-column with logo, nav links, social icons

## Technical Approach

- **Single file rewrite**: `src/pages/Landing.tsx` — complete replacement
- **Dark-only landing**: The landing page itself will force a dark aesthetic using inline dark classes (not changing the app theme). Use explicit dark color values like `bg-[#0a0a0f]`, `text-white`, `text-white/60` etc. rather than semantic tokens, so it's always dark regardless of theme setting.
- **CSS visuals instead of images**: Create mock dashboard/card visuals using styled divs, gradients, and simple SVG chart lines — no external images needed.
- **Animations**: Keep framer-motion `fadeIn`, `fadeUp` patterns.
- **Responsive**: Full mobile support with stacked layouts.
- No new dependencies needed.

## Files Changed
- `src/pages/Landing.tsx` — Full rewrite


# Design Brief — Abdullah Hosen Portfolio

## Direction
Premium cinematic dark tech portfolio: gold + electric cyan accents on near-black charcoal. Refined maximalism—restrained geometry, confident typography, material depth via elevated shadows + glassmorphism. RyanCV System layout faithful with enhanced cinematic animations.

## Tone
Confident, refined, unforgettable. Staggered hero entrance, scroll reveals, accent glows, timeline glow pulse, card border glow, sidebar glass-morphism.

## Color Palette

| Token      | OKLCH           | Role            |
|------------|-----------------|-----------------|
| background | 0.10 0.012 48  | charcoal base   |
| foreground | 0.93 0.008 60  | warm text       |
| card       | 0.15 0.016 48  | surfaces        |
| primary    | 0.72 0.18 50   | gold accent     |
| accent     | 0.72 0.22 210  | electric cyan   |
| muted      | 0.22 0.016 48  | dividers        |
| border     | 0.28 0.018 48  | subtle edges    |

## Typography
Display: **Space Grotesk** (300–700) | Body: **DM Sans** (300–700) | Mono: **JetBrains Mono** (400–700)

## Structural Zones

| Zone    | Background | Border             | Treatment                       |
|---------|------------|--------------------|---------------------------------|
| Sidebar | glass-surface | border/0.3 | sticky desktop, drawer mobile |
| Hero    | bg + gradient | accent glow    | particle BG, stagger entrance |
| Content | card/muted | subtle / glow  | section pad 4–5rem spacing |
| Footer  | muted/20   | border subtle  | contact + scroll-to-top |

## Component Library
- **Buttons**: btn-primary (gold lift hover), btn-secondary (cyan glow border)
- **Cards**: surface-elevated, card-lift on hover, border-accent-glow pulse
- **Badges**: muted-bg, foreground, uppercase tracking, badge-pulse animation
- **Skill bars**: muted container, gradient gold→cyan fill, skill-fill 1.2s ease-out
- **Timeline**: vertical accent glow line, timeline-glow pulse 2s infinite, glowing dots

## Motion & Choreography
Hero: staggered slide-up (0.1s / 0.25s / 0.4s delays, cubic-bezier overshoot) | Scroll reveal: fade-up 40px, 0.6s | Card hover: -4px lift + shadow-elevated | Decorative: float 3s, hero-particle 4s, badge-pulse 2.2s, timeline-glow 2s | **Accessibility**: prefers-reduced-motion disables all

## Token Rules
- OKLCH values only in CSS variables (L C H format)
- No raw hex/rgb/inline colors
- Accent sparingly: CTAs, highlights, interactive feedback
- Gradient text: hero & section headings only
- Scrollbar: thin gold with cyan hover
- Particle BG: subtle, 0.3–0.6 opacity, non-distracting

## Signature
Staggered cinematic hero + gradient overlays + card glow pulse + timeline glow line + scroll-triggered reveals = premium unforgettable experience.

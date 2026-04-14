# Design Brief

## Direction
Luxury Tech Portfolio — cinematic dark premium vCard with dual-accent (gold + electric cyan) creating sophisticated visual tension on near-black charcoal.

## Tone
Bold luxury maximalism with restrained geometry: material UI depth, generous whitespace, accent glows, and confident typography hierarchy.

## Differentiation
Gradient text (gold→cyan) on hero headings + animated skill bars with gradient fills + timeline vertical glow + particle background + card border glows + glass morphism sidebar.

## Color Palette

| Token      | OKLCH           | Role                        |
|------------|-----------------|----------------------------|
| background | 0.10 0.015 50  | near-black charcoal base    |
| foreground | 0.93 0.008 60  | warm off-white text         |
| card       | 0.18 0.02 50   | elevated dark surfaces      |
| primary    | 0.72 0.18 50   | warm golden accent          |
| accent     | 0.72 0.22 210  | electric cyan accent        |
| muted      | 0.25 0.02 50   | dark separator/divider      |
| border     | 0.30 0.02 50   | subtle definition lines     |

## Typography
- Display: Space Grotesk — geometric, confident, tech-forward headings
- Body: DM Sans — clean, approachable, professional content
- Mono: JetBrains Mono — code blocks, testimonials, accent text

## Elevation & Depth
Layered cards with soft elevated shadows + accent border glows; primary/accent illuminate interactive elements; no harsh shadows.

## Structural Zones

| Zone    | Background           | Border                    | Notes                          |
|---------|----------------------|---------------------------|--------------------------------|
| Header  | card with glow      | accent glow 0.3 opacity  | navigation with sidebar       |
| Hero    | background gradient | accent-glow              | profile image circle, CTA     |
| Content | alternating bg/card | subtle border             | section spacing 4-5rem        |
| Footer  | muted with border   | border                    | contact links, attribution    |

## Spacing & Rhythm
Sections spaced 4-5rem apart; card padding 1.5-2rem; micro-spacing 0.5-1rem; generous whitespace reinforces premium feel.

## Component Patterns
- Buttons: gold/cyan with slight hover lift + border glow on accent; rounded 0.5rem
- Cards: 0.5rem radius, card-bg, border-accent-glow, shadow-elevated on hover
- Badges: muted-bg, foreground text, 0.5rem radius, uppercase 0.75rem tracking
- Skill bars: muted-bg container, gradient gold→cyan fill, animated from 0% to var(--skill-value)

## Motion
- Entrance: staggered slide-up + fade-in 0.6s cubic-ease (Motion library integration)
- Hover: card lift (translateY -4px) + border glow pulse 200ms
- Decorative: floating animations on icons 3s ease-in-out, glow-pulse infinite on accents

## Constraints
- No raw hex/rgb colors — use CSS variables exclusively
- Accent colors used sparingly for highlights, CTAs, interactive feedback
- Gradient text only on hero/major headings
- Custom scrollbar: thin, gold primary with cyan hover
- Particle background: subtle, low opacity, non-distracting

## Signature Detail
Gradient text overlays (gold→cyan) on section headings create cinematic depth; paired with animated accent glows and motion library choreography for unforgettable premium feel.

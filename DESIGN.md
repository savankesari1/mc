# Design System

<!-- impeccable:design-schema 1 -->

## Identity

**Aesthetic:** Dark-tech premium — near-black backgrounds, precision type, restrained accents that feel earned not decorative. Think Vercel meets a local Indian institution that punches above its weight.

**THESIS:** A premium consumer education platform that refuses to look like a local tuition center; every pixel signals that learning here is a serious, permanent investment.

**Anti-defaults:** No warm cream paper, no serif display type, no floating-card-on-gradient, no random glass everywhere. The WebGL backgrounds (FloatingLines, DotField) are native to this product and must stay.

## Colors

All colors in oklch. Single accent: indigo/violet (`oklch(0.75 0.15 220)`). Use sparingly.

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.13 0.005 240)` | Page background (near-black) |
| `--foreground` | `oklch(0.98 0 0)` | Primary text |
| `--surface` | `oklch(0.16 0.005 240)` | Card / panel backgrounds |
| `--muted-foreground` | `oklch(0.65 0.01 240)` | Secondary text |
| `--border` | `oklch(1 0 0 / 8%)` | Hairline borders |
| `--accent` | `oklch(0.75 0.15 220)` | Indigo accent (links, highlights) |

Gradient: `indigo → violet → pink` used in display headlines only, not UI chrome.

## Typography

- **Typeface:** Geist Variable (already self-hosted via `@fontsource-variable/geist`)
- **Display:** `font-bold tracking-tighter` at `text-5xl` → `text-8xl`
- **Body:** `text-base leading-relaxed` max-width `65ch`
- **Mono:** Geist Mono Variable for code, labels, eyebrows
- **Eyebrow pattern:** `font-mono text-[10px] uppercase tracking-widest text-indigo-400` — max 1 per 3 sections

## Spacing & Layout

- Max content width: `max-w-6xl` (features), `max-w-4xl` (CTA), `max-w-4xl` (hero content)
- Section vertical rhythm: `py-20 sm:py-28`
- Grid: CSS Grid over flexbox math; `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
- Hero: `min-h-[100dvh]` never `h-screen`

## Shape & Radius

Consistent soft radius: cards `rounded-2xl sm:rounded-3xl`, buttons `rounded-full`, hero CTA rounded-full. No mixing sharp + round.

## Motion

- **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out) for all entries
- **Entry:** opacity + translateY(24px) + blur(8px) → clear. Never from scale(0).
- **Stagger:** 0.07–0.12s between children
- **Duration:** Hero entries 0.7–0.8s; feature cards 0.6s; badge 0.7s
- **Active states:** `active:scale-[0.97]` on all interactive elements
- **Hover:** `hover:scale-[1.03]` on CTAs only, `hover:scale-[1.015]` on cards
- **Reduced motion:** all transitions guarded with `useReducedMotion()`
- **WebGL:** FloatingLines with `screen` blend mode in hero. Client-only via `isClient` state.

## Backgrounds

- **Hero:** FloatingLines (Three.js WebGL) with 5 lines, interactive, parallax, `screen` blend mode. Client-only lazy import.
- **Features:** Ambient radial indigo blob `bg-indigo-500/8 blur-[140px]`
- **Cards:** Per-card accent gradient `from-*/10 to-transparent`

## Components

### Buttons
- Primary: `bg-white text-black rounded-full px-8 h-12` + hover scale + glow shadow + shimmer overlay
- Secondary: `border border-border/60 bg-white/5 backdrop-blur-md rounded-full px-8 h-12`
- All: `active:scale-[0.97]` transition on transform only

### Cards (Feature Bento)
- `rounded-3xl border border-border/40 bg-surface/20 backdrop-blur-xl p-7`
- Hover: `scale-[1.015]` + `bg-surface/40` + `border-border/80` + drop shadow
- Icon: `h-12 w-12 rounded-2xl bg-white/5 border border-white/8` → scale + brightness on hover

### Badge / Eyebrow
- Pill badge: `rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`
- Eyebrow: `font-mono uppercase tracking-widest text-indigo-400 text-[10px]`

## Marquee

Continuous horizontal scroll of category labels. 4× duplication, `-25%` translateX keyframe, 24s linear. Mono font, tiny, subdued.

## Accessibility

- `prefers-reduced-motion`: all framer-motion animations skip via `reduce ? false : {...}`
- Contrast: white on near-black always passes WCAG AA
- Interactive labels and ArrowRight icons marked `aria-hidden` where decorative

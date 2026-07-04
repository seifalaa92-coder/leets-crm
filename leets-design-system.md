# Leets — Brand & Design System Manual
> **For developers:** Upload this file to Claude Code to ensure all UI/UX work aligns with the Leets brand identity.

---

## 1. Brand Overview

| Field | Value |
|---|---|
| **Brand Name** | Leets |
| **Tagline** | Practice > Achieve > Inspire |
| **Industry** | Sports Management / Fitness & Wellness |
| **Facilities** | Padel Academy · Functional Fitness (Gym) · Pilates & Yoga Studios · Swimming Pool · Kids Area · F&B |
| **Market** | GCC (Saudi Arabia — Jeddah launch) |
| **Brand Tone** | Energetic · Aspirational · Inclusive · Premium-Athletic |

---

## 2. Color System

### 2.1 Primary Palette

```css
/* ─── LEETS BRAND COLORS ─── */

--color-primary:        #E8461A;  /* Leets Orange-Red — dominant brand color */
--color-primary-light:  #F26035;  /* Lighter orange for hover states */
--color-primary-dark:   #C93B14;  /* Darker orange for pressed/active states */
--color-primary-10:     #E8461A1A; /* 10% opacity tint — backgrounds/overlays */
--color-primary-20:     #E8461A33; /* 20% opacity tint */

--color-white:          #FFFFFF;
--color-off-white:      #F5F4F0;  /* Warm white, used for light backgrounds */
--color-cream:          #E8E1D0;  /* Sandy/beige neutral — lounge zones */

--color-black:          #111111;  /* Near-black for text */
--color-dark:           #1E1E1E;  /* Dark surfaces, dark mode backgrounds */
--color-charcoal:       #2D2D2D;  /* Secondary dark surface */
```

### 2.2 Zone Accent Colors
Each facility zone has a supporting accent alongside brand orange:

```css
/* Padel Courts */
--color-padel-court:    #C85A2A;  /* Clay/terracotta court surface */
--color-padel-bg:       #F0EBE3;  /* Sand/neutral background */

/* Gym Zone */
--color-gym-dark:       #1A1A1A;  /* Black equipment, dark floors */
--color-gym-accent:     #E8461A;  /* Orange highlights on machines, signage */

/* Pool & Wellness */
--color-pool-teal:      #3ABFBF;  /* Pool water reflection */
--color-wellness-sand:  #D4C4A8;  /* Spa/relaxation neutral */

/* Kids Area + F&B */
--color-kids-warm:      #F28C38;  /* Warmer orange for playful contexts */
--color-fb-neutral:     #F5F0E8;  /* Food area warm background */
```

### 2.3 Semantic / Utility Colors

```css
--color-success:  #2ECC71;
--color-warning:  #F39C12;
--color-error:    #E74C3C;
--color-info:     #3498DB;

--color-border:       #E0D9CF;   /* Default border */
--color-border-dark:  #3A3A3A;   /* Dark mode border */
--color-overlay:      rgba(0,0,0,0.55); /* Modal/image overlays */
```

---

## 3. Typography

### 3.1 Font Stack

```css
/* Headlines — Bold, condensed, athletic */
--font-display: 'Industry', 'Bebas Neue', 'Anton', sans-serif;

/* Body / UI — Clean, readable sans-serif */
--font-body:    'Inter', 'DM Sans', 'Helvetica Neue', Arial, sans-serif;

/* Mono — code, data displays */
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;
```

> **Recommended Google Fonts (free):** Use `Bebas Neue` for display and `Inter` for body. Both available via Google Fonts CDN.

### 3.2 Type Scale

```css
/* Display — Hero headlines, building signage style */
--text-display-2xl: clamp(48px, 8vw, 96px);  /* Main hero titles */
--text-display-xl:  clamp(36px, 6vw, 72px);
--text-display-lg:  clamp(28px, 4vw, 56px);

/* Headings */
--text-h1: clamp(24px, 3vw, 40px);
--text-h2: clamp(20px, 2.5vw, 32px);
--text-h3: clamp(18px, 2vw, 24px);
--text-h4: 20px;
--text-h5: 18px;
--text-h6: 16px;

/* Body */
--text-body-lg:  18px;
--text-body-md:  16px;  /* Default */
--text-body-sm:  14px;
--text-body-xs:  12px;

/* Functional */
--text-label:   11px;  /* uppercase, tracked */
--text-caption: 12px;
```

### 3.3 Typography Rules

```css
/* Display headings — always uppercase, tight tracking */
.heading-display {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.95;
}

/* Section headings */
.heading-section {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  line-height: 1.1;
}

/* Body text */
.body-text {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
}

/* Labels / Tags */
.label-text {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-label);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
```

---

## 4. Spacing & Layout

```css
/* Base unit: 4px */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;

/* Layout containers */
--container-sm:   640px;
--container-md:   768px;
--container-lg:   1024px;
--container-xl:   1280px;
--container-2xl:  1440px;

/* Content padding */
--padding-page-x:     clamp(16px, 5vw, 80px);
--padding-section-y:  clamp(48px, 8vw, 120px);
```

---

## 5. Border Radius

```css
/* Leets uses a mix of sharp and slightly rounded elements */
--radius-none: 0px;      /* Cards with strong graphic identity */
--radius-xs:   2px;      /* Subtle rounding */
--radius-sm:   4px;      /* Buttons, tags */
--radius-md:   8px;      /* Cards, inputs */
--radius-lg:   12px;     /* Modals, panels */
--radius-xl:   16px;     /* Feature cards */
--radius-2xl:  24px;     /* Large hero cards */
--radius-full: 9999px;   /* Pill badges, circular avatars */
```

> **Design Note:** The Leets logo itself uses hexagonal/angular geometry. Use sharp or slightly rounded corners (0–4px) for bold graphic elements. Reserve larger radii for content cards and UI modals.

---

## 6. Shadows & Elevation

```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
--shadow-md:  0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);
--shadow-lg:  0 10px 30px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.10);
--shadow-xl:  0 20px 60px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.12);

/* Orange glow — use on active CTAs, feature highlights */
--shadow-brand: 0 4px 20px rgba(232, 70, 26, 0.35);
--shadow-brand-lg: 0 8px 40px rgba(232, 70, 26, 0.45);
```

---

## 7. Component Library

### 7.1 Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-brand);
}
.btn-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-brand-lg);
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Secondary Button — outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  padding: 12px 26px;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* Ghost Button — for dark backgrounds */
.btn-ghost {
  background: transparent;
  color: var(--color-white);
  border: 2px solid rgba(255,255,255,0.6);
  /* same font/size/padding as secondary */
}
.btn-ghost:hover {
  border-color: var(--color-white);
  background: rgba(255,255,255,0.1);
}

/* Icon Button */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-10);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.btn-icon:hover {
  background: var(--color-primary);
  color: var(--color-white);
}
```

### 7.2 Cards

```css
/* Standard Card */
.card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Feature Card — dark with orange accent */
.card-feature {
  background: var(--color-dark);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-primary);
  padding: var(--space-8);
}

/* Zone Card — labeled facility cards */
.card-zone {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  aspect-ratio: 4/3;
}
.card-zone .zone-label {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-4);
  background: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: var(--radius-xs);
}

/* Stat Card */
.card-stat {
  background: var(--color-off-white);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
}
.card-stat .stat-value {
  font-family: var(--font-display);
  font-size: var(--text-display-xl);
  color: var(--color-primary);
  line-height: 1;
}
.card-stat .stat-label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--color-charcoal);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: var(--space-2);
}
```

### 7.3 Navigation

```css
/* Top Navigation */
.navbar {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  height: 64px;
  padding: 0 var(--padding-page-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

/* Dark Navbar variant (for use over hero images) */
.navbar-dark {
  background: rgba(17, 17, 17, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* Nav links */
.nav-link {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-charcoal);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease;
}
.nav-link:hover, .nav-link.active {
  color: var(--color-primary);
}
.nav-link.active::after {
  content: '';
  display: block;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

/* Sidebar / Tab Navigation (for app zones) */
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-charcoal);
  cursor: pointer;
  transition: all 0.15s ease;
}
.sidebar-nav-item.active {
  background: var(--color-primary-10);
  color: var(--color-primary);
  font-weight: 600;
}
.sidebar-nav-item:hover:not(.active) {
  background: var(--color-off-white);
}
```

### 7.4 Forms & Inputs

```css
.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  color: var(--color-black);
  background: var(--color-white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-10);
}
.form-input::placeholder {
  color: #AAAAAA;
}
.form-input.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.12);
}

.form-label {
  display: block;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-body-sm);
  color: var(--color-charcoal);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-select {
  /* Same as .form-input with dropdown arrow */
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* custom chevron in #E8461A */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}
```

### 7.5 Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-body-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.badge-primary  { background: var(--color-primary-10); color: var(--color-primary); }
.badge-dark     { background: var(--color-dark); color: var(--color-white); }
.badge-success  { background: rgba(46,204,113,0.15); color: #1a9e55; }
.badge-warning  { background: rgba(243,156,18,0.15); color: #c47d00; }
.badge-error    { background: rgba(231,76,60,0.15); color: #c0392b; }

/* Zone tags */
.tag-zone {
  background: var(--color-primary);
  color: var(--color-white);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
}
```

---

## 8. Facility Zones — Design Language

Each zone in the Leets facility has its own sub-identity. Use these rules when designing zone-specific screens/pages:

### 8.1 Zone Color Matrix

| Zone | Primary | Background | Accent | Icon Style |
|---|---|---|---|---|
| **Admin / Reception** | `#E8461A` | `#FFFFFF` + Orange chairs | Cream `#E8E1D0` | Professional, clean |
| **Padel Courts** | `#C85A2A` | `#F0EBE3` (sand) | Black metal | Athletic, bold |
| **Gym Zone** | `#E8461A` | `#111111` / `#FFFFFF` | Black equipment | Energetic, dark |
| **Lockers & Studios** | `#E8461A` | `#FFFFFF` | White/grey tiles | Clean, fresh |
| **Pools & Bar** | `#E8461A` | `#F5F4F0` | Teal `#3ABFBF` | Sleek, premium |
| **Kids Area + F&B** | `#F28C38` | `#FFF8F3` | Warm white | Playful, friendly |

### 8.2 Zone Usage in UI

```jsx
// Zone identifier constants (use for routing, filtering, theming)
const ZONES = {
  ADMIN:     { id: 'admin',     label: 'Admin',         color: '#E8461A', bg: '#FFFFFF' },
  PADEL:     { id: 'padel',     label: 'Padel Courts',  color: '#C85A2A', bg: '#F0EBE3' },
  GYM:       { id: 'gym',       label: 'Gym Zone',      color: '#E8461A', bg: '#111111' },
  LOCKERS:   { id: 'lockers',   label: 'Lockers',       color: '#E8461A', bg: '#FFFFFF' },
  STUDIOS:   { id: 'studios',   label: 'Studios',       color: '#E8461A', bg: '#FAFAFA' },
  POOL:      { id: 'pool',      label: 'Pool',          color: '#3ABFBF', bg: '#F5F4F0' },
  BAR:       { id: 'bar',       label: 'Bar & Lounge',  color: '#E8461A', bg: '#1E1E1E' },
  KIDS:      { id: 'kids',      label: 'Kids Area',     color: '#F28C38', bg: '#FFF8F3' },
  FB:        { id: 'fb',        label: 'F&B',           color: '#F28C38', bg: '#FFF8F3' },
};
```

---

## 9. Logo Usage

### 9.1 Logo Specifications
- **Format:** The Leets logo uses bold, geometric hexagonal letterforms
- **Color:** Primary usage is full orange `#E8461A` on white or light backgrounds
- **Reversed:** White logo on dark/image backgrounds
- **Minimum size:** 80px wide (digital), 25mm wide (print)
- **Clear space:** Minimum 0.5× logo-height on all sides

### 9.2 Logo Don'ts
- ❌ Do not recolor the logo to any color other than brand orange, white, or black
- ❌ Do not add drop shadows or effects to the logo
- ❌ Do not place logo on busy backgrounds without a solid backing
- ❌ Do not stretch or distort proportions
- ❌ Do not use low-resolution versions

### 9.3 Logo Files to Request from Design Team
```
leets-logo-orange.svg     ← Primary use
leets-logo-white.svg      ← Dark backgrounds
leets-logo-black.svg      ← Monochrome
leets-logo-stacked.svg    ← Square/vertical lockup
leets-icon-only.svg       ← App icon / favicon
```

### 9.4 Tagline
Always render the tagline in the format:
```
PRACTICE > ACHIEVE > INSPIRE
```
Using `>` as the separator (not dashes, dots, or `|`).

---

## 10. Iconography

```
Style:      Outlined, 2px stroke weight, rounded line caps
Size grid:  16 · 20 · 24 · 32 · 48px
Color:      Inherits text color; accent icons use --color-primary
Library:    Phosphor Icons or Lucide Icons (both match the brand aesthetic)

Sport icons: Use filled/bold variants for sport category chips
```

---

## 11. Imagery & Photography Guidelines

### Style Rules
- **Action-forward:** Show athletes in motion, real courts, real training
- **Lighting:** High-contrast with strong directional light; avoid flat lighting
- **Color grading:** Warm with slight orange/red tone — never cold/blue filters
- **Backgrounds:** White walls + orange brand color preferred; avoid cluttered backgrounds
- **People:** Diverse, aspirational, active — not stock-photo generic
- **Courts/Equipment:** Feature orange brand color on walls, floors, and signage

### Overlay Treatment
When placing text on images:
```css
.image-overlay-dark {
  background: linear-gradient(
    to top,
    rgba(17,17,17,0.85) 0%,
    rgba(17,17,17,0.40) 50%,
    rgba(17,17,17,0.0) 100%
  );
}

.image-overlay-brand {
  background: linear-gradient(
    135deg,
    rgba(232,70,26,0.75) 0%,
    rgba(17,17,17,0.60) 100%
  );
}
```

---

## 12. Motion & Animation

```css
/* Timing tokens */
--duration-fast:   150ms;
--duration-base:   200ms;
--duration-slow:   300ms;
--duration-slower: 500ms;

/* Easing */
--ease-default:   cubic-bezier(0.16, 1, 0.3, 1);   /* Spring-like, snappy */
--ease-in:        cubic-bezier(0.4, 0, 1, 1);
--ease-out:       cubic-bezier(0, 0, 0.2, 1);
--ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1); /* Subtle bounce on CTAs */

/* Standard transitions */
.transition-standard {
  transition: all var(--duration-base) var(--ease-default);
}

/* Page enter animation */
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-enter { animation: slideUpFade var(--duration-slow) var(--ease-default); }

/* Number counter (for stats) */
@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

## 13. Dark Mode

```css
/* Leets brand works strongly in dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:         #111111;
    --color-surface:    #1E1E1E;
    --color-surface-2:  #2D2D2D;
    --color-text:       #F5F4F0;
    --color-text-muted: #9A9A9A;
    --color-border:     #3A3A3A;
  }
  /* Brand orange remains identical in dark mode — it pops even more */
}
```

---

## 14. Application-Specific Guidelines

### 14.1 Member App

```
Theme:         Light by default, dark mode supported
Navigation:    Bottom tab bar (mobile), sidebar (tablet/web)
Accent:        --color-primary throughout
Key screens:   Dashboard · Book a Court · Class Schedule · Profile · Leaderboard

Booking flow:
  Step 1 → Select Zone (use Zone color matrix)
  Step 2 → Select Time Slot (orange highlight on selected)
  Step 3 → Confirm (primary CTA button)
  Step 4 → Success state (orange check animation)
```

### 14.2 Admin Dashboard

```
Theme:         Light with white surfaces and orange sidebar accent
Layout:        Fixed sidebar (240px) + content area
Tables:        White rows, orange header row or left border on active row
Charts:        Primary color = #E8461A, secondary = #3ABFBF (pool/wellness data)
KPI cards:     Use card-stat component from Section 7.2
```

### 14.3 Public Website

```
Hero section:     Full-viewport, dark overlay on facility image, large display type
Section padding:  --padding-section-y (generous whitespace)
CTA sections:     Orange background with white type — never the reverse
Zone showcase:    Grid of card-zone components
Membership plans: Three-column card layout, recommended plan has orange border
```

### 14.4 Signage / Wayfinding (Digital Screens)

```
Orientation: Landscape 1920×1080 or Portrait 1080×1920
Background:  White (#FFFFFF) or Brand Orange (#E8461A)
Type:        Display font, ALL CAPS, minimum 60pt
Zone label:  Bottom-left, orange badge
Logo:        Top-right corner, minimum 120px wide
```

---

## 15. Grid & Responsive Breakpoints

```css
/* Breakpoints */
--bp-xs:  375px;   /* Small mobile */
--bp-sm:  640px;   /* Mobile */
--bp-md:  768px;   /* Tablet portrait */
--bp-lg:  1024px;  /* Tablet landscape / small desktop */
--bp-xl:  1280px;  /* Desktop */
--bp-2xl: 1536px;  /* Large desktop */

/* Column grid */
@media (max-width: 640px)  { .grid { grid-template-columns: 1fr; } }
@media (min-width: 641px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }

/* Standard gap */
--grid-gap: clamp(16px, 2vw, 32px);
```

---

## 16. Accessibility

```
Color contrast:  All text on primary orange must be white (#FFFFFF)
                 Orange on white: passes AA at 14px+ bold (ratio ≈ 3.5:1)
                 Use dark (#111111) text on cream/off-white backgrounds

Focus styles:    3px outline in --color-primary, 2px offset
                 .focused { outline: 3px solid var(--color-primary); outline-offset: 2px; }

Touch targets:   Minimum 44×44px for all interactive elements

Motion:          Respect prefers-reduced-motion; skip animations when set
```

---

## 17. Tailwind CSS Config (if using Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E8461A',
          light:   '#F26035',
          dark:    '#C93B14',
          50:      '#FEF1ED',
          100:     '#FDDDD5',
          500:     '#E8461A',
          600:     '#C93B14',
          700:     '#A82E0F',
        },
        cream:   '#E8E1D0',
        offwhite:'#F5F4F0',
        padel:   '#C85A2A',
        pool:    '#3ABFBF',
        kids:    '#F28C38',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Industry', 'Anton', 'sans-serif'],
        body:    ['Inter', 'DM Sans', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl':'24px',
      },
      boxShadow: {
        'brand':    '0 4px 20px rgba(232, 70, 26, 0.35)',
        'brand-lg': '0 8px 40px rgba(232, 70, 26, 0.45)',
      },
    },
  },
};
```

---

## 18. Voice & Copy Guidelines

```
Tone:        Direct · Energetic · Motivational · Inclusive
Avoid:       Passive voice, filler words, overly corporate language
Capitalize:  Zone names, product names (Padel Courts, Gym Zone, Leets Academy)
Numbers:     Spell out 1–9; use numerals 10+
Arrows:      Use > as brand separator (not → or /)

Tagline variants (all valid):
  Primary:   PRACTICE > ACHIEVE > INSPIRE
  Short:     PRACTICE. ACHIEVE. INSPIRE.
  App UI:    Practice · Achieve · Inspire

CTAs:
  Book now   |   Join Leets   |   Explore zones
  Reserve your court   |   Start training
```

---

## 19. Quick Reference Cheatsheet

```
PRIMARY COLOR:    #E8461A
WHITE:            #FFFFFF
DARK:             #111111
CREAM/NEUTRAL:    #E8E1D0

DISPLAY FONT:     Bebas Neue (uppercase, tight tracking)
BODY FONT:        Inter (regular/medium/semibold)

BORDER RADIUS:    0–4px (graphic elements), 8px (cards), 12px (modals)
BUTTON PADDING:   14px 28px (primary), 12px 26px (secondary)
BUTTON FONT:      Bebas Neue OR Inter SemiBold, uppercase, tracked

TAGLINE FORMAT:   PRACTICE > ACHIEVE > INSPIRE
ZONE SEPARATOR:   >  (greater-than symbol)

SHADOWS:          Always warm (avoid cold grey shadows)
ANIMATION:        Fast (150–200ms), spring easing
```

---

*Last updated: February 2026 | Based on Leets GCC moodboard — Jeddah launch edition*
*Brand created by Leets Marketing Agency | Design system compiled for Claude Code integration*

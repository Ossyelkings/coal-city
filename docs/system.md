# Coal City Jacuzzi & Plumbing Supplies — Design System

## 1. Color Palette

### Navy (Primary Dark)

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `navy-950`  | `#050d1a` | Deepest background, scrollbar track         |
| `navy-900`  | `#0a1628` | Primary dark background, hero sections      |
| `navy-800`  | `#0f2035` | Card backgrounds on dark surfaces           |
| `navy-700`  | `#1e3a5f` | Borders, secondary dark elements            |
| `navy-600`  | `#2a4f7a` | Hover states on dark elements               |
| `navy-500`  | `#3a6b9f` | Muted interactive elements                  |

### Gold (Accent)

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `gold-400`  | `#e8c06a` | Light gold, highlights, hover states        |
| `gold-500`  | `#d4a853` | Primary accent, CTAs, scrollbar thumb       |
| `gold-600`  | `#b8903f` | Pressed/active states                       |
| `gold-700`  | `#9a7832` | Dark gold for contrast contexts             |

### Cream (Neutral / Light)

| Token       | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `cream-50`  | `#fdfbf7` | Main page background, body                  |
| `cream-100` | `#f7f3eb` | Card backgrounds on light surfaces          |
| `cream-200` | `#ede5d5` | Borders, dividers on light surfaces         |

### Semantic Colors

| Purpose     | Value                     |
|-------------|---------------------------|
| Body text   | `#1a1a2e`                 |
| Selection   | Background `#d4a853`, text `#0a1628` |
| Theme meta  | `#0a1628`                 |

---

## 2. Typography

### Font Families

| Token          | Stack                                      | Usage                          |
|----------------|---------------------------------------------|-------------------------------|
| `font-display` | `"Playfair Display", Georgia, serif`        | Headings, titles, logo text    |
| `font-body`    | `"DM Sans", system-ui, sans-serif`          | Body text, UI elements, forms  |

### Loading

Fonts are loaded via Google Fonts with preconnect for performance:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### Weights

| Font             | Weights Available         |
|------------------|---------------------------|
| DM Sans          | 300, 400, 500, 600, 700  |
| Playfair Display | 400, 500, 600, 700, 800  |

### Usage Rules

- **Playfair Display** is reserved for headings (`h1`–`h3`), section titles, the logo, and decorative pull quotes. Never use it for body paragraphs or UI labels.
- **DM Sans** is the default body font (set on `<body>`). Use it for paragraphs, form inputs, buttons, nav links, and all general UI text.
- Heading hierarchy uses Tailwind's responsive sizing (e.g., `text-4xl md:text-5xl lg:text-6xl`).

---

## 3. Component Patterns

### Buttons

**Primary CTA (Gold)**
```
bg-gold-500 text-navy-900 font-semibold px-8 py-3 rounded-full
hover:bg-gold-400 hover:shadow-lg hover:scale-105
transition-all duration-300
```

**Secondary CTA (Outlined)**
```
border-2 border-gold-500 text-gold-500 px-8 py-3 rounded-full
hover:bg-gold-500 hover:text-navy-900
transition-all duration-300
```

**Dark variant (on light backgrounds)**
```
bg-navy-900 text-cream-50 px-8 py-3 rounded-full
hover:bg-navy-800
transition-all duration-300
```

### Cards

**Product Card (Gallery)**
- Rounded corners: `rounded-2xl`
- Overflow hidden with image at top
- Gradient overlay on image (`bg-gradient-to-t from-navy-900/80`)
- Text content padded below
- Hover: `hover:scale-[1.03]` with `hover:shadow-xl`
- Transition: `transition-all duration-500`
- Shimmer effect via `animate-shimmer` on a pseudo-element

**Info Card (Why Choose Us / Values)**
- Background: `bg-white` or `bg-cream-50`
- Border: `border border-cream-200`
- Rounded: `rounded-2xl`
- Padding: `p-8`
- Icon container: `w-16 h-16 bg-gold-500/10 rounded-2xl` with centered SVG
- Hover: subtle shadow lift

**Team Card**
- Image with gradient overlay
- Name in `font-display`
- Role in `text-gold-500`
- Rounded: `rounded-2xl`

### Form Inputs

```
w-full px-4 py-3 rounded-xl
bg-cream-50 border border-cream-200
text-navy-900 placeholder-navy-500/50
focus:ring-2 focus:ring-gold-500 focus:border-gold-500
transition-all duration-300
```

### Badges / Tags

**Category filter buttons (Gallery):**
```
px-6 py-2.5 rounded-full font-medium text-sm
transition-all duration-300

Active:   bg-gold-500 text-navy-900 shadow-lg
Inactive: bg-white text-navy-700 border border-cream-200
          hover:border-gold-500 hover:text-gold-600
```

**Stat badge (e.g., "15+ Years"):**
```
bg-gold-500 text-navy-900 font-bold rounded-2xl
px-6 py-3 shadow-lg
```

### Modals

**Quote Modal:**
- Overlay: `bg-navy-950/70 backdrop-blur-sm`
- Container: `bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 p-8`
- Close button: top-right `text-navy-400 hover:text-navy-900`
- Close triggers: Escape key, backdrop click, close button
- Animate in: `animate-scale-in`

---

## 4. Animation System

### Keyframes

| Name             | From                                | To                              | Duration | Easing    | Repeat   |
|------------------|--------------------------------------|---------------------------------|----------|-----------|----------|
| `fadeInUp`       | `opacity:0; translateY(30px)`        | `opacity:1; translateY(0)`      | 0.8s     | ease-out  | once     |
| `fadeIn`         | `opacity:0`                          | `opacity:1`                     | 0.6s     | ease-out  | once     |
| `slideInRight`   | `opacity:0; translateX(40px)`        | `opacity:1; translateX(0)`      | 0.7s     | ease-out  | once     |
| `scaleIn`        | `opacity:0; scale(0.95)`             | `opacity:1; scale(1)`           | 0.5s     | ease-out  | once     |
| `shimmer`        | `background-position: -200% 0`      | `background-position: 200% 0`  | 3s       | linear    | infinite |
| `float`          | `translateY(0)` / `translateY(-8px)` | cycles                          | 4s       | ease-in-out | infinite |
| `goldPulse`      | `box-shadow: 0 0 0 0 rgba(212,168,83,0.3)` | `box-shadow: 0 0 20px 5px rgba(212,168,83,0.15)` | 3s | ease-in-out | infinite |

### Utility Classes

| Class                    | Animation                |
|--------------------------|--------------------------|
| `.animate-fade-in-up`    | fadeInUp 0.8s ease-out   |
| `.animate-fade-in`       | fadeIn 0.6s ease-out     |
| `.animate-slide-in-right`| slideInRight 0.7s ease-out |
| `.animate-scale-in`      | scaleIn 0.5s ease-out    |
| `.animate-shimmer`       | shimmer 3s linear infinite |
| `.animate-float`         | float 4s ease-in-out infinite |
| `.animate-gold-pulse`    | goldPulse 3s ease-in-out infinite |

### Stagger Delay Classes

Delays from `.delay-100` to `.delay-800` in 100ms increments. Applied alongside an animation class to stagger sibling elements:

```html
<div class="animate-fade-in-up delay-100">First</div>
<div class="animate-fade-in-up delay-200">Second</div>
<div class="animate-fade-in-up delay-300">Third</div>
```

---

## 5. Spacing & Layout Grid

### Container

- Max width: Tailwind's `max-w-7xl` (80rem / 1280px)
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Section Spacing

- Vertical padding: `py-20 md:py-28` (large sections), `py-16` (medium sections)
- Between-section gaps: consistent `py-20` rhythm

### Grid System

| Context               | Mobile | Tablet (`md`) | Desktop (`lg`) |
|------------------------|--------|---------------|----------------|
| Product cards (Gallery) | 1 col  | 2 cols        | 3 cols         |
| Category cards (Home)   | 1 col  | 2 cols        | 3 cols         |
| Value cards             | 1 col  | 2 cols        | 4 cols (`xl`)  |
| Team cards              | 1 col  | 2 cols        | 4 cols         |
| Footer columns          | 1 col  | 2 cols        | 4 cols         |
| Contact info            | 1 col  | 2 cols        | 2 cols         |

Grid gap: `gap-6` or `gap-8` depending on card density.

---

## 6. Responsive Breakpoints

Uses Tailwind's default mobile-first breakpoints:

| Breakpoint | Min Width | Usage                                    |
|------------|-----------|------------------------------------------|
| (default)  | 0px       | Single-column, stacked layouts           |
| `sm`       | 640px     | Minor adjustments (padding, font size)   |
| `md`       | 768px     | Two-column grids, tablet layouts         |
| `lg`       | 1024px    | Three-column grids, desktop layouts      |
| `xl`       | 1280px    | Four-column grids, max-width containers  |
| `2xl`      | 1536px    | Rarely used; extra-wide refinements      |

### Responsive Patterns

- **Navbar:** Full horizontal links on `md+`, hamburger menu on mobile
- **Hero text:** `text-4xl` / `md:text-5xl` / `lg:text-6xl`
- **Section padding:** `px-4 sm:px-6 lg:px-8`
- **Grids:** Progressive column expansion (1 -> 2 -> 3 -> 4)

---

## 7. Visual Effects

### Gradients

**Hero overlay:**
```
bg-gradient-to-b from-navy-900/95 via-navy-900/80 to-navy-900/95
```

**Product card image overlay:**
```
bg-gradient-to-t from-navy-900/80 via-transparent to-transparent
```

**Gold text gradient (logo):**
```
bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400
bg-clip-text text-transparent
```

**Diagonal line decorator:**
```css
.diagonal-line::after {
  content: "";
  position: absolute;
  width: 1px;
  height: 120px;
  background: linear-gradient(to bottom, transparent, #d4a853, transparent);
  transform: rotate(25deg);
}
```

### Glass Morphism

**Navbar (scrolled state):**
```
bg-navy-900/95 backdrop-blur-md shadow-lg
```

**Modal overlay:**
```
bg-navy-950/70 backdrop-blur-sm
```

### Grain Texture

Applied globally via `body::before`:
```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  opacity: 0.015;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  background-repeat: repeat;
}
```

Creates a subtle film-grain overlay across the entire application for a premium tactile feel.

### Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0a1628; }
::-webkit-scrollbar-thumb {
  background: #d4a853;
  border-radius: 4px;
}
```

---

## 8. Icon System

All icons are **inline SVGs** rendered directly in JSX. No icon library is used.

### Icon Categories

| Context          | Style                                       |
|------------------|---------------------------------------------|
| Navigation       | 24x24 stroke icons (menu, close)            |
| Category cards   | Unicode emoji characters (e.g., hot springs) |
| Value/reason cards | 24x24 fill SVGs in colored containers      |
| Contact info     | 20x20 stroke SVGs                           |
| Social media     | 24x24 fill SVGs (Facebook, Instagram, Twitter) |
| Quote modal      | Checkmark for success state                  |
| Footer           | Small inline SVGs for contact details        |

### Icon Container Pattern

```
w-16 h-16 bg-gold-500/10 rounded-2xl
flex items-center justify-center
```

SVG inside: `w-8 h-8 text-gold-500`

### Decorative Elements

Floating geometric shapes in hero/CTA sections:
- Circles with `border border-gold-500/20`
- Positioned absolutely, animated with `animate-float`
- Various sizes (64px, 96px, 48px)

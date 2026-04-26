# Design System Reference

> Always use this design system when writing any UI code (HTML, CSS, React, Tailwind, etc.). Do not deviate from these colors, fonts, or component patterns.

---

## Color Palette

### Primary — `#1A7A4A`
The main brand green. Use for primary buttons, active states, key highlights, and links.

| Shade | Hex |
|-------|-----|
| Dark | `#0F4C2A` |
| Base | `#1A7A4A` |
| Mid | `#2DB56C` |
| Light | `#6ECFA0` |
| Pale | `#B8EDD4` |
| Surface | `#F0FAF5` |

### Secondary — `#0F4C2A`
Deep forest green. Use for inverted buttons, dark backgrounds, secondary headings.

### Tertiary — `#2DB56C`
Bright accent green. Use for hover states, badges, progress indicators, and icons.

### Neutral — `#4B4B4B`
Dark gray. Use for body text, icons, borders, and all non-colored UI elements.

| Shade | Hex |
|-------|-----|
| Dark | `#1A1A1A` |
| Base | `#4B4B4B` |
| Mid | `#888888` |
| Light | `#C4C4C4` |
| Pale | `#E8E8E8` |
| Surface | `#F5F5F5` |

### Semantic Colors
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#F5F5F5` | Page/card background |
| Surface | `#FFFFFF` | Card, modal, panel surfaces |
| Border | `#E8E8E8` | Dividers, outlines |
| Text Primary | `#1A1A1A` | Headlines, strong text |
| Text Secondary | `#4B4B4B` | Body text |
| Text Muted | `#888888` | Placeholders, captions |
| Danger | `#D93025` | Delete/destructive actions |

---

## Typography

**Font Family:** `Inter` (import from Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

font-family: 'Inter', sans-serif;
```

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Headline | `2rem` (32px) | `600` | `#1A1A1A` |
| Body | `1rem` (16px) | `400` | `#4B4B4B` |
| Label | `0.875rem` (14px) | `500` | `#4B4B4B` |
| Caption | `0.75rem` (12px) | `400` | `#888888` |

---

## CSS Variables (Copy into every project)

```css
:root {
  /* Brand Greens */
  --color-primary:        #1A7A4A;
  --color-primary-dark:   #0F4C2A;
  --color-primary-light:  #2DB56C;
  --color-primary-pale:   #B8EDD4;
  --color-primary-surface:#F0FAF5;

  /* Neutrals */
  --color-neutral-900:    #1A1A1A;
  --color-neutral-700:    #4B4B4B;
  --color-neutral-500:    #888888;
  --color-neutral-300:    #C4C4C4;
  --color-neutral-100:    #E8E8E8;
  --color-neutral-50:     #F5F5F5;

  /* Semantic */
  --color-background:     #F5F5F5;
  --color-surface:        #FFFFFF;
  --color-border:         #E8E8E8;
  --color-text:           #1A1A1A;
  --color-text-secondary: #4B4B4B;
  --color-text-muted:     #888888;
  --color-danger:         #D93025;

  /* Typography */
  --font-family:          'Inter', sans-serif;
  --font-size-headline:   2rem;
  --font-size-body:       1rem;
  --font-size-label:      0.875rem;
  --font-size-caption:    0.75rem;

  /* Spacing */
  --radius-sm:            6px;
  --radius-md:            10px;
  --radius-lg:            16px;
  --radius-full:          9999px;
}
```

---

## Components

### Buttons

#### Primary Button
```css
background-color: var(--color-primary);   /* #1A7A4A */
color: #FFFFFF;
border: none;
border-radius: var(--radius-md);
padding: 10px 20px;
font-family: var(--font-family);
font-size: var(--font-size-label);
font-weight: 500;
cursor: pointer;

/* Hover */
background-color: var(--color-primary-dark);  /* #0F4C2A */
```

#### Secondary Button
```css
background-color: transparent;
color: var(--color-neutral-700);
border: 1.5px solid var(--color-neutral-300);
border-radius: var(--radius-md);
padding: 10px 20px;
```

#### Inverted Button
```css
background-color: var(--color-neutral-900);  /* #1A1A1A */
color: #FFFFFF;
border: none;
border-radius: var(--radius-md);
padding: 10px 20px;
```

#### Outlined Button
```css
background-color: transparent;
color: var(--color-neutral-900);
border: 1.5px solid var(--color-neutral-900);
border-radius: var(--radius-md);
padding: 10px 20px;
```

### Icon Buttons (Circular)
```css
width: 40px;
height: 40px;
border-radius: var(--radius-full);
background-color: var(--color-primary);
color: #FFFFFF;
display: flex;
align-items: center;
justify-content: center;
border: none;
cursor: pointer;
```
- **Danger icon button:** `background-color: var(--color-danger)` (`#D93025`)

### Label / Badge
```css
display: inline-flex;
align-items: center;
gap: 6px;
background-color: var(--color-primary);
color: #FFFFFF;
border-radius: var(--radius-sm);
padding: 6px 12px;
font-size: var(--font-size-label);
font-weight: 500;
```

### Search Input
```css
background-color: var(--color-neutral-50);
border: 1.5px solid var(--color-neutral-100);
border-radius: var(--radius-md);
padding: 10px 14px;
font-family: var(--font-family);
font-size: var(--font-size-body);
color: var(--color-text);
width: 100%;

/* Placeholder */
color: var(--color-text-muted);

/* Focus */
border-color: var(--color-primary);
outline: none;
```

### Card / Panel
```css
background-color: var(--color-surface);   /* #FFFFFF */
border-radius: var(--radius-lg);
padding: 20px;
box-shadow: 0 1px 4px rgba(0,0,0,0.06);
```

### Divider / Rule
```css
border: none;
border-top: 2px solid var(--color-primary);
width: 60%;
```

---

## Tailwind Config (if using Tailwind CSS)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A7A4A',
          dark:    '#0F4C2A',
          light:   '#2DB56C',
          pale:    '#B8EDD4',
          surface: '#F0FAF5',
        },
        neutral: {
          900: '#1A1A1A',
          700: '#4B4B4B',
          500: '#888888',
          300: '#C4C4C4',
          100: '#E8E8E8',
          50:  '#F5F5F5',
        },
        danger: '#D93025',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
    },
  },
};
```

---

## Quick Rules

1. **Never** use default blues or purples — this is an all-green brand.
2. **Primary green** (`#1A7A4A`) is the main action color.
3. **All text** uses Inter. No other fonts.
4. **Backgrounds** are always `#F5F5F5` (page) or `#FFFFFF` (cards).
5. **Danger/delete** actions use `#D93025` only.
6. **Borders and dividers** use `#E8E8E8` (light) or primary green (accent).
7. **Icon buttons** are always circular with primary green fill, except destructive ones (red).
8. **Spacing and radii** follow the variables above — don't use arbitrary values.
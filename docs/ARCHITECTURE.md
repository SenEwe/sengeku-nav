# Architecture — Sengeku Nav

## Overview
Apple-style navigation for WordPress Block Themes. Replaces the visual appearance of the native WP navigation with a fullscreen blur overlay (mobile) and hover-activated submenus (desktop). All functional behavior (focus management, scroll lock, ARIA) remains handled by WordPress.

## Tech Stack
- **PHP 7.4+** — Plugin loader, GSAP fallback, parent URL injection
- **CSS** — Theme-aware styling via CSS custom properties (`--wp--preset--color--*`)
- **JavaScript (vanilla)** — MutationObserver for menu state, GSAP for animations
- **GSAP 3.12** — Stagger animations (shared with sengeku-motion or loaded standalone)
- **Three.js** — (planned) 3D floating label navigation
- **View Transitions API** — (planned) Page transition effects

## File Structure
```
sengeku-nav/
├── sengeku-nav.php          # Plugin main: enqueue assets, inject parent URLs
├── assets/
│   ├── css/nav.css          # Overlay styling, submenu accordion, theme colors
│   └── js/nav.js            # MutationObserver, GSAP animations, accordion logic
├── docs/
│   ├── ARCHITECTURE.md      # This file
│   ├── DECISIONS.md         # Architectural decisions
│   └── KNOWN-ISSUES.md      # Open problems
└── languages/               # (future) Translations
```

## Data Flow
```
User clicks burger → WP adds .is-menu-open → MutationObserver detects →
  GSAP staggers menu items in → User sees animated overlay

User taps parent item → JS prevents navigation → adds .sengeku-submenu-open →
  CSS shows submenu (display: block) → GSAP animates children in

Desktop hover → JS sets inline display:block on submenu →
  GSAP staggers submenu items → mouseleave clears styles
```

## WordPress Hooks Used
| Hook | What | Why |
|---|---|---|
| `wp_enqueue_scripts` | Load CSS + JS | Global (nav is on every page) |
| `render_block` (core/navigation-submenu) | Inject `data-sengeku-parent-url` | Preserve parent URL that WP converts to button |

## External Dependencies
| Dependency | Source | Fallback |
|---|---|---|
| GSAP 3.12 | Shared with sengeku-motion or CDN | Plugin works without GSAP (CSS only) |
| Three.js | (planned) CDN | Standard nav without 3D |

## Design Principle
**Never fight WordPress.** We only add visual styling and animations. WordPress handles:
- Menu open/close toggle
- Focus trapping
- Scroll locking
- ARIA attributes
- Keyboard navigation
- Resize handling

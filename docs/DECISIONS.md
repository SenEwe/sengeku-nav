# Architectural Decisions — Sengeku Nav

## 2026-04-11: CSS-only cannot override WP's open-on-click
**Context:** Twenty Twenty-Four uses WordPress Interactivity API with `open-on-click` mode for submenus. CSS `display:block` on hover is overridden by WP's JS.
**Decision:** Use JS mouseenter/mouseleave to set inline styles that override WP's click handler on desktop.
**Alternatives:** Change WP editor setting to "open on hover" (fragile, user must remember).
**Why:** WP's Interactivity API actively controls `aria-expanded` and display via JS since WP 6.4. CSS cannot win this specificity war.

## 2026-04-11: Accordion submenus instead of drilldown
**Context:** Apple uses slide-down accordion on mobile, not horizontal drilldown.
**Decision:** Tap on parent → children slide down below (accordion). No level switching, no back button.
**Alternatives:** Drilldown navigation (old SenGeKu-Burger plugin approach).
**Why:** Simpler (no state stack), user always sees context, Apple does it this way.

## 2026-04-11: Theme CSS variables instead of hardcoded colors
**Context:** Plugin should adapt to any Block Theme, not just Twenty Twenty-Four's palette.
**Decision:** Use `--wp--preset--color--*` variables mapped to `--sengeku-nav-*` tokens.
**Alternatives:** Hardcoded Apple-dark colors, settings page with color picker.
**Why:** Zero config, works with any theme, dark mode ready (just swap the mapping).

## 2026-04-11: Inject parent URL via render_block filter
**Context:** WP converts parent menu links to `<button>` when children exist (open-on-click). The original href is lost in HTML.
**Decision:** PHP `render_block` filter reads `$block['attrs']['url']` and injects as `data-sengeku-parent-url` attribute.
**Alternatives:** Guess URL from slug, hard-code URLs.
**Why:** Block attributes still contain the URL even after WP converts to button. This is reliable.

## 2026-04-11: Three.js + View Transitions for 3D navigation (planned)
**Context:** User wants floating 3D labels as navigation with smooth page transitions.
**Decision:** Three.js for 3D rendering, View Transitions API for page transitions.
**Alternatives:** Babylon.js (heavier), pure CSS transforms (limited), GSAP only (no real 3D).
**Why:** Three.js is lightweight for text-only 3D. View Transitions API is native browser feature with GPU acceleration and ~70ms overhead.

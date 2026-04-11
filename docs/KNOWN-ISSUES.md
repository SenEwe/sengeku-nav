# Known Issues — Sengeku Nav

## Desktop hover only shows a small bar under menu item
**Status:** open
**Since:** v1.3.0
**Description:** On desktop, hovering over a parent menu item (e.g. "Alltag") only shows a thin line/bar underneath instead of opening the submenu dropdown. The JS mouseenter handler sets inline styles but WP's Interactivity API may be resetting them.
**Workaround:** Click on the menu item to open submenu (WP's default behavior).
**Root Cause:** WP's Interactivity API (`data-wp-on--click="actions.toggleMenuOnClick"`) actively controls the submenu display. Our JS sets `display:block` on mouseenter but WP's reactive system may override it on the next tick. Needs deeper investigation — possibly need to use WP's own Interactivity API store to set the state.

## Parent menu item link dies when children are added
**Status:** workaround
**Since:** WordPress 6.4+ (not our bug)
**Description:** WordPress converts `<a href="/alltag/">` to `<button>` when a menu item gets children in open-on-click mode. The original URL is lost in HTML.
**Workaround:** v1.4.0 injects `data-sengeku-parent-url` via `render_block` filter. JS can create an "Übersicht" link from this. Currently user manually adds parent page as first child item.
**Root Cause:** WordPress Block Navigation design decision. Tracked as enhancement requests: GitHub #65214, #44346.

## Fatal error on live site activation (v2.0.x meta-description upgrade)
**Status:** open
**Since:** v2.0.0 (sengeku-meta-description-manager, not this plugin)
**Description:** Plugin activation fails with fatal error on live hosting. Cannot reproduce in Local with identical plugin set. No debug log available.
**Workaround:** Keep v1.2 + sengeku-schema-auto as separate plugins on live site.
**Root Cause:** Unknown. Possibly hosting-specific (PHP config, mod_security, memory limit). Need WP_DEBUG log from live server to diagnose.

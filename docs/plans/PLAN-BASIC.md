# Architekturrahmenplan: BASIC (Free)

**Plugin:** `sengeku-nav` v1.0.x
**Status:** ✅ Fertig, live auf sen-ge-ku.de
**Repo:** github.com/SenEwe/sengeku-nav (main Branch)
**Ziel:** WordPress.org Veröffentlichung

---

## Was es kann

- Fullwidth Hover-Dropdown-Panel (Desktop)
- Auto-Force Hover-Modus (keine manuelle Einstellung nötig)
- Mobile: Fullscreen Blur-Overlay mit Tap-Accordion
- Theme-Fonts automatisch übernommen
- Theme-Farben via CSS Custom Properties
- Größerer Burger-Button (44x44px, WCAG)
- View Transitions API für Seitenübergänge
- ARIA Accessibility für Screen Reader/Braille
- Parent-URL Preservation (WP's open-on-click Bug)
- Null externe Dependencies (kein jQuery, kein CDN)

## Was es NICHT kann (→ Plus/Pro)

- ❌ Gestaltbarer Panel-Inhalt (nur Link-Liste)
- ❌ Spalten, Bilder, Badges im Dropdown
- ❌ 3D-Effekte
- ❌ Settings-Seite
- ❌ Per-Menüpunkt Konfiguration

## Architektur

```
sengeku-nav/
├── sengeku-nav.php       # PHP: Enqueue, render_block Filter
├── assets/
│   ├── css/nav.css       # CSS: Desktop hover, Mobile overlay
│   └── js/nav.js         # JS: Mobile accordion, ARIA, Panel-Position
├── uninstall.php         # Cleanup
├── readme.txt            # WordPress.org
├── languages/            # i18n
├── docs/                 # Nicht im Release-ZIP
├── scripts/              # Nicht im Release-ZIP
└── poc/                  # Nicht im Release-ZIP
```

## Dateien im Release-ZIP

```
sengeku-nav/
├── sengeku-nav.php
├── assets/css/nav.css
├── assets/js/nav.js
├── uninstall.php
├── readme.txt
└── languages/
```

## Offene Schritte bis WordPress.org

1. [ ] readme.txt erweitern (Screenshots-Beschreibungen, FAQ erweitern)
2. [ ] Screenshots erstellen (Desktop Hover, Mobile Burger, Dropdown)
3. [ ] Icon erstellen (128x128 + 256x256 PNG)
4. [ ] Banner erstellen (772x250 + 1544x500 PNG)
5. [ ] Bei WordPress.org einreichen (https://wordpress.org/plugins/developers/add/)
6. [ ] Review abwarten (~1-2 Wochen)
7. [ ] SVN Setup nach Genehmigung
8. [ ] Testen auf Twenty Twenty-Five (bisher nur TT4 getestet)

## Testing-Matrix

| Theme | Desktop Hover | Mobile Burger | Submenü | Status |
|---|---|---|---|---|
| Twenty Twenty-Four | ✅ | ✅ | ✅ | Getestet |
| Twenty Twenty-Five | ⬜ | ⬜ | ⬜ | Noch testen |
| Twenty Twenty-Three | ⬜ | ⬜ | ⬜ | Noch testen |
| Blockbase | ⬜ | ⬜ | ⬜ | Optional |

## Maintenance-Aufwand

- Minimal: CSS-Anpassungen bei neuen WP-Versionen
- WP Interactivity API könnte sich ändern → render_block Filter prüfen
- Geschätzt: 1-2h pro WordPress Major Release

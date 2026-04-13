# Architekturrahmenplan: PLUS (Gestaltbare Mega-Panels)

**Plugin:** `sengeku-nav` v2.0.x (Upgrade des Basic-Plugins)
**Status:** Geplant
**Repo:** github.com/SenEwe/sengeku-nav (feature/pro-mega-panels Branch)
**Ziel:** Apple-Style Mega-Menu mit gestaltbarem Panel-Inhalt via Block Editor

---

## Vision

Der User öffnet den WordPress Site Editor, klickt auf ein Menü-Panel und **gestaltet den Dropdown-Inhalt wie jede andere Seite** — Spalten, Bilder, Text, Links, Buttons. Wie bei Apple: links die Produktliste, rechts "Neu" Badges und Bilder.

## Was PLUS zusätzlich zu Basic kann

- ✅ Alles aus Basic (Hover, Mobile, Theme-Fonts, etc.)
- ✅ **Template Part pro Menüpunkt** — gestaltbarer Panel-Inhalt
- ✅ **Block Editor Integration** — Drag & Drop im Site Editor
- ✅ **Spalten-Layout** im Panel (2, 3, 4 Spalten)
- ✅ **Bilder, Icons, Badges** im Panel
- ✅ **Settings-Seite** — Panel-Breite, Animation, Farben
- ✅ **Per-Menüpunkt Einstellungen** — welches Template Part anzeigen

## Architektur

```
sengeku-nav/
├── sengeku-nav.php              # Hauptdatei (erweitert Basic)
├── includes/
│   ├── class-mega-panel.php     # Template Part Registration + Rendering
│   ├── class-settings.php       # Settings-Seite
│   └── class-block-extends.php  # Block Editor Sidebar-Erweiterung
├── assets/
│   ├── css/
│   │   ├── nav.css              # Basic CSS (unverändert)
│   │   └── mega-panel.css       # Panel-Layout, Spalten, Animationen
│   ├── js/
│   │   ├── nav.js               # Basic JS (unverändert)
│   │   └── mega-panel.js        # Panel-Hover-Logik, Template Part Loading
│   └── editor/
│       ├── mega-panel-editor.js  # Gutenberg Sidebar Extension
│       └── mega-panel-editor.css # Editor-spezifisches Styling
├── templates/
│   └── mega-panel-default.html  # Default Template Part für neue Panels
├── uninstall.php
├── readme.txt
└── languages/
```

## Kern-Konzept: Template Parts als Panel-Inhalt

### Wie WordPress Template Parts funktionieren

WordPress Block Themes haben "Template-Bereiche" (Header, Footer, Sidebar). Wir registrieren einen neuen Bereich: **"Menü-Panels"**. Der User erstellt pro Menüpunkt ein Template Part im Site Editor.

### Datenfluss

```
1. Plugin registriert Template Part Area "menu-panels"
   └── register_block_template_part_area('menu-panels', 'Menü-Panels')

2. User erstellt Template Parts im Site Editor:
   └── "Panel: Alltag"     → Spalten mit Links + Bild
   └── "Panel: Bewegen"    → Grid mit Kursübersicht
   └── "Panel: Forschung"  → Text + Featured Links

3. Plugin speichert Zuordnung: Menüpunkt → Template Part
   └── wp_option: sengeku_nav_panels = {
         "menu_item_alltag": "panel-alltag",
         "menu_item_bewegen": "panel-bewegen"
       }

4. Frontend: Hover über "Alltag"
   └── CSS zeigt Dropdown-Panel
   └── PHP rendert Template Part "panel-alltag" im Panel
   └── User sieht gestalteten Inhalt
```

### Registrierung der Template Part Area

```php
// In class-mega-panel.php
function sengeku_register_panel_area() {
    register_block_template_part_area('menu-panels', [
        'label' => __('Menü-Panels', 'sengeku-nav'),
        'icon'  => 'menu',
    ]);
}
```

### Panel im Frontend rendern

```php
// Im render_block Filter
function render_mega_panel($block_content, $block) {
    if ($block['blockName'] !== 'core/navigation-submenu') return $block_content;

    $menu_label = $block['attrs']['label'] ?? '';
    $panel_slug = sengeku_get_panel_for_menu($menu_label);

    if ($panel_slug) {
        // Ersetze die einfache Link-Liste mit dem Template Part
        $panel_html = block_template_part($panel_slug);
        $block_content = str_replace(
            '<ul class="wp-block-navigation__submenu-container',
            '<div class="sengeku-mega-panel">' . $panel_html . '</div><ul style="display:none" class="wp-block-navigation__submenu-container',
            $block_content
        );
    }

    return $block_content;
}
```

## Implementierungsschritte

### Phase 1: Template Part Infrastructure (2-3 Tage)
1. [ ] Template Part Area "menu-panels" registrieren
2. [ ] Default Template Part erstellen (2-Spalten-Layout)
3. [ ] Zuordnung Menüpunkt → Template Part (wp_option)
4. [ ] Frontend-Rendering: Template Part statt Link-Liste
5. [ ] CSS für Panel-Layout (Spalten, Bilder, responsive)

### Phase 2: Block Editor Integration (2-3 Tage)
6. [ ] Gutenberg Sidebar Panel: "Mega Panel auswählen"
7. [ ] Dropdown im Editor: vorhandene Template Parts auflisten
8. [ ] "Neues Panel erstellen" Button → öffnet Site Editor
9. [ ] Live-Preview im Editor (optional, komplex)

### Phase 3: Settings + Polish (1-2 Tage)
10. [ ] Settings-Seite: Panel-Breite (full/wide/content)
11. [ ] Settings: Animation (fade/slide/none)
12. [ ] Settings: Hover-Delay
13. [ ] Mobile: Panel-Inhalt als erweitertes Accordion
14. [ ] Fallback: Wenn kein Template Part → Basic Link-Liste

### Phase 4: Testing (1-2 Tage)
15. [ ] Testen auf TT4, TT5, TT3
16. [ ] Mobile-Test auf iPhone/Android
17. [ ] Accessibility-Audit (Screen Reader mit Panel-Inhalt)
18. [ ] Performance-Test (Template Part Rendering Speed)
19. [ ] Plugin Check bestehen

### Geschätzter Gesamtaufwand: 7-10 Tage

## User-Workflow (so einfach wie möglich)

### Ersteinrichtung (einmalig):
1. Plugin installieren → Basic funktioniert sofort
2. Design → Site Editor → Template-Bereiche → "Menü-Panels"
3. "Neues Template Part" → Name: "Panel: Alltag"
4. Inhalt gestalten: Spalten-Block → Links, Bilder, Text
5. Speichern

### Panel einem Menüpunkt zuweisen:
1. Design → Site Editor → Header → Navigation
2. Auf "Alltag" klicken → Sidebar: "Mega Panel" Dropdown
3. "Panel: Alltag" auswählen
4. Speichern → Hover zeigt gestaltetes Panel

### Oder noch einfacher (Settings-Seite):
1. Settings → Sengeku Nav
2. Tabelle: Menüpunkt | Panel | [Auswählen]
3. Fertig

## Kompatibilität mit Basic

- Basic-Features bleiben **komplett erhalten**
- Wenn kein Template Part zugewiesen → Basic Link-Liste (Fallback)
- Upgrade Basic → Plus: **keine Daten verloren**
- Downgrade Plus → Basic: Panels verschwinden, Links bleiben

## Geschäftsmodell

| Variante | Preis |
|---|---|
| Basic (WP.org) | Kostenlos |
| Plus | Einmalzahlung oder Jahresabo? |

**Empfehlung:** Freemium — Basic kostenlos auf WP.org, Plus als ZIP-Download von eigener Website oder CodeCanyon/Gumroad.

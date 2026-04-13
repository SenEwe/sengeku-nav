# Architekturrahmenplan: PRO (Flash 2026 — 3D + Babyeinfach-Editor)

**Plugin:** `sengeku-3d` (eigenes Plugin, eigenes Repo)
**Status:** Vision, Briefing erstellt
**Repo:** Noch nicht angelegt (wird: github.com/SenEwe/sengeku-3d)
**Ziel:** Die ganze WordPress-Seite wird zur interaktiven 3D-Erfahrung — steuerbar über einen Mal-Editor im WP Customizer

---

## Vision

Der User "malt" 3D-Effekte auf seine WordPress-Seite — wie in Procreate oder Instagram Stories. Keine Code-Kenntnisse, kein Blender, kein Node-Editor. Finger/Maus über die Live-Seite ziehen → leuchtende 3D-Linie. Auf einen Block klicken → "Schweben" auswählen → fertig.

## Warum eigenes Plugin?

| Aspekt | sengeku-nav (Basic/Plus) | sengeku-3d (Pro) |
|---|---|---|
| Technologie | CSS + minimales JS | Three.js + WebGPU |
| Scope | Nur Navigation | Ganze Seite |
| Komplexität | ~500 Zeilen | ~5.000+ Zeilen |
| Dependencies | Keine | Three.js (~180KB) |
| Performance-Impact | Null | GPU-intensiv |
| Zielgruppe | Jeder WP User | Designer, Kreative |
| WP.org tauglich | ✅ | ❌ (externes JS) |

**Fazit:** Zu unterschiedlich für ein Plugin. Pro ist ein eigenes Produkt.

## Architektur

```
sengeku-3d/
├── sengeku-3d.php                    # Plugin Hauptdatei
├── includes/
│   ├── class-canvas-layer.php        # Three.js Fullscreen Canvas Management
│   ├── class-scene-renderer.php      # Scene-Daten → Three.js Scene
│   ├── class-editor.php              # WP Customizer Mal-Editor
│   ├── class-settings.php            # Admin Settings
│   ├── class-block-effects.php       # Per-Block 3D-Effekte
│   └── class-data-store.php          # JSON Speicherung pro Seite
├── assets/
│   ├── vendor/
│   │   └── three.min.js              # Three.js (lokal, kein CDN)
│   ├── css/
│   │   ├── canvas-layer.css          # Fullscreen Canvas Styling
│   │   ├── editor.css                # Mal-Editor UI
│   │   └── effects.css               # Block-Effekte (CSS 3D Fallback)
│   ├── js/
│   │   ├── canvas-layer.js           # Three.js Scene Setup + Render Loop
│   │   ├── spline-renderer.js        # Gemalte Linien → 3D Splines
│   │   ├── particle-system.js        # Partikel-Effekte
│   │   ├── block-effects.js          # DOM-Elemente → 3D Animationen
│   │   ├── dom-to-texture.js         # HTML → Three.js Texture Pipeline
│   │   └── view-transitions.js       # Seitenübergang-Effekte
│   └── editor/
│       ├── paint-mode.js             # Mal-Werkzeug im Customizer
│       ├── effect-picker.js          # Block-Effekt-Auswahl
│       ├── particle-placer.js        # Partikel-Quellen platzieren
│       └── toolbar.js                # Editor-Toolbar UI
├── templates/
│   └── canvas-overlay.php            # Fullscreen Canvas HTML
├── uninstall.php
├── readme.txt
└── languages/
```

## Die vier Technologie-Schichten

### Schicht 1: Three.js Canvas Layer
```
┌─────────────────────────────────────────────┐
│ Three.js Canvas (position: fixed, z-index)   │ ← Transparent über der Seite
│   ├── Splines (gemalte Linien)               │
│   ├── Partikel                               │
│   ├── Block-Effekte (DOM-to-Texture)         │
│   └── Licht + Kamera (scroll-gesteuert)      │
├─────────────────────────────────────────────┤
│ WordPress HTML/CSS (darunter, unverändert)    │ ← Bleibt intakt
│   ├── Header, Nav (sengeku-nav Basic/Plus)   │
│   ├── Content Blocks                         │
│   └── Footer                                │
└─────────────────────────────────────────────┘
```

- Canvas ist `position: fixed`, `pointer-events: none`
- User kann durch den Canvas hindurch mit der Seite interagieren
- 3D-Elemente reagieren auf Scroll-Position
- Fallback: Ohne WebGL → normale WP-Seite

### Schicht 2: Babyeinfach-Editor (im WP Customizer)

```
WP Customizer (Design → Anpassen)
    ↓
Plugin injiziert "3D Malen" Button in die Toolbar
    ↓
User klickt → Mal-Modus aktiv
    ↓
Drei Werkzeuge:
├── 🖌 Linie malen → wird zu 3D-Spline
├── ✨ Partikel platzieren → Klick auf Stelle
└── 🎯 Block-Effekt → Klick auf Block → Dropdown
    ↓
Jede Aktion = sofort sichtbar in der Live-Vorschau
    ↓
"Speichern" → JSON wird in wp_postmeta gespeichert
```

### Schicht 3: Daten-Speicherung

```json
// wp_postmeta key: _sengeku_3d_scene
// Gespeichert PRO SEITE (jede Seite kann andere 3D-Effekte haben)
{
    "version": "1.0",
    "splines": [
        {
            "id": "spline_1",
            "points": [[10, 50], [200, 80], [400, 30]],
            "style": {
                "thickness": 0.03,
                "color": "#D6D2CE",
                "glow": 0.5,
                "depth": 0.3,
                "animation": "pulse"
            }
        }
    ],
    "particles": [
        {
            "id": "particles_1",
            "position": [300, 200],
            "style": {
                "count": 30,
                "size": 0.02,
                "speed": 0.1,
                "color": "#958D86"
            }
        }
    ],
    "block_effects": [
        {
            "block_selector": ".wp-block-heading:nth-of-type(2)",
            "effect": "float",
            "intensity": 0.5,
            "trigger": "scroll-enter"
        }
    ],
    "global": {
        "fog": true,
        "fog_density": 0.02,
        "ambient_particles": true,
        "camera_follow_scroll": true
    }
}
```

### Schicht 4: WP Dashboard Steuerung

```
Settings → Sengeku 3D
├── Globale Einstellungen
│   ├── 3D Modus: [●] Aktiv [○] Nur Hover [○] Aus
│   ├── Intensität: ──●── [70%]
│   ├── Partikel: [✓] Aktiv
│   └── Performance: [✓] Mobile reduziert
│
├── Seiten-Übersicht
│   ├── Startseite: 2 Splines, 1 Partikel-Quelle [Bearbeiten]
│   ├── Bewegen: 0 Effekte [Bearbeiten]
│   └── Forschung: 3 Block-Effekte [Bearbeiten]
│
└── Vorlagen
    ├── "Nebel-Atmosphäre" [Anwenden]
    ├── "Sternenhimmel" [Anwenden]
    └── "Minimal" [Anwenden]
```

## Implementierungsschritte

### Phase 1: Foundation (3-4 Tage)
1. [ ] Neues Repo `sengeku-3d` anlegen
2. [ ] Plugin-Grundstruktur (PHP, CSS, JS Skeleton)
3. [ ] Three.js Canvas als transparenter Fullscreen-Layer
4. [ ] Canvas reagiert auf Scroll (Kamera-Position)
5. [ ] Theme-Farben → Three.js Material-Colors
6. [ ] Performance: RAF-Throttling, Visibility API
7. [ ] Mobile-Detection: Reduzierte Effekte
8. [ ] `prefers-reduced-motion`: Alles aus
9. [ ] Fallback: Ohne WebGL → nur CSS
10. [ ] Settings-Seite Grundgerüst

### Phase 2: Mal-Editor (4-5 Tage)
11. [ ] WP Customizer Hook: "3D Malen" Button
12. [ ] Mal-Werkzeug: Pointer Events → Punkte sammeln
13. [ ] Punkte glätten (Chaikin-Algorithmus)
14. [ ] Punkte → Three.js CatmullRomCurve3 → TubeGeometry
15. [ ] Live-Preview: Linie sofort sichtbar
16. [ ] Linie bearbeiten: Drag Punkte, Farbe, Dicke
17. [ ] Linie löschen
18. [ ] Partikel-Werkzeug: Klick → Quelle platzieren
19. [ ] Block-Effekt-Werkzeug: Klick auf Block → Dropdown
20. [ ] "Speichern" → JSON in wp_postmeta
21. [ ] "Verwerfen" → Änderungen zurücksetzen

### Phase 3: Effekte (3-4 Tage)
22. [ ] Spline-Rendering: Glow, Puls-Animation
23. [ ] Partikel-System: Konfigurierbar (Dichte, Größe, Farbe)
24. [ ] Block-Effekt "Schweben": Y-Offset + sanfte Bewegung
25. [ ] Block-Effekt "Falten": CSS 3D Transform bei Scroll
26. [ ] Block-Effekt "Leuchten": Emissive Glow hinter Block
27. [ ] Bilder als 3D-Planes mit Parallax-Tiefe
28. [ ] View Transitions: Spline-basierte Übergänge zwischen Seiten

### Phase 4: Content als 3D (3-4 Tage)
29. [ ] DOM-to-Texture Pipeline (html2canvas → Three.js Texture)
30. [ ] Content-Blocks als 3D-Karten
31. [ ] Falt-Animation beim Seitenwechsel
32. [ ] Details/Accordion → 3D-Falteffekt
33. [ ] Cover-Blocks → Immersive 3D-Hintergründe

### Phase 5: Polish + Vorlagen (2-3 Tage)
34. [ ] Vorlagen-System: JSON-Presets laden
35. [ ] 3-5 Standard-Vorlagen (Nebel, Sterne, Minimal, Energetisch, Zen)
36. [ ] Mobile-Optimierung (Touch im Editor, Performance)
37. [ ] Accessibility-Audit
38. [ ] Plugin Check (wird nicht WP.org-tauglich sein wegen Three.js)

### Geschätzter Gesamtaufwand: 15-20 Tage

## Abhängigkeiten

```
sengeku-3d (Pro)
├── Funktioniert standalone
├── OPTIONAL: sengeku-nav (Basic/Plus) für Navigation
└── OPTIONAL: sengeku-meta-description-manager für SEO
```

Pro ist **komplett unabhängig** — braucht keine anderen Sengeku-Plugins. Aber wenn sengeku-nav installiert ist, können die 3D-Splines als Navigationspfade genutzt werden.

## Distribution

| Kanal | Möglich? |
|---|---|
| WordPress.org | ❌ (Three.js als externe Lib, auch wenn lokal) |
| Eigene Website | ✅ (ZIP Download) |
| Gumroad | ✅ |
| CodeCanyon | ✅ |
| GitHub Releases | ✅ (Open Source möglich) |

## Technische Risiken

| Risiko | Wahrscheinlichkeit | Mitigation |
|---|---|---|
| DOM-to-Texture langsam | Mittel | Einmal cachen, nur bei Resize neu |
| Mobile GPU Limits | Hoch | LOD, FPS-Monitor, Auto-Downgrade |
| Customizer API limitiert | Mittel | Eigenes Panel statt native Controls |
| Three.js Updates | Niedrig | Version pinnen, selten updaten |
| WP Block Editor Änderungen | Mittel | Block Hooks statt DOM-Manipulation |

## Coding-Team Empfehlung

| Aufgabe | Wer |
|---|---|
| Three.js Canvas + Rendering | Lokales LLM (Qwen) + Claude Review |
| Mal-Editor (Customizer) | Claude |
| WP Plugin-Struktur | Claude |
| Effekte (Splines, Partikel) | Lokales LLM + Claude Review |
| DOM-to-Texture | Recherche + Claude |
| Settings + Admin UI | Claude |
| Testing | Local WP + iPhone |

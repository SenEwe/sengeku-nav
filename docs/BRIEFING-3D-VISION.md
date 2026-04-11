# BRIEFING: Flash 2026 — Die Komplette 3D-WordPress-Vision

## Was wir bauen

Eine WordPress-Seite die sich anfühlt wie eine **Flash-Site aus 2006** — aber mit 2026-Technologie: nativ im Browser, auf jedem Gerät, SEO-optimiert, barrierefrei, steuerbar über das WP-Dashboard.

**Kein Plugin das "ein bisschen aufhübscht"** — sondern ein System das die **gesamte Seite** schrittweise in eine interaktive 3D-Erfahrung verwandeln kann.

## Die Vision in Stufen

### Stufe 1: Foundation Layer (Three.js Canvas über WordPress)
- Transparenter Three.js Canvas liegt über der gesamten Seite
- WordPress HTML/CSS bleibt intakt darunter
- 3D-Effekte werden als Enhancement drübergelegt
- Fallback: Ohne WebGL sieht man die normale WP-Seite

### Stufe 2: Navigation als 3D-Erlebnis
- Menüpunkte werden vom Canvas "übernommen" — 3D-Hover, Glow, Tiefe
- SVG-Separator werden zu 3D-Splines (leuchtende Linien im Raum)
- Menüpunkte können entlang der Splines angeordnet werden
- View Transitions API für cineastische Seitenübergänge
- Klick auf "Bewegen" → Seite faltet sich, neue Seite entfaltet sich

### Stufe 3: Content-Blöcke in 3D
- WordPress-Blöcke (Texte, Bilder, Zitate) werden als 3D-Karten gerendert
- Scroll → Karten kippen, drehen, schweben rein
- Bilder bekommen Parallax-Tiefe als 3D-Planes
- Cover-Blöcke werden zu immersiven 3D-Räumen
- Details/Accordion → 3D-Falteffekt beim Öffnen

### Stufe 4: Volle Immersion
- Ganze Seitenabschnitte als begehbare 3D-Szenen
- Background-Videos/Fotos als Skybox
- Partikel-Systeme für Atmosphäre (Nebel, Lichtpunkte)
- Sound-Design (optional, user-triggered)
- WebXR-Ready für VR-Brillen

## Technischer Stack

### Core
| Technologie | Wofür |
|---|---|
| **Three.js** | 3D-Rendering, Geometrie, Materials, Lighting |
| **WebGPU** (mit WebGL2 Fallback) | GPU-beschleunigtes Rendering |
| **View Transitions API** | Seitenübergänge |
| **GSAP ScrollTrigger** | Scroll-gesteuerte 3D-Animationen |
| **html2canvas / DOM-to-Texture** | WordPress-Content als 3D-Textur |

### WordPress-Integration
| Komponente | Wofür |
|---|---|
| **Custom Plugin** | Lädt Three.js, steuert 3D-Layer |
| **Settings Page** | Globale 3D-Einstellungen (Intensität, Partikel, Farben) |
| **Custom Block Attributes** | Pro-Block 3D-Einstellungen (Falteffekt ja/nein, Tiefe, Animation) |
| **WP Customizer** | Live-Preview der 3D-Effekte |
| **Theme CSS Variables** | Farben, Fonts → Three.js Materials |

### Performance & Accessibility
| Aspekt | Lösung |
|---|---|
| **Mobile Performance** | Reduzierte Partikel, einfachere Geometrie, LOD |
| **Battery** | `requestAnimationFrame` nur wenn sichtbar, kein Rendering im Hintergrund |
| **Screen Reader** | 3D ist Enhancement, HTML bleibt lesbar darunter |
| **prefers-reduced-motion** | Alle Animationen aus, normale WP-Seite |
| **SEO** | Bot-Erkennung → kein 3D, nur HTML (bereits implementiert in sengeku-schema-auto) |
| **Offline/Slow** | Three.js lädt async, Seite funktioniert ohne |

## Architektur

```
┌────────────────────────────────────────────────┐
│           Three.js Canvas (fullscreen)          │
│  ┌──────────────────────────────────────────┐  │
│  │  3D Scene                                 │  │
│  │  ├── Navigation Splines + Labels          │  │
│  │  ├── Content Cards (DOM-to-Texture)       │  │
│  │  ├── Particle Systems                     │  │
│  │  ├── Lighting (dynamic, scroll-driven)    │  │
│  │  └── Camera (scroll-controlled)           │  │
│  └──────────────────────────────────────────┘  │
├────────────────────────────────────────────────┤
│           WordPress HTML (underneath)           │
│  ┌──────────────────────────────────────────┐  │
│  │  Header (Logo, Branding)                  │  │
│  │  Navigation (WP Block Nav — hidden when   │  │
│  │              3D is active)                 │  │
│  │  Content Blocks                           │  │
│  │  Footer                                   │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

## SVG → 3D Spline Pipeline

```
WordPress Separator Block
    ↓
SVG <path d="M0,0 C10,20 30,20 40,0"> (oder Custom SVG Block)
    ↓
JS parst SVG path data
    ↓
Three.js CatmullRomCurve3 (2D → 3D, z-Tiefe hinzu)
    ↓
TubeGeometry oder Line2 mit Glow-Material
    ↓
Menüpunkte als Labels an Curve-Punkten positioniert
    ↓
Animation: Punkte gleiten entlang der Spline
```

## DOM → 3D Texture Pipeline (Content-Faltung)

```
WordPress Block (z.B. wp-block-group)
    ↓
html2canvas rendert Block als Canvas/Image
    ↓
Three.js CanvasTexture
    ↓
Mapped auf PlaneGeometry (oder gebogene Fläche)
    ↓
Plane kann falten, drehen, wegfliegen bei Navigation
    ↓
View Transition → neue Seite → neue Texture → entfalten
```

## WP Dashboard Steuerung

### Settings Page: "Sengeku 3D"
```
┌─ 3D Einstellungen ────────────────────────────┐
│                                                │
│ 3D Modus:  [●] Aktiv  [○] Nur Hover  [○] Aus │
│                                                │
│ Intensität: ──────●────── [70%]                │
│                                                │
│ Partikel:  [✓] Aktiv    Dichte: ──●── [40%]   │
│                                                │
│ Navigation: [●] 3D Spline  [○] Floating Labels │
│             [○] CSS 3D     [○] Standard        │
│                                                │
│ Seitenübergänge:                               │
│   [✓] View Transitions                         │
│   [✓] Falt-Effekt                              │
│   Dauer: [0.5] Sekunden                        │
│                                                │
│ Performance:                                   │
│   [✓] Mobile: reduzierte Effekte               │
│   [✓] Battery Saver: kein Background-Rendering │
│   [✓] prefers-reduced-motion respektieren      │
│                                                │
└────────────────────────────────────────────────┘
```

### Pro-Block Einstellungen (im Editor)
```
┌─ 3D Effekte ──────────────────┐
│                                │
│ Eingangs-Animation:            │
│   [Falten] [Schweben] [Keine]  │
│                                │
│ Scroll-Verhalten:              │
│   [Parallax] [Kippen] [Keine]  │
│                                │
│ Tiefe: ──────●────── [0.5]     │
│                                │
└────────────────────────────────┘
```

## Entwicklungsplan

### Phase 1: Foundation (2-3 Tage)
- [ ] Three.js Fullscreen Canvas als transparenter Layer
- [ ] Liest WP Theme-Farben als Material-Colors
- [ ] Partikel-System (konfigurierbar)
- [ ] Settings Page im WP-Dashboard
- [ ] Performance: RAF-Throttling, Visibility API, Mobile-Detection

### Phase 2: Navigation (2-3 Tage)
- [ ] WP-Menü als 3D-Labels auf Canvas
- [ ] SVG-Separator → 3D-Splines
- [ ] Hover: Glow + Tiefeneffekt
- [ ] Klick: View Transition mit Falt-Animation
- [ ] Submenü-Handling

### Phase 3: Content Enhancement (3-5 Tage)
- [ ] DOM-to-Texture Pipeline
- [ ] Block-spezifische 3D-Animationen
- [ ] Scroll-gesteuerte Kamera/Licht-Änderungen
- [ ] Bilder als 3D-Planes mit Parallax-Tiefe
- [ ] Details/Accordion → 3D-Falteffekt

### Phase 4: Polish (2-3 Tage)
- [ ] Mobile-Optimierung (Touch, Performance, Battery)
- [ ] Accessibility-Audit
- [ ] Dashboard-Controls feintunen
- [ ] Cross-Browser Testing
- [ ] Dokumentation

### Geschätzter Gesamtaufwand: 10-15 Tage

## Referenzen / Inspiration

- **Apple.com** — Scroll-gesteuerte 3D-Produktanimationen
- **Zenith Watches Lupin III** — Produkt-Explosion im Scroll
- **Active Theory** — Komplette 3D-Website-Erlebnisse
- **Awwwards 3D Kategorie** — Tägliche Inspiration
- **Flash-Ära (2000-2010)** — Die Freiheit des Mediums, modernisiert

## Technische Risiken

| Risiko | Mitigation |
|---|---|
| DOM-to-Texture Performance | Einmal cachen, nur bei Resize neu rendern |
| Mobile GPU Limits | LOD-System, Partikel reduzieren, FPS-Monitor |
| WebGPU Browser Support | WebGL2 Fallback (funktioniert überall) |
| SEO Impact | Bot-Erkennung (bereits gelöst), HTML bleibt unter Canvas |
| WP Block Editor Kompatibilität | Custom Attributes, keine Block-Modifikation |

## User-Bedienung: BABYEINFACH

### Designprinzip
**Kein Coding. Kein Fachwissen. Einfach malen.**

Der User soll 3D-Effekte auf seiner Seite erstellen wie er in Paint/Keynote eine Linie zieht — intuitiv, direkt, sofort sichtbar.

### Der Editor: "3D Canvas" im WordPress Customizer

Der WordPress Customizer (Design → Anpassen) zeigt die Live-Seite. Darüber legen wir einen **Mal-Modus**:

```
┌─────────────────────────────────────────┐
│ [🎨 3D Malen]  [✋ Bewegen]  [🗑 Löschen] │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │    Live WordPress Seite            │  │
│  │                                    │  │
│  │    User malt mit dem Finger/Maus   │  │
│  │    eine Linie quer über die Seite  │  │
│  │    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~    │  │
│  │                                    │  │
│  │    → Linie wird sofort zu einer    │  │
│  │      leuchtenden 3D-Spline         │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│ Dicke: ──●──  Farbe: [■]  Glow: ──●──  │
│ Tiefe: ──●──  Animation: [Pulsieren ▾]  │
│                                          │
│           [Speichern]  [Verwerfen]       │
└─────────────────────────────────────────┘
```

### Was der User kann (ohne irgendwas zu wissen):

**Linien malen:**
- Finger/Maus drücken → über die Seite ziehen → loslassen
- Die Linie wird sofort zu einer leuchtenden 3D-Spline
- Schieberegler für Dicke, Glow, Farbe, Tiefe
- Fertig. Kein "definiere Kontrollpunkte", kein "wähle Kurventyp"

**Effekte auf Blöcke:**
- Auf einen Textblock klicken → Dropdown erscheint: "Schweben", "Falten", "Leuchten"
- Ein Klick → Effekt aktiv → sofort in der Vorschau sichtbar
- Intensitäts-Slider → mehr oder weniger
- Fertig.

**Navigation-Pfad malen:**
- Im Mal-Modus eine Linie von Menüpunkt zu Menüpunkt zeichnen
- Die Menüpunkte "docken" automatisch an die Linie an
- Die Linie wird zur 3D-Spline-Navigation
- Hover über die Linie → nächster Menüpunkt leuchtet auf

**Partikel streuen:**
- Auf eine Stelle klicken → Partikel-Quelle platziert
- Schieberegler: Dichte, Größe, Geschwindigkeit
- Wie "Glitzer draufstreuen" — ein Klick, ein Slider, fertig

### Technische Umsetzung des "Mal-Modus"

```
User malt (Pointer Events)
    ↓
JavaScript sammelt Punkte [{x, y}, {x, y}, ...]
    ↓
Punkte werden geglättet (Chaikin-Algorithmus oder ähnlich)
    ↓
Punkte werden zu Three.js CatmullRomCurve3
    ↓
Live-Preview: Sofort als leuchtende Spline sichtbar
    ↓
"Speichern" → Punkte werden als JSON in wp_options gespeichert
    ↓
Frontend: Plugin lädt JSON → rendert Splines
```

### Daten-Speicherung

```json
{
  "page_id": 42,
  "elements": [
    {
      "type": "spline",
      "points": [[10, 50], [200, 80], [400, 30], [600, 90]],
      "style": {
        "thickness": 0.03,
        "color": "#D6D2CE",
        "glow": 0.5,
        "depth": 0.3,
        "animation": "pulse"
      }
    },
    {
      "type": "particle_source",
      "position": [300, 200],
      "style": {
        "count": 30,
        "size": 0.02,
        "speed": 0.1,
        "color": "#958D86"
      }
    },
    {
      "type": "block_effect",
      "block_selector": ".wp-block-heading:nth-child(2)",
      "effect": "float",
      "intensity": 0.5
    }
  ]
}
```

### Vorbilder für "Babyeinfach"

| Tool | Was es richtig macht |
|---|---|
| **Keynote Magic Move** | Zwei Folien, Keynote animiert dazwischen — kein Keyframe-Wissen nötig |
| **Instagram Stories** | Sticker draufziehen, Größe mit Pinch, fertig |
| **Canva** | Drag & Drop Design ohne Photoshop-Wissen |
| **Procreate** | Einfach malen, Pinsel wählen, loslegen |
| **Apple Freeform** | Freihand zeichnen, wird automatisch geglättet |

### Was wir NICHT bauen

- ❌ Keinen Node-basierten Editor (zu technisch)
- ❌ Kein Blender-Import (zu komplex)
- ❌ Keine Code-Eingabe (kein User schreibt JSON)
- ❌ Keine "definiere Kontrollpunkte" UI (zu abstrakt)
- ❌ Kein separates Tool (alles im WP-Dashboard)

## Coding-Team

| Rolle | Wer |
|---|---|
| **Architektur + Orchestrierung** | Claude |
| **Three.js Implementation** | Lokales LLM (Qwen 2.5 Coder) + Claude Review |
| **WP Plugin/Settings** | Claude |
| **CSS/Animation** | Claude + GSAP |
| **Testing** | Local WP + iPhone |
| **Code Review** | Codex (run_buddy.sh) |

---

**Das ist Flash 2026.** Nativ, performant, barrierefrei, SEO-freundlich. Und steuerbar über das WordPress-Dashboard das jeder kennt.

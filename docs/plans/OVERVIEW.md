# Produkt-Übersicht: Sengeku Navigation Suite

## Drei Produkte, ein Ökosystem

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  BASIC (Free)          PLUS                 PRO          │
│  sengeku-nav           sengeku-nav          sengeku-3d   │
│  v1.0.x                v2.0.x               v1.0.x       │
│                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ Fullwidth │    │ Gestaltbare  │    │ 3D Canvas    │   │
│  │ Hover     │    │ Mega-Panels  │    │ über WP      │   │
│  │ Dropdown  │ +  │ Template     │ +  │ Mal-Editor   │   │
│  │ Mobile    │    │ Parts im     │    │ Splines      │   │
│  │ Blur      │    │ Block Editor │    │ Partikel     │   │
│  │ Accordion │    │ Settings     │    │ Block-FX     │   │
│  └──────────┘    └──────────────┘    └──────────────┘   │
│                                                          │
│  Gleicher         Upgrade auf           Eigenes          │
│  Codebase         gleichem Plugin       Plugin           │
│                                                          │
│  WordPress.org    Eigene Website        Eigene Website   │
│  Kostenlos        Bezahlt               Bezahlt          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Projekt-Struktur

```
WP-Plugins/
├── sengeku-nav/                    # Basic + Plus (ein Repo)
│   ├── main Branch                 # Basic (v1.0.x) — WP.org Release
│   ├── feature/pro-mega-panels     # Plus (v2.0.x) — in Entwicklung
│   ├── feature/3d-navigation       # Prototypen/PoCs
│   └── docs/plans/                 # Diese Pläne
│
└── sengeku-3d/                     # Pro (eigenes Repo, noch nicht angelegt)
    ├── main Branch                 # Stable Release
    └── develop Branch              # Entwicklung
```

## Aufwand und Reihenfolge

| Produkt | Aufwand | Abhängigkeit | Status |
|---|---|---|---|
| **Basic** | ✅ Fertig | Keine | Live auf sen-ge-ku.de |
| **Plus** | 7-10 Tage | Basic als Basis | Branch existiert |
| **Pro** | 15-20 Tage | Standalone (optional: Basic/Plus) | Briefing fertig |

## Empfohlene Reihenfolge

```
Jetzt:     Basic → WordPress.org einreichen
            ↓
Nächstes:  Plus → Template Parts, Settings, Editor-Integration
            ↓
Danach:    Pro → Three.js, Mal-Editor, 3D-Effekte
```

## Gemeinsame Ressourcen

| Resource | Genutzt von |
|---|---|
| CSS Custom Properties (Theme-Farben) | Basic, Plus, Pro |
| render_block Filter | Basic, Plus |
| WP Customizer API | Pro |
| View Transitions API | Basic, Plus, Pro |
| ARIA Accessibility | Basic, Plus, Pro |
| scripts/test.sh | Basic, Plus |
| scripts/deploy-local.sh | Basic, Plus |
| Local WP (gluecklich.local) | Alle |

## Revenue-Modell

| Produkt | Preis | Kanal |
|---|---|---|
| Basic | Kostenlos | WordPress.org |
| Plus | ~29€ einmalig oder 19€/Jahr | Eigene Website, Gumroad |
| Pro | ~79€ einmalig oder 49€/Jahr | Eigene Website, Gumroad |
| Bundle (Plus + Pro) | ~89€ einmalig | Eigene Website |

## Upgrade-Hinweise: Dezent, nicht aufdringlich

### Prinzip
Die Free-Version ist **vollständig** — sie löst das WP-Menü-Problem komplett.
Plus/Pro fügen Features **hinzu**, sie schalten nichts frei.
Kein Feature in Basic ist beschnitten oder gesperrt.

### Wo Upgrade-Hinweise erscheinen
- **Settings-Seite** (nur Basic): Kleine Box unten
  "Bilder und Spalten im Dropdown? → Sengeku Nav Plus"
- **Plugin-Liste**: Dezenter Link neben Version
  "Sengeku Nav 1.0.3 | Plus verfügbar"
- **Nach Aktivierung** (einmalig): Admin Notice
  "Sengeku Nav aktiv! Tipp: Mit Plus kannst du die Dropdowns frei gestalten. → Mehr erfahren"

### Wo KEINE Hinweise erscheinen
- ❌ Nicht im Frontend (User sehen nichts)
- ❌ Nicht im Editor (stört beim Arbeiten)
- ❌ Nicht als Popup/Modal (nervig)
- ❌ Nicht als wiederkehrende Notices (wie Spam)
- ❌ Keine "🔒 Gesperrt" Labels (manipulativ)

### Vorbild
Wie `sengeku-meta-description-manager` — v1.2 auf WP.org ist vollständig, macht was es soll, keine Werbung. Das Upgrade auf v2.0 kommt automatisch als Update.

## Nächste konkrete Schritte

### Diese Woche:
1. [ ] Basic: Screenshots + Icon erstellen
2. [ ] Basic: Bei WordPress.org einreichen
3. [ ] Plus: Branch `feature/pro-mega-panels` aktivieren
4. [ ] Plus: Template Part Area registrieren (Proof of Concept)

### Nächste Woche:
5. [ ] Plus: Phase 1 (Template Part Infrastructure)
6. [ ] Plus: Phase 2 (Editor Integration)
7. [ ] Pro: Repo anlegen
8. [ ] Pro: Lokaler LLM-Buddy aufsetzen (OpenWebUI + RAG)

### Monat 1:
9. [ ] Plus: Fertigstellen + Testen
10. [ ] Pro: Phase 1 (Foundation) + Phase 2 (Mal-Editor)
11. [ ] Basic: WordPress.org Review abschließen

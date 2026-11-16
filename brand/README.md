# kindpeopleonly – Brand v1

Stand 2026-11-16 (v1.4: KPO-Untertitel in Versalien mit Gewichtswechsel pro Buchstabe, Schatten statt Box). Gilt für Website, Admin, Team-App, Flyer, Posts und Videos.
Bei Abweichungen gilt diese Datei. Ändern: Werte hier und in `tokens.css` / `tokens.json` anpassen,
Boards neu rendern (`sh brand/src/render.sh`).

| Board | Inhalt |
|---|---|
| [01-farben.png](boards/01-farben.png) | Palette, neutrale Skala, Verhältnis, Status |
| [02-schrift.png](boards/02-schrift.png) | Logo, Bastardo Rounded, Größen, Poster-Typo |
| [03-ui.png](boards/03-ui.png) | Buttons, Labels, Karten, Kennzahl, Radien, Abstände, Effekte |
| [04-flyer-fotos.png](boards/04-flyer-fotos.png) | Aufbau Event-Flyer, Hintergründe, Fotostil |
| [05-video.png](boards/05-video.png) | Opener, Untertitel, Endcard, Schnitt und Look |

## Haltung

House-Musik-Kollektiv aus Karlsruhe. Echte Nächte, nette Leute, keine Pose.
Dunkel und ruhig, ein lauter Akzent in Rot. Alles minimal und klar.

## Farben

| Name | Hex | Wofür |
|---|---|---|
| KPO-Rot | `#FF3B3B` | Akzent: Datum-Box, Stadt-Label, Ticket-Button, Highlights |
| Rot-Tinte | `#190808` | Text auf Rot |
| Rotes Licht | `#B3201F` | nur in Fotos/Video als Licht, nie als UI-Fläche |
| Tiefschwarz | `#0A0A0A` | Video, Flyer |
| Nacht | `#121212` | Hintergrund UI |
| Fläche | `#1C1C1C` | Karten |
| Fläche 2 | `#252525` | aktive Flächen, Hover |
| Linie | `#2A2A2A` | Haarlinien |
| Schwach | `#757575` | Hinweise |
| Gedämpft | `#A6A6A6` | Nebentext |
| Off-White | `#F2F0EC` | Text, helle Flächen |
| Status | `#3DDC97` / `#F5B84A` / `#FF6B5E` | nur App und Admin |

- Verhältnis etwa 70 % Nacht/Schwarz, 20 % Off-White, 10 % Rot.
- **Hintergründe immer neutral** (R = G = B). Kein Blau-, Violett- oder sonstiger Farbstich, kein farbiger Glow.
- Rot ist knapp: ein Akzent pro Ansicht. In Fotos und Videos darf rotes Licht den Raum füllen.

## Schrift

- **Logo:** handgezeichnet (`public/assets/logo.png`, weiß). Nie nachbauen, nie verzerren.
  Weiß auf Dunkel, Schwarz auf Hell oder Rot.
- **Bastardo Rounded** (`src/fonts/bastardo/`, App: `ios/KPO/Fonts/`): Marken-Schrift für Website,
  App-Überschriften, Video-Overlays und Untertitel.
- **KPO-Schreibweise** (wie die Untertitel): Versalien, −5 %, Gewicht wechselt pro Buchstabe zwischen
  Regular, Semibold und Bold. Darf auch für Headlines auf Website und Posts genutzt werden.
- **Poster-Typo (Flyer, Video-Titel):** ebenfalls Bastardo, aber frei gesetzt:
  - Schnitte im Wechsel: Black für Zahl und Haupttitel, Light oder Regular für Zwischenwörter
    („EVENT“, „MUSIC“, „MUSIC AND MORE“).
  - Jede Zeile wird horizontal oder vertikal **gestaucht oder gestreckt**, bis sie die Breite des
    Stapels füllt. Zeilen eng übereinander (Zeilenhöhe ca. 0.8–0.9).
  - Datum-Box: KPO-Rot leicht durchsichtig (ca. 85–90 % Deckkraft), sehr wenig Innenabstand.
    Die Zahl in Black füllt die Box fast komplett (wie „03“ beim VAYA-Flyer).
    Variante: schwarze Box mit roter Zahl (Halloween).
- **UI-Schrift:** System (SF Pro / Inter) für Fließtext, Tabellen und Zahlen in App und Admin,
  Ziffern gleich breit.

| Stufe | Größe | Schnitt | Zeilenhöhe | Laufweite |
|---|---|---|---|---|
| Display | 120 | Black, Versalien | 0.9 | −4 % |
| H1 | 64 | Black, Versalien | 1.0 | −4 % |
| H2 | 40 | Black | 1.05 | −3 % |
| H3 | 24 | Bold | 1.15 | −3 % |
| Text | 16 | Light (Website) / UI-Schrift | 1.6 | −2 % |
| Klein | 13 | Regular | 1.5 | 0 |
| Label | 12 | Semibold, Versalien | – | +8 % |

## UI

- Buttons: Pillen (Radius 999), Versalien. Haupt-Aktion Rot mit Button-Glanz, Zweit-Aktion als Outline.
- Labels: rund für Status („Sold out“), eckig-rot nur für Stadt/Datum wie auf dem Flyer.
- Karten ohne Rahmen: Fläche `#1C1C1C` auf `#121212`, Radius 20 (App 24). In iOS Liquid Glass.
- Abstände 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Diagrammbalken max. 24 px, Radius 4.
- Aufbau: Wichtigstes oben, Einstellungen klein unten, ein Akzent pro Ansicht.
- Umsetzung: Website `src/app/globals.css`, Admin `src/app/admin/admin.css`, App `ios/KPO/Theme.swift`.

## Flyer (Instagram 4:5, Story 9:16)

Mittig gestapelt, von oben nach unten:
1. Logo klein + „PRESENTS“
2. Datum-Box in KPO-Rot (leicht durchsichtig, kaum Rand), Zahl in Bastardo Black füllt sie fast ganz, Monat darunter
3. Titel-Stapel weiß (auf hellem Grund schwarz), Bastardo mit Schnitten im Wechsel, jede Zeile gestaucht/gestreckt auf volle Breite
4. Location in weißen Versalien
5. Stadt-Label eckig, Rot mit schwarzer Schrift
6. Uhrzeit weiß, breit gesperrt

Hintergrund: Foto mit rotem Licht, Vorhang oder Discokugel. Unscharf, Korn drüber, Text bleibt scharf.
Vorlagen: `public/assets/flyer/`.

## Fotos

Direkter Blitz, harte Schatten, tiefe Schwarztöne, Filmkorn 8–12 %. Echte Momente: Crowd, DJs,
Lachen, Hände hoch. Licht rot oder kalt-weiß, Hauttöne warm. Keine Stockfotos.

## Video (Reels, Stories, TikTok)

Werkzeug: `~/kpo-reels` (derzeit mit HyperFrames). Ist etwas ohne HyperFrames schneller und einfacher, dann ohne.

- **Format:** 1080 × 1920, 30 fps, H.264 High, AAC 48 kHz. Jedes Video geht vor dem Export durch den
  Qualitätscheck: -14 LUFS (±1), True Peak ≤ -1 dBTP, alle Clips gleich laut, 8–12 Mbit/s.
- **Tote Zonen (TikTok + Instagram):** oben 250 px, unten 480 px, rechts 140 px, links 60 px frei.
  Text und Grafiken nur in der Fläche x 60–940, y 250–1440.
- **Schnitt:** Hook zuerst (stärkster Satz als Cold Open), Pausen und Füllsätze raus,
  Jump Cuts mit leichtem Punch-in (Zoom 1.0 / 1.12 im Wechsel).
- **Titel am Anfang:** Bastardo Bold, ca. 60 px, auf **voll deckender schwarzer Box**, Teil-Nummer
  klein in roter Box. Gleitet ruhig von oben ins Bild. **Kein Schatten.**
- **Untertitel (KPO-Untertitel, in jedem Video):** Bastardo Rounded, **alles in Versalien**,
  Laufweite −5 %, Off-White **ohne Box, mit weichem Schatten** (Drop Shadow ca. 3 px nach unten,
  Weichzeichner ca. 6 px, 80 % Schwarz, dazu feine Kontur). **Gewicht wechselt von Buchstabe zu
  Buchstabe** zwischen Regular, Semibold und Bold (nie zwei gleiche nebeneinander, zufällig, pro Zeile fest).
  Eine Zeile, max. 3 Wörter, immer an derselben Stelle, mittig.
  - Event-/Promo-Videos (Person spricht in die Kamera): ca. 50 px, Mitte bei y ≈ 1120 (Brusthöhe).
  - Build-in-Public-Content: kleiner, ca. 40 px, unten in der sicheren Zone.
  - Timing: Wörter per Forced Alignment am Audio ausrichten, Zeile erscheint mit dem ersten Wort.
    Beginnt die Sprache sofort, steht die erste Zeile ab Frame 0. Direkt nacheinander ohne Animation;
    folgt keine Zeile direkt, kurz ausblenden.
- **Textboxen allgemein:** Innenabstand oben = unten (Box exakt auf Versalhöhe und Grundlinie,
  CSS `text-box: trim-both cap alphabetic`). Gilt für jeden Text in Boxen.
- **Motion Graphics:** groß (fast volle Breite der sicheren Zone), gleiten **ruhig von oben nach unten**
  ins Bild (kein Überschwingen), dann klein als Kapitel-Chip oben links. Schwarze und rote Boxen statt Schatten.
- **Namensschild:** in den ersten Sekunden schwebt der Name über dem Kopf und folgt ihm (Face Tracking).
  Box mit 40 % Deckkraft, kleines rotes „KPO“, **ohne Pfeil**, blendet nur ein und aus.
- **Sound:** Soundeffekte nur aus der Pixabay-Bibliothek in `~/kpo-reels/sfx` (Whoosh beim
  Reinfallen, Pop bei Schildern, dezent unter der Sprache).
- **Nie:** Outro/Endcard, Fortschritts- oder Timeline-Balken, Bauchbinde mit Name und Untertitel,
  Schatten unter Text (Ausnahme: KPO-Untertitel), Poster-Stil mit gestauchter Typo im Video.

## Dateien

```
brand/
  README.md        diese Regeln
  tokens.css       Werte als CSS-Variablen
  tokens.json      Werte für andere Tools (Video, Design-Apps)
  boards/          Übersichtsbilder (3200 × 2000)
  src/             HTML-Quellen der Boards, Bilder, render.sh
```

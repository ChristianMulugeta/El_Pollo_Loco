# Verbesserungsplan für El Pollo Loco

Dieser Plan fasst alle Verbesserungspunkte aus dem erhaltenen Spiel-Feedback zusammen. Optionale Empfehlungen sind entsprechend gekennzeichnet.

## 1. Impressum fertigstellen

- [x] Den Hinweis „Sample Information, Replace all details before publishing“ entfernen.
- [x] Sämtliche Platzhalterdaten ersetzen, insbesondere:
  - [x] „Musterstraße 1“
  - [x] Beispiel-E-Mail-Adresse
  - [x] Weitere noch vorhandene Musterdaten
- [x] Ein vollständiges und seriöses Impressum für das Portfolio-Projekt eintragen.
- [x] Optional: Das Impressum statt auf einer eigenen Seite in einem schließbaren Dialog beziehungsweise Modal anzeigen.

## 2. Steuerungsdialog für Mobilgeräte anpassen

- [x] Die unnötige Scrollbar im Steuerungsdialog auf Mobilgeräten entfernen.
- [x] Prüfen, ob der gesamte Inhalt ohne Scrollen in den Dialog passt.
- [x] Falls eine Scrollbar erforderlich bleibt, diese passend zum Design gestalten. (Nicht erforderlich.)
- [x] Auf Mobilgeräten keine Tastatursteuerung anzeigen.
- [x] Stattdessen die im Spiel verfügbaren Touch-Buttons darstellen und erklären.
- [x] Die angezeigte Steuerung vom Gerät abhängig machen:
  - [x] Desktop: Tastatursteuerung
  - [x] Mobilgerät: Touch-Steuerung

## 3. Responsiveness und Seiten-Scrollbars korrigieren

- [x] Die dauerhaft sichtbare Scrollbar auf Notebook- und anderen Bildschirmgrößen entfernen.
- [x] Sicherstellen, dass nach dem Spielstart ebenfalls keine unnötige Seiten-Scrollbar erscheint.
- [x] Seite und Spielfeld so dimensionieren, dass sie vollständig in den verfügbaren Viewport passen.
- [x] Die Darstellung auf verschiedenen Desktop-, Notebook- und Mobilgrößen testen.
- [x] Für zusätzliche Tests ein Responsive-Test-Tool wie `responsivetesttool.com` verwenden. (Durch Viewport-basierte CSS-Prüfung ersetzt.)

## 4. Darstellung der Hühner verbessern

- [ ] Optional: Die Hühner etwas größer darstellen, damit sie besser sichtbar sind. (Übersprungen.)

## 5. Ebenenreihenfolge der Spielfiguren korrigieren

- [x] Pepe immer vor den Hühnern darstellen.
- [x] Die Hühner hinter Pepe anzeigen.
- [x] Dies auch bei besiegten beziehungsweise am Boden liegenden Hühnern sicherstellen.
- [x] Dafür die Zeichenreihenfolge oder den `z-index` überprüfen und anpassen.

## 6. Vertikale Positionen der Charaktere vereinheitlichen

- [x] Pepe und die Hühner konsistent auf derselben vorgesehenen Bodenlinie positionieren.
- [x] Sicherstellen, dass Pepe immer mit den Füßen auf derselben Höhe landet.
- [x] Die Positionen nach einem Neustart oder erneuten Spielbeginn überprüfen.
- [x] Den Fehler untersuchen, durch den Pepe nach erlittenem Schaden und einem anschließenden Sprung tiefer sitzt oder landet.
- [x] Sicherstellen, dass die Höhe der Charaktere in allen Spielzuständen gleich bleibt.

## 7. Blockierten Spielfortschritt beheben

- [x] Prüfen, warum Pepe in bestimmten Situationen nicht am Gegner vorbeilaufen kann.
- [x] Die Kollisionslogik und Positionierung des Gegners kontrollieren.
- [x] Verhindern, dass ein Gegner den weiteren Spielfortschritt unbeabsichtigt vollständig blockiert.

## 8. Gegner herausfordernder gestalten (übersprungen)

- [ ] Dem Gegner einen eigenen, klar erkennbaren Angriff geben.
- [ ] Sicherstellen, dass der Gegner Pepe tatsächlich Schaden zufügen kann.
- [ ] Eine geeignete Angriffsmechanik umsetzen, zum Beispiel:
  - [ ] Auf Pepe zustürmen
  - [ ] Eier auf Pepe werfen
  - [ ] Eine andere kreative Angriffsmethode
- [ ] Das Verhalten des Gegners aktiver gestalten.
- [ ] Den Schwierigkeitsgrad testen und so anpassen, dass der Gegner eine echte Herausforderung darstellt.

## 9. JSDoc-Dokumentation vervollständigen

- [x] Alle Funktionen mit Übergabeparametern um vollständige `@param`-Angaben ergänzen.
- [x] Für jeden Parameter Folgendes dokumentieren:
  - [x] Datentyp
  - [x] Parametername
  - [x] Kurze Beschreibung
- [x] Alle Funktionen mit Rückgabewert um eine `@returns`- beziehungsweise `@return`-Angabe ergänzen.
- [x] Insbesondere Boolean-Rückgabewerte korrekt dokumentieren.
- [x] Aus jeder Dokumentation klar hervorgehen lassen, ob die Funktion einen Wert zurückgibt oder `void` ist.
- [x] Die JSDoc-Ergänzungen konsequent bei allen betroffenen Funktionen durchführen.

## Empfohlene Reihenfolge

1. Impressum und Platzhalterdaten korrigieren.
2. Responsiveness und unerwünschte Scrollbars beheben.
3. Mobile Steuerungsanzeige anpassen.
4. Positions-, Ebenen- und Kollisionsfehler korrigieren.
5. Gegnerangriff und Schwierigkeitsgrad überarbeiten.
6. JSDoc-Dokumentation vervollständigen.
7. Optionale visuelle Verbesserungen umsetzen.
8. Abschließend alle Bildschirmgrößen und Spielsituationen erneut testen.

## Abschlusskontrolle

- [x] Impressum enthält keine Platzhalter mehr.
- [x] Desktop- und Mobilsteuerung werden jeweils korrekt erklärt.
- [x] Auf den getesteten Bildschirmgrößen erscheinen keine unnötigen Scrollbars.
- [ ] Pepe bleibt sichtbar im Vordergrund und auf einer konsistenten Bodenhöhe.
- [x] Gegner blockieren den Spielfortschritt nicht unbeabsichtigt.
- [ ] Gegner greifen an und stellen eine angemessene Herausforderung dar.
- [x] Alle Parameter und Rückgabewerte sind vollständig mit JSDoc dokumentiert.
- [ ] Das Spiel wurde nach sämtlichen Änderungen vollständig getestet.

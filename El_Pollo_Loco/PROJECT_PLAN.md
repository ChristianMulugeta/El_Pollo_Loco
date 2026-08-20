# El Pollo Loco – Umsetzungsplan

## Zusammenarbeit

- Änderungen werden in kleinen, verständlichen Schritten umgesetzt.
- Vor jeder Änderung werden Ziel, Datenfluss und betroffene Dateien erklärt.
- Christian übernimmt überschaubare Aufgaben selbst; anschließend wird der Diff gemeinsam geprüft.
- Nach jeder abgeschlossenen Phase folgen Browser-Test und eigener Git-Commit.
- Der bestehende Stil bleibt erhalten: Vanilla JavaScript, einzelne Klassendateien, Vererbung und globale Script-Einbindung.
- Neue oder bearbeitete Funktionen sollen möglichst höchstens 14 Zeilen lang sein und JSDoc erhalten.
- Sichtbare Texte und Bedienelemente bleiben auf Englisch.

## Fortschritt

### Phase 1 – Projektstruktur und Bereinigung: abgeschlossen

- `models/` in `classes/` umbenannt
- `js/game.js` zu `script.js` verschoben
- HTML-Pfade und Metadaten aktualisiert
- Favicon und Canvas-Fallback ergänzt
- `.gitignore` ergänzt
- Konsolenausgabe, sichtbare Debugrahmen und alte Aufgabenliste entfernt
- Commit: `e9ccb20 chore: reorganize project structure and remove development leftovers`

### Phase 2 – Spielkern stabilisieren: weitgehend abgeschlossen

- doppeltes Zeichnen entfernt
- World- und Charakter-Timing korrigiert
- Bewegungsgeschwindigkeit an 60 FPS angepasst
- Wurfeingabe gegen Tastenwiederholung abgesichert
- Schadens-Cooldown ergänzt
- vollständige AABB-Kollision mit figurabhängigen Offsets ergänzt
- `Cloud` korrekt benannt und kontinuierlich bewegt
- Bewegung nach dem Tod gesperrt
- Browser-Scrolling durch Spieltasten verhindert
- Commit: `9fb1210 fix: stabilize rendering, collision, input, and movement timing`

Noch offen aus der technischen Grundlage:

- Intervall-IDs zentral erfassen und für Game Over beziehungsweise Restart stoppen
- einen optionalen, standardmäßig deaktivierten Hitbox-Debugmodus zum Feinjustieren erwägen

### Phase 3 – Startscreen und Spielerklärung: abgeschlossen

- automatischen Spielstart entfernen
- statischen Startscreen mit Start-Button erstellen
- Steuerungsdialog mit Schließen-Button und Klick-außerhalb-Verhalten erstellen
- Gegner und World erst beim Start aktivieren

### Phase 4 – Coins, Flaschen und Statusanzeigen: abgeschlossen

- `Coin` und sammelbare `Bottle` erstellen
- Gegenstände über `Level` verwalten
- Sammelkollisionen und Entfernen ergänzen
- Coin- und Flaschenstatusbar erstellen

## Nächste Phasen

### Phase 5 – Vollständige Wurfmechanik

- Werfen an Flaschenvorrat binden
- Vorrat beim Werfen reduzieren
- Wurfrichtung an Blickrichtung anpassen
- Rotation, Splash, Trefferprüfung und Entfernen ergänzen

### Phase 6 – Normale Gegner vervollständigen

- kleinen Chicken-Typ ergänzen
- unterschiedliche Größe und Geschwindigkeit verwenden
- Hurt- und Dead-Zustände ergänzen
- Treffer durch Flaschen und Sprung von oben umsetzen
- seitlichen Sprung ausdrücklich nicht als Angriff werten

### Phase 7 – Endboss

- Boss erreichbar machen und bei Annäherung aktivieren
- Alert-, Attack-, Hurt- und Dead-Zustände ergänzen
- Energie, Statusbar, Schaden und Siegbedingung ergänzen

### Phase 8 – Charakterzustände

- Priorität Dead → Hurt → Jump → Walk → Idle → Sleep umsetzen
- Idle- und Sleep-Zustand nach spätestens 15 Sekunden ergänzen
- fehlende, freigegebene Idle-/Sleep-Assets bereitstellen

### Phase 9 – Gewinnen, Verlieren und Neustart

- Verlust bei leerer Lebensanzeige erkennen
- Sieg nach Boss-Tod erkennen
- Endscreens anzeigen
- Spiellogik und Intervalle stoppen
- Restart ohne Seitenreload und Rückkehr zum Home-Screen umsetzen

### Phase 10 – Audio und Mute

- freigegebene lokale Audiodateien bereitstellen
- Hintergrundmusik und Ereignissounds ergänzen
- zentralen Mute-Schalter erstellen
- Mute-Status in `localStorage` speichern

### Phase 11 – Mobile Bedienung und Responsiveness

- Touchbuttons für Bewegung, Sprung und Wurf ergänzen
- Kontextmenü bei langem Drücken verhindern
- Querformat optimieren und Hochformat-Hinweis anzeigen
- Canvas-Seitenverhältnis und scrollfreie Darstellung sicherstellen

### Phase 12 – Abschluss und Abnahme

- Impressumsseite mit Musterdaten erstellen
- JSDoc, Funktionslängen und Namen prüfen
- Links, Buttons, Screens und Konsole prüfen
- Desktop-, Smartphone- und Tablet-Testmatrix durchführen
- optionale Story und Fullscreen erst nach den Pflichtpunkten ergänzen

## Nächster Einstiegspunkt

Beim nächsten Mal mit **Phase 5 – Vollständige Wurfmechanik** beginnen. Zuerst den Flaschenvorrat an die bestehende Wurfeingabe anbinden und anschließend Wurfrichtung, Rotation, Splash und Trefferprüfung in kleinen Schritten ergänzen.

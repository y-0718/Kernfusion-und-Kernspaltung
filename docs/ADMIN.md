# Admin-Anleitung

Der Admin-Bereich ist unter dieser Adresse erreichbar:

```text
/admin
```

Beispiel lokal:

```text
http://localhost:3000/admin
```

Beispiel online:

```text
https://deine-domain.vercel.app/admin
```

## Einloggen

1. Öffne `/admin`.
2. Gib E-Mail und Passwort ein.
3. Klicke auf `Einloggen`.

Der Benutzer muss in Supabase in der Tabelle `profiles` die Rolle `admin` oder `editor` haben, um Inhalte zu ändern.

## Neue Slide erstellen

1. Öffne `Slides`.
2. Klicke auf `Neue Slide`.
3. Gib Titel und Untertitel ein.
4. Wähle einen Layout-Typ.
5. Trage Text, Stichpunkte oder andere Inhalte ein.
6. Wähle bei Bedarf Medien aus.
7. Stelle den Status auf `Veröffentlicht`.
8. Klicke auf `Speichern`.

## Slide bearbeiten

1. Öffne `Slides`.
2. Klicke auf eine vorhandene Slide.
3. Ändere Texte, Layout, Medien oder Design.
4. Klicke auf `Speichern`.

## Slide ausblenden

Setze den Status auf:

```text
hidden
```

Oder nutze in der Slide-Liste das Augen-Symbol.

## Slide duplizieren

In der Slide-Liste auf das Kopieren-Symbol klicken.

Die Kopie wird als Entwurf erstellt. So kannst du eine vorhandene Slide als Vorlage verwenden.

## Slide löschen

In der Slide-Liste auf das Papierkorb-Symbol klicken.

Technisch wird die Slide archiviert. Das ist sicherer als endgültiges Löschen.

## Reihenfolge ändern

In der Slide-Liste kannst du Slides mit den Pfeilbuttons nach oben oder unten verschieben.

## Medien hochladen

1. Öffne `Medien`.
2. Wähle eine Datei aus.
3. Gib eine Kategorie an.
4. Trage einen Alt-Text ein.
5. Optional: Bildunterschrift eintragen.
6. Klicke auf `Datei hochladen`.

Danach kann das Medium in jeder Slide ausgewählt werden.

## YouTube oder Vimeo hinzufügen

1. Öffne `Medien`.
2. Klicke auf `Externes Video hinzufügen`.
3. Füge die URL ein.
4. Gib einen Namen ein.

Alternativ kannst du bei einer Video-Slide direkt eine YouTube-/Vimeo-URL in das Videofeld einfügen.

## Quellen hinzufügen

1. Öffne eine Slide.
2. Unten findest du `Quellen dieser Slide`.
3. Gib Titel, Autor, Verlag/Website und URL ein.
4. Klicke auf `Quelle hinzufügen`.

Die Quellen-Slide am Ende sammelt automatisch alle Quellen aus veröffentlichten Slides.

## Präsentator-Notizen

Jede Slide hat ein Feld `Präsentator-Notizen`.

Diese Notizen sind privat und erscheinen nicht in der öffentlichen Präsentation.

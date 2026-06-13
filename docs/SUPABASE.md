# Supabase-Anleitung für Anfänger

Supabase speichert alle Inhalte deiner Präsentation: Slides, Texte, Medien, Quellen und Benutzer.

## 1. Supabase-Projekt erstellen

1. Öffne `https://supabase.com`.
2. Erstelle ein Konto oder melde dich an.
3. Klicke auf `New project`.
4. Wähle eine Organisation.
5. Vergib einen Projektnamen, zum Beispiel:

```text
fusion-presentation
```

6. Lege ein Datenbankpasswort fest und speichere es sicher.
7. Wähle eine Region in deiner Nähe.
8. Klicke auf `Create new project`.

## 2. SQL-Dateien ausführen

Öffne in Supabase links den Bereich `SQL Editor`.

Führe die Dateien in genau dieser Reihenfolge aus:

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/storage.sql`
4. `supabase/seed-example-slides.sql`

So geht es:

1. Öffne die Datei lokal.
2. Kopiere den gesamten Inhalt.
3. Füge ihn in den Supabase SQL Editor ein.
4. Klicke auf `Run`.
5. Wiederhole das mit der nächsten Datei.

## 3. Supabase Auth einrichten

1. Öffne links `Authentication`.
2. Gehe zu `Users`.
3. Klicke auf `Add user`.
4. Gib deine E-Mail-Adresse und ein Passwort ein.
5. Bestätige den Benutzer.

Danach muss dieser Benutzer Admin-Rechte bekommen.

## 4. Benutzer zum Admin machen

1. Öffne links `Table Editor`.
2. Öffne die Tabelle `profiles`.
3. Suche deine E-Mail-Adresse.
4. Ändere die Spalte `role` auf:

```text
admin
```

5. Speichere die Änderung.

Jetzt kannst du dich unter `/admin` einloggen.

## 5. Supabase Storage prüfen

Die Datei `supabase/storage.sql` erstellt einen Bucket:

```text
presentation-media
```

Dort werden Bilder, Videos und PDFs gespeichert.

## 6. Supabase Keys finden

1. Öffne links `Project Settings`.
2. Gehe zu `API`.
3. Kopiere:

```text
Project URL
Publishable key
```

Diese Werte brauchst du in `.env.local` und später in Vercel.

## 7. Lokale .env.local erstellen

Kopiere `.env.example` zu `.env.local`.

Dann trägst du ein:

```text
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dein-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Für den normalen Betrieb brauchst du den Service-Role-Key nicht.

## Wichtig

Alle Inhalte werden in Supabase gespeichert. Wenn du später neue Slides, Bilder oder Quellen hinzufügst, passiert das über `/admin`, nicht im Code.

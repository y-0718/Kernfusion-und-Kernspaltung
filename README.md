# Interaktive Physik-Präsentation: Kernfusion und Kernspaltung

Dies ist eine moderne Next.js-Web-App mit eigenem Admin-CMS unter `/admin`.

Das wichtigste Prinzip:

**Die Präsentationsinhalte liegen nicht im Code.**  
Slides, Texte, Bilder, Videos, Quellen, Reihenfolge, Layouts und Präsentator-Notizen werden in Supabase gespeichert und später über `/admin` bearbeitet.

## Was enthalten ist

- Next.js mit TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Datenbank, Auth und Storage
- Admin-Bereich unter `/admin`
- Medienbibliothek
- Slide-Editor mit Layout-Auswahl
- Quellenverwaltung
- Präsentator-Notizen
- Vollbild-Präsentationsmodus
- Fortschrittsnavigation
- Offline-Grundcache
- SQL-Dateien für Supabase
- Beispielslides als Datenbank-Seed
- Anfänger-Anleitungen für GitHub, Supabase und Vercel

## Wichtige Ordner

```text
app/                 Seiten der Next.js-App
components/          Wiederverwendbare UI-, Admin- und Präsentations-Komponenten
lib/                 Supabase-Verbindung, Typen und Hilfsfunktionen
supabase/            SQL-Dateien für Datenbank, Sicherheit, Storage und Beispielinhalte
docs/                Einfache Schritt-für-Schritt-Anleitungen
public/              Öffentliche Dateien wie Icon und Service Worker
```

## Lokal starten

1. Abhängigkeiten installieren:

```bash
npm install
```

2. `.env.example` kopieren und als `.env.local` speichern:

```bash
cp .env.example .env.local
```

3. In `.env.local` deine Supabase-Werte eintragen.

4. Entwicklungsserver starten:

```bash
npm run dev
```

5. Website öffnen:

```text
http://localhost:3000
```

6. Admin öffnen:

```text
http://localhost:3000/admin
```

## Supabase SQL-Dateien

In dieser Reihenfolge im Supabase SQL Editor ausführen:

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/storage.sql`
4. `supabase/seed-example-slides.sql`

Danach in Supabase Auth einen Benutzer anlegen und in der Tabelle `profiles` die Rolle auf `admin` setzen.

## Inhalte später bearbeiten

Nach der Einrichtung bearbeitest du Inhalte über:

```text
/admin
```

Du kannst dort:

- Slides erstellen
- Slides bearbeiten
- Slides duplizieren
- Slides sortieren
- Slides veröffentlichen oder ausblenden
- Bilder und Videos hochladen
- Medien wiederverwenden
- Quellen ergänzen
- Präsentator-Notizen speichern
- Layout pro Slide auswählen

## Keine festen Präsentationsinhalte im Code

Die Beispielslides befinden sich in:

```text
supabase/seed-example-slides.sql
```

Sie werden in Supabase importiert und sind danach normale CMS-Inhalte.

Der Code enthält nur:

- Layout-Vorlagen
- Editor-Funktionen
- Animationen
- Datenzugriff
- Darstellung

## Weitere Anleitungen

- [GitHub-Anleitung](docs/GITHUB.md)
- [Supabase-Anleitung](docs/SUPABASE.md)
- [Vercel-Anleitung](docs/VERCEL.md)
- [Admin-Anleitung](docs/ADMIN.md)
- [Inhalte erweitern](docs/CONTENT-GUIDE.md)

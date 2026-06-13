# Vercel-Deployment-Anleitung für Anfänger

Vercel veröffentlicht deine Next.js-App im Internet.

## 1. Vercel-Konto erstellen

1. Öffne `https://vercel.com`.
2. Melde dich am besten mit GitHub an.

## 2. GitHub-Repository importieren

1. Klicke in Vercel auf `Add New`.
2. Wähle `Project`.
3. Wähle dein GitHub-Repository aus.
4. Vercel erkennt automatisch, dass es ein Next.js-Projekt ist.

## 3. Environment Variables eintragen

Bevor du auf `Deploy` klickst, trage diese Werte ein:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Beispiel:

```text
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dein-publishable-key
NEXT_PUBLIC_SITE_URL=https://deine-domain.vercel.app
```

Wenn du später eine eigene Domain nutzt, ändere `NEXT_PUBLIC_SITE_URL` auf diese Domain.

## 4. Deploy starten

1. Klicke auf `Deploy`.
2. Warte, bis Vercel fertig ist.
3. Öffne die angezeigte Website-Adresse.

## 5. Admin testen

Öffne:

```text
https://deine-domain.vercel.app/admin
```

Logge dich mit dem Supabase-Benutzer ein, den du als `admin` markiert hast.

## 6. Spätere Updates

Wenn du später Codeänderungen zu GitHub hochlädst, veröffentlicht Vercel automatisch neu.

Wenn du nur Slides, Bilder oder Texte im Admin änderst, brauchst du kein neues Deployment. Diese Daten kommen direkt aus Supabase.

## 7. Vorschau-Deployments

Wenn du später mit Git-Branches arbeitest, erzeugt Vercel für jeden Branch eine Vorschau. Das ist praktisch, um Änderungen zu testen, bevor sie auf der echten Seite landen.

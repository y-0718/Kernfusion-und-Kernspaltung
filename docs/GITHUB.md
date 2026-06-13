# GitHub-Anleitung für Anfänger

GitHub ist der Ort, an dem der Quellcode gespeichert wird. Vercel kann später automatisch daraus deine Website veröffentlichen.

## 1. GitHub-Konto erstellen

1. Öffne `https://github.com`.
2. Erstelle ein kostenloses Konto.
3. Bestätige deine E-Mail-Adresse.

## 2. Neues Repository erstellen

1. Klicke rechts oben auf `+`.
2. Wähle `New repository`.
3. Gib einen Namen ein, zum Beispiel:

```text
fusion-presentation-cms
```

4. Wähle `Private` oder `Public`.
5. Klicke auf `Create repository`.

## 3. Projekt hochladen

Wenn du Git lokal benutzt:

```bash
git init
git add .
git commit -m "Initial project"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/fusion-presentation-cms.git
git push -u origin main
```

Ersetze `DEIN-NAME` durch deinen GitHub-Benutzernamen.

## 4. Spätere Updates hochladen

Wenn du später Codeänderungen hast:

```bash
git add .
git commit -m "Update project"
git push
```

Vercel erkennt den Push automatisch und veröffentlicht die neue Version.

## Wichtig

Diese Datei darf hochgeladen werden:

```text
.env.example
```

Diese Datei darf nicht hochgeladen werden:

```text
.env.local
```

`.env.local` enthält geheime Zugangsdaten.

# HR Directory — Preconfig (Netlify + GitHub)

Preconfigurado con:
- `GITHUB_OWNER=Fudicia`
- `GITHUB_REPO=hr-directory`
- `DATA_PATH=data/hr-store.json`
- `GITHUB_BRANCH=main`

## Pasos
1. Crea el repo **Fudicia/hr-directory** (o cambia OWNER/REPO en Netlify).
2. En Netlify → Environment variables:
   - `GITHUB_TOKEN` (scopes: `public_repo` si es público; `repo` si privado)
   - `GITHUB_OWNER=Fudicia`
   - `GITHUB_REPO=hr-directory`
   - `GITHUB_BRANCH=main`
   - `DATA_PATH=data/hr-store.json`
   - `ADMIN_KEY` (elige una clave segura)
   - `VITE_ADMIN_KEY` (mismo valor que `ADMIN_KEY`)
3. Build: `npm run build` — Publish: `dist`

> Si prefieres otro owner/repo, solo cambia las variables sin tocar código.

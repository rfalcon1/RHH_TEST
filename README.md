
# HR Directory DEMO v4.6 — PDF.js (legacy) + Dual fetch (directo → proxy)

- PDF.js 3.11 (legacy) estable en Vite/Netlify
- Intento de descarga directo; si falla y la URL es externa, segundo intento via `/.netlify/functions/fetch`
- Admin doc mgmt, Directorio, KPIs, Calendario incluidos

Netlify:
- Build: `npm run build`
- Publish: `dist`
- Functions dir: `netlify/functions`

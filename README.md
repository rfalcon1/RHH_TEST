
# HR Directory DEMO v4.5 — Fix PDF.js worker (CDN)

- PDF.js ahora usa `workerSrc` desde CDN para evitar problemas de bundling en Vite/Netlify.
- Mantiene el proxy `/.netlify/functions/fetch` para PDFs externos.
- Resto igual (Admin doc mgmt, Directorio, KPIs, Calendario).

Deploy en Netlify:
- Build: `npm run build`
- Publish: `dist`
- Functions dir: `netlify/functions` (netlify.toml ya lo define)

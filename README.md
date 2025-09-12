
# Directorio de Recursos Humanos — DEMO (V4 Fixed Seed r2)

Demo listo para GitHub + Netlify:
- SPA con React + Vite + Tailwind
- Directorio con 20+ fichas (bio, asignaciones, `mailto:`)
- Documentos demo (PDF/PNG/HTML/PPTX/DOCX/XLSX) con preview/descarga
- Calendario con ejemplos hasta mayo 2026
- KPIs tarjetas
- Administración (clave **RH2025**)
- Routing SPA: `netlify.toml` y `public/_redirects`

## Scripts
```bash
npm i
npm run dev
npm run build
```

## Deploy Netlify
- Build: `npm run build`
- Publish: `dist`
- Redirects: ya incluidos para SPA

## Estructura
- `src/pages/*` (Directory, Documents, Viewer, Calendar, KPIs, Admin)
- `src/data/seed.json` (empleados, docs, eventos, KPIs)
- `public/docs/*` (archivos demo para el visor)

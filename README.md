
# HR Directory DEMO v4 r5 — Fix Compliance Preview

Cambios clave:
- **Viewer**: mensaje claro si el PDF externo no permite embed por X-Frame-Options/CSP + botón primario **Abrir original**.
- **Admin**: botón **🧹 Restablecer demo** que limpia `localStorage` (soluciona casos donde el array `docs` local sobrescribe el seed y no aparece *Compliance*).

Cómo usar:
1) Subir a GitHub/Netlify como siempre.
2) Si no ves *Compliance* en **/documentos**, entra a **/admin** → *Restablecer demo*.
3) Si un PDF no se muestra en el visor, usa **Abrir original**.

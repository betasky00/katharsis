# Katharsis — sitio web (rediseño)

Sitio estático (HTML/CSS/JS, sin build) para **Katharsis S.A.S.**, consultora en
innovación y creatividad. Concepto de rediseño.

## Estructura
- `index.html` — Home (hero, servicios, clientes, formulario de contacto)
- `descubre-katharsis.html` — Nosotros
- `descubre-k.html` — Historia
- `productos.html` — Productos
- `equipo.html` — Equipo
- `test-k.html` — Test Oveja Negra
- `privacidad.html` — Política de tratamiento de datos (Ley 1581 de 2012)
- `assets/` — css, js, fuentes e imágenes
- `vercel.json` — cabeceras de seguridad (CSP, HSTS, etc.)

## Formulario de contacto (activar envío)
El formulario está listo para **Formspree** (gratis). Para activarlo:
1. Crea un formulario en https://formspree.io y copia tu ID (ej. `xayzabcd`).
2. En `index.html`, reemplaza `TU_ID_FORMSPREE` en `data-endpoint="https://formspree.io/f/TU_ID_FORMSPREE"`.
Sin configurar, el formulario abre el correo del visitante con los datos ya escritos (respaldo).

## Deploy (Vercel)
Proyecto estático: sin comando de build. Publicar la raíz del repositorio.

## WhatsApp
Los botones apuntan a `wa.me/573102709771`. Cambia el número si es necesario.

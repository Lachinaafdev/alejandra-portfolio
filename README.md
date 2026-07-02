# Portafolio — Alejandra Fierro

Portafolio digital construido con Angular 18 (standalone components + signals).

## Cómo correrlo

```bash
npm install
npm start
```

Abre http://localhost:4200

## Cómo publicarlo gratis

```bash
npm run build
```

El contenido de `dist/alejandra-portfolio/browser` se puede subir a Netlify,
Vercel, GitHub Pages o Firebase Hosting.

## Dos idiomas (ES/EN)

Todo el contenido vive en archivos JSON por idioma:

- `src/assets/i18n/es.json` — español
- `src/assets/i18n/en.json` — inglés

El botón ES/EN del header cambia el idioma al instante (se guarda en
localStorage y detecta el idioma del navegador la primera vez). La
infraestructura vive en `src/app/i18n/i18n.ts`:

- `TranslateService` — carga el JSON del idioma activo (signals)
- `TranslatePipe` — pipe `| t` para usar en templates: `{{ 'nav.contact' | t }}`
- `RevealDirective` — animación de aparición al hacer scroll (`appReveal`)

Para agregar o editar textos: edita la misma llave en ambos JSON.

## Animaciones

- Entrada escalonada del hero al cargar la página
- Reveal al hacer scroll en casos, sobre mí y secciones de cada caso
- Todas respetan `prefers-reduced-motion`

## Dónde editar el contenido

- **Casos de estudio y todos los textos:** `src/assets/i18n/es.json` y `en.json`
- **Colores y tipografía:** `src/styles.css` (variables CSS al inicio)
- **Email y links:** `src/app/components/shell.components.ts`

## Imágenes de proyectos

Sube tus imágenes a `src/assets/img/` — ahí está `LEEME.txt` con los
nombres exactos que espera el sitio (portadas de tarjetas + 3 imágenes
de galería por caso). Mientras no existan, el sitio muestra placeholders
punteados con la ruta esperada.

## Sección de metodología con IA

La home incluye "Diseño con IA, no diseño por IA": tu proceso en 5 pasos
(Figma → Claude Design → Gemini/Canva → testeo → cursos y adopción).
Edítala en las llaves `method` de ambos JSON.

## Pendientes sugeridos

- [ ] Subir imágenes reales a src/assets/img/ (ver LEEME.txt)
- [ ] Actualizar el link de LinkedIn en el footer
- [ ] Versión en inglés de los resúmenes (TL;DR)
- [ ] Conectar un dominio propio

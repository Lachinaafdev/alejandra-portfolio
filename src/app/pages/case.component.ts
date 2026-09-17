import { Component, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { ScrollTrigger } from '../motion/motion';

/**
 * Página de caso con diagramación editorial. Cada proyecto usa 7
 * imágenes cuyas rutas viven en la llave "images" de projects
 * (portada · banner · cuadrada · grid 1-4). Mientras un archivo no
 * exista se muestra su espacio reservado con la ruta esperada, así
 * la diagramación se lee completa desde el primer día.
 */
@Component({
  selector: 'app-case',
  standalone: true,
  imports: [RouterLink, TranslatePipe, RevealDirective],
  template: `
    @if (caso(); as c) {
      <article class="wrap caso">
        <a routerLink="/" class="caso__back">{{ 'cases.back' | t }}</a>

        <header class="caso__head">
          <p class="eyebrow">{{ c.ticketNo }}</p>
          <h1>{{ c.title }}</h1>
        </header>

        <!-- 1 · PORTADA (21:9) -->
        @if (imgs()?.portada; as src) {
          <figure class="caso__marco caso__portada">
            @if (!fallo.has(src)) {
              <img [src]="src" [alt]="c.title" (error)="marcarFallo(src)" />
            } @else {
              <span class="caso__ph">
                <span>{{ 'gallery.missing' | t }}</span>
                <code>src/{{ src }}</code>
              </span>
            }
          </figure>
        }

        <!-- Columna de lectura + barra lateral de datos -->
        <div class="caso__cols">
          <div class="caso__main">
            <!-- <section class="caso__tldr" appReveal>
              <p class="eyebrow">{{ 'cases.labels.summary' | t }}</p>
              <p>{{ c.tldr }}</p>
            </section> -->

            <section appReveal>
              <h2>{{ 'cases.labels.context' | t }}</h2>
              <p>{{ c.context }}</p>
            </section>

            <section appReveal>
              <h2>{{ 'cases.labels.problem' | t }}</h2>
              <p>{{ c.problem }}</p>
            </section>

            <section appReveal>
              <h2>{{ 'cases.labels.process' | t }}</h2>
              <ol class="caso__proceso">
                @for (paso of c.process; track $index) {
                  <li>{{ paso }}</li>
                }
              </ol>
            </section>
          </div>

          <aside class="caso__aside">
            <div>
              <strong>{{ 'cases.labels.role' | t }}</strong>
              <span>{{ c.role }}</span>
            </div>
            <div>
              <strong>{{ 'cases.labels.period' | t }}</strong>
              <span>{{ c.period }}</span>
            </div>
            <div>
              <strong>{{ 'cases.labels.tools' | t }}</strong>
              <ul>
                @for (tool of c.tools; track $index) {
                  <li>{{ tool }}</li>
                }
              </ul>
            </div>
            <div>
              <strong>{{ 'cases.labels.metric' | t }}</strong>
              <span class="caso__aside-metric">{{ c.metric.value }}</span>
              <span>{{ c.metric.label }}</span>
            </div>
          </aside>
        </div>

        <!-- 2 · BANNER (16:9) -->
        @if (imgs()?.banner; as src) {
          <figure class="caso__marco caso__banner" appReveal>
            @if (!fallo.has(src)) {
              <img [src]="src" [alt]="c.title" loading="lazy" (error)="marcarFallo(src)" />
            } @else {
              <span class="caso__ph">
                <span>{{ 'gallery.missing' | t }}</span>
                <code>src/{{ src }}</code>
              </span>
            }
          </figure>
        }

        <section class="caso__col caso__decision" appReveal>
          <h2>{{ 'cases.labels.decision' | t }}</h2>
          <p>{{ c.keyDecision }}</p>
        </section>

        <!-- 3 · CUADRADA (1:1) -->
        @if (imgs()?.cuadrada; as src) {
          <figure class="caso__marco caso__cuadrada" appReveal>
            @if (!fallo.has(src)) {
              <img [src]="src" [alt]="c.title" loading="lazy" (error)="marcarFallo(src)" />
            } @else {
              <span class="caso__ph">
                <span>{{ 'gallery.missing' | t }}</span>
                <code>src/{{ src }}</code>
              </span>
            }
          </figure>
        }

        <section class="caso__col" appReveal>
          <h2>{{ 'cases.labels.results' | t }}</h2>
          <ul class="caso__resultados">
            @for (r of c.results; track $index) {
              <li>{{ r }}</li>
            }
          </ul>
        </section>

        <!-- 4 · REJILLA 1-4 (4:3) -->
        @if (imgs()?.grid?.length) {
          <div class="caso__galeria">
            @for (src of imgs()!.grid; track src) {
              <figure class="caso__marco caso__figura" appReveal>
                @if (!fallo.has(src)) {
                  <img [src]="src" [alt]="c.title" loading="lazy" (error)="marcarFallo(src)" />
                } @else {
                  <span class="caso__ph">
                    <span>{{ 'gallery.missing' | t }}</span>
                    <code>src/{{ src }}</code>
                  </span>
                }
              </figure>
            }
          </div>
        }

        <section class="caso__col" appReveal>
          <h2>{{ 'cases.labels.learning' | t }}</h2>
          <p>{{ c.learning }}</p>
        </section>

        @if (siguiente(); as s) {
          <a class="caso__next" [routerLink]="['/caso', s.slug]">
            @if (nextThumb(); as thumb) {
              @if (!fallo.has(thumb)) {
                <img class="caso__next-thumb" [src]="thumb" alt="" loading="lazy" (error)="marcarFallo(thumb)" />
              }
            }
            <span class="caso__next-text">
              <span class="eyebrow">{{ 'cases.next' | t }}</span>
              <span class="caso__next-title">{{ s.title }} →</span>
            </span>
          </a>
        }
      </article>
    }
  `,
  styles: [`
    /* Contenedor ancho: las imágenes mandan, el texto se mantiene
       en una columna legible dentro de él. */
    .caso { padding-top: 3.5rem; padding-bottom: 3.5rem; max-width: 1100px; }
    .caso__back { font-family: var(--mono); font-size: 0.82rem; }

    .caso__head { animation: caseIn 0.6s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
    .caso__head .eyebrow { font-size: 0.68rem; color: var(--gray-medium); }
    .caso__head h1 {
      font-family: var(--body); font-weight: 500;
      font-size: clamp(1.6rem, 2.8vw, 2.2rem);
      letter-spacing: -0.01em; line-height: 1.25;
      margin: 0.8rem 0 1.8rem;
      max-width: 30ch;
    }
    @keyframes caseIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .caso__head { animation: none; } }

    /* Marco de imagen: fija la proporción con o sin archivo, para que
       el espacio de cada imagen se vea aunque aún no exista. */
    .caso__marco {
      margin: 0; position: relative; overflow: hidden;
      border-radius: var(--radius-lg);
      background: var(--gray-light);
    }
    .caso__marco img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .caso__ph {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 1rem;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-lg);
      color: var(--arena-suave); font-size: 0.72rem; font-family: var(--mono);
    }
    .caso__ph code { color: var(--teal-900); font-size: 0.66rem; word-break: break-all; }

    .caso__portada { aspect-ratio: 21 / 9; margin-bottom: 2.5rem; }
    .caso__banner { aspect-ratio: 16 / 9; margin: 2.5rem 0; }
    .caso__cuadrada { aspect-ratio: 3 / 2; margin: 2.5rem 0; }
    .caso__galeria {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem;
      margin: 2.5rem 0;
    }
    .caso__figura { aspect-ratio: 4 / 3; }
    @media (max-width: 700px) {
      .caso__galeria { grid-template-columns: 1fr; }
      .caso__portada { aspect-ratio: 16 / 9; }
    }

    /* Texto + barra lateral de datos */
    .caso__cols {
      display: grid; grid-template-columns: minmax(0, 1fr) 240px;
      gap: 3.5rem; align-items: start;
    }
    .caso__main { max-width: 68ch; }
    .caso__aside {
      display: grid; gap: 1.5rem;
      position: sticky; top: 6rem;
      font-size: 0.85rem; color: var(--text-primary);
    }
    .caso__aside strong {
      display: block; font-family: var(--body); font-weight: 400;
      font-size: 0.75rem; letter-spacing: 0;
      color: var(--gray-medium); margin-bottom: 0.25rem;
    }
    .caso__aside ul { list-style: none; display: grid; gap: 0.15rem; }
    .caso__aside-metric {
      display: block; font-family: var(--body); font-weight: 500;
      font-size: 1.3rem; letter-spacing: -0.01em;
      color: var(--purple-500); margin-bottom: 0.1rem;
    }
    @media (max-width: 860px) {
      .caso__cols { grid-template-columns: 1fr; gap: 2.5rem; }
      .caso__aside { position: static; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    }

    /* Columna de lectura. Los encabezados son etiquetas discretas,
       como en el mock: el peso visual lo llevan el texto y las fotos. */
    .caso__col { max-width: 68ch; }
    section { margin: 2.2rem 0; }
    section h2 {
      font-family: var(--body); font-weight: 400;
      font-size: 0.82rem; letter-spacing: 0;
      color: var(--gray-medium);
      margin-bottom: 0.7rem;
    }
    section p { color: var(--arena-suave); font-size: 0.95rem; line-height: 1.7; }

    .caso__tldr {
      background: var(--gray-light);
      border-left: 3px solid var(--cenote);
      padding: 1.5rem 1.6rem; margin: 0 0 2.2rem;
    }
    .caso__tldr .eyebrow { font-size: 0.66rem; color: var(--gray-medium); }
    .caso__tldr p:last-child { margin-top: 0.6rem; }

    .caso__proceso {
      padding-left: 1.2rem; display: grid; gap: 0.7rem;
      color: var(--arena-suave); font-size: 0.95rem; line-height: 1.7;
    }
    .caso__proceso li::marker { font-family: var(--mono); color: var(--gray-medium); font-size: 0.85em; }

    .caso__decision { border-left: 3px solid var(--coral); padding-left: 1.4rem; }

    .caso__resultados { list-style: none; display: grid; gap: 0.7rem; }
    .caso__resultados li {
      border-bottom: 1px solid var(--linea);
      padding: 0.8rem 0; color: var(--text-primary);
      font-size: 0.95rem;
    }

    .caso__next {
      display: flex; align-items: center; gap: 1.5rem;
      margin-top: 3rem; padding: 1.4rem;
      background: var(--white);
      border: 1px solid var(--linea);
      transition: border-color var(--duration-base) var(--ease-out);
    }
    .caso__next:hover { border-color: var(--text-primary); }
    .caso__next-thumb {
      width: 120px; height: 90px; object-fit: cover;
      border-radius: var(--radius-lg); flex-shrink: 0;
      background: var(--gray-light);
    }
    .caso__next-text { display: block; min-width: 0; }
    .caso__next-title {
      display: block; font-family: var(--display);
      font-size: 1.15rem; color: var(--arena); margin-top: 0.4rem;
    }
    @media (max-width: 520px) { .caso__next { flex-direction: column; align-items: flex-start; } }
  `]
})
export class CaseComponent {
  /** Imágenes cuyo archivo no existe todavía: se muestra su espacio. */
  fallo = new Set<string>();
  private route = inject(ActivatedRoute);
  i18n = inject(TranslateService);

  private slug = toSignal(
    this.route.paramMap.pipe(map(params => {
      window.scrollTo(0, 0);
      this.fallo.clear();
      return params.get('slug');
    }))
  );

  constructor() {
    // El contenido llega async del i18n y cambia la altura de la
    // página: sin refrescar, los ScrollTrigger de los reveals quedan
    // con posiciones viejas y algunas secciones nunca aparecen.
    effect(() => {
      this.caso();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }

  marcarFallo(src: string): void {
    this.fallo.add(src);
  }

  /** Se recalcula al cambiar de ruta O de idioma. */
  caso = computed(() => this.i18n.cases().find(c => c.slug === this.slug()));

  /** Las 7 rutas del caso, tal cual están en la llave "images". */
  imgs = computed(() => this.project(this.slug())?.images as
    { portada?: string; banner?: string; cuadrada?: string; grid?: string[] } | undefined);

  private project(slug: string | null | undefined): any {
    if (!slug) { return undefined; }
    const projects = this.i18n.t('projects');
    return Array.isArray(projects) ? projects.find((x: any) => x.slug === slug) : undefined;
  }

  siguiente = computed(() => {
    const cases = this.i18n.cases();
    const c = this.caso();
    if (!c || cases.length === 0) { return undefined; }
    const i = cases.findIndex(x => x.slug === c.slug);
    return cases[(i + 1) % cases.length];
  });

  /** Miniatura del siguiente caso: la misma imagen del grid del home. */
  nextThumb = computed(() => {
    const s = this.siguiente();
    if (!s) { return undefined; }
    return this.project(s.slug)?.img ?? s.cover?.src;
  });
}

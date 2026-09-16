import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';

/**
 * Página de caso con diagramación editorial: portada grande, columna
 * de lectura con barra lateral de datos e imágenes de la galería
 * intercaladas a todo lo ancho entre secciones.
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
          <p class="eyebrow">{{ c.ticketNo }} · {{ c.period }}</p>
          <h1>{{ c.title }}</h1>
        </header>

        <!-- Portada a todo el ancho del contenedor -->
        @if (portada(); as src) {
          @if (!imgError.has(src)) {
            <figure class="caso__hero">
              <img [src]="src" [alt]="c.cover?.alt || c.title" (error)="imgError.add(src)" />
            </figure>
          }
        }

        <!-- Columna de lectura + barra lateral de datos -->
        <div class="caso__cols">
          <div class="caso__main">
            <section class="caso__tldr" appReveal>
              <p class="eyebrow">{{ 'cases.labels.summary' | t }}</p>
              <p>{{ c.tldr }}</p>
            </section>

            <section appReveal>
              <h2>{{ 'cases.labels.context' | t }}</h2>
              <p>{{ c.context }}</p>
            </section>

            <section appReveal>
              <h2>{{ 'cases.labels.problem' | t }}</h2>
              <p>{{ c.problem }}</p>
            </section>
          </div>

          <aside class="caso__aside">
            <div>
              <strong>{{ 'cases.labels.role' | t }}</strong>
              <span>{{ c.role }}</span>
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

        <section class="caso__col" appReveal>
          <h2>{{ 'cases.labels.process' | t }}</h2>
          <ol class="caso__proceso">
            @for (paso of c.process; track $index) {
              <li>{{ paso }}</li>
            }
          </ol>
        </section>

        <!-- Primera imagen de la galería, a todo lo ancho -->
        @if (galeria()[0]; as img) {
          @if (!imgError.has(img.src)) {
            <figure class="caso__figura caso__figura--ancha" appReveal>
              <img [src]="img.src" [alt]="img.caption" loading="lazy" (error)="imgError.add(img.src)" />
              <figcaption>{{ img.caption }}</figcaption>
            </figure>
          }
        }

        <section class="caso__col caso__decision" appReveal>
          <h2>{{ 'cases.labels.decision' | t }}</h2>
          <p>{{ c.keyDecision }}</p>
        </section>

        <!-- Segunda imagen de la galería, a todo lo ancho -->
        @if (galeria()[1]; as img) {
          @if (!imgError.has(img.src)) {
            <figure class="caso__figura caso__figura--ancha" appReveal>
              <img [src]="img.src" [alt]="img.caption" loading="lazy" (error)="imgError.add(img.src)" />
              <figcaption>{{ img.caption }}</figcaption>
            </figure>
          }
        }

        <section class="caso__col" appReveal>
          <h2>{{ 'cases.labels.results' | t }}</h2>
          <ul class="caso__resultados">
            @for (r of c.results; track $index) {
              <li>{{ r }}</li>
            }
          </ul>
        </section>

        <!-- Resto de la galería en rejilla -->
        @if (resto().length) {
          <div class="caso__galeria">
            @for (img of resto(); track img.src) {
              @if (!imgError.has(img.src)) {
                <figure class="caso__figura" appReveal>
                  <img [src]="img.src" [alt]="img.caption" loading="lazy" (error)="imgError.add(img.src)" />
                  <figcaption>{{ img.caption }}</figcaption>
                </figure>
              }
            }
          </div>
        }

        <section class="caso__col" appReveal>
          <h2>{{ 'cases.labels.learning' | t }}</h2>
          <p>{{ c.learning }}</p>
        </section>

        @if (siguiente(); as s) {
          <a class="caso__next" [routerLink]="['/caso', s.slug]">
            @if (nextThumb() && !thumbError) {
              <img class="caso__next-thumb" [src]="nextThumb()" alt="" loading="lazy" (error)="thumbError = true" />
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
    .caso__head h1 {
      font-size: clamp(2rem, 4.2vw, 3.2rem);
      line-height: 1.08; margin: 1rem 0 2rem;
      max-width: 22ch;
    }
    @keyframes caseIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .caso__head { animation: none; } }

    /* Portada grande */
    .caso__hero { margin: 0 0 3rem; }
    .caso__hero img {
      width: 100%; aspect-ratio: 16 / 9; object-fit: cover;
      display: block; border-radius: var(--radius-lg);
      background: var(--gray-light);
    }

    /* Texto + barra lateral de datos */
    .caso__cols {
      display: grid; grid-template-columns: minmax(0, 1fr) 240px;
      gap: 3.5rem; align-items: start;
      margin-bottom: 3rem;
    }
    .caso__main { max-width: 68ch; }
    .caso__aside {
      display: grid; gap: 1.8rem;
      position: sticky; top: 6rem;
      font-size: 0.85rem; color: var(--arena-suave);
    }
    .caso__aside strong {
      display: block; font-family: var(--mono); font-weight: 500;
      font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--gray-medium); margin-bottom: 0.5rem;
    }
    .caso__aside ul { list-style: none; display: grid; gap: 0.2rem; }
    .caso__aside-metric {
      display: block; font-family: var(--mono); font-weight: 500;
      font-size: 1.6rem; letter-spacing: -0.02em;
      color: var(--purple-500); margin-bottom: 0.2rem;
    }
    @media (max-width: 860px) {
      .caso__cols { grid-template-columns: 1fr; gap: 2.5rem; }
      .caso__aside { position: static; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    }

    /* Columna de lectura para las secciones a ancho completo */
    .caso__col { max-width: 68ch; }
    section { margin: 3rem 0; }
    section h2 { font-size: 1.4rem; margin-bottom: 0.9rem; }
    section p { color: var(--arena-suave); }

    .caso__tldr {
      background: var(--gray-light);
      border-left: 3px solid var(--cenote);
      padding: 1.6rem 1.8rem; margin: 0 0 2.5rem;
    }
    .caso__tldr p:last-child { margin-top: 0.6rem; }

    .caso__proceso { padding-left: 1.2rem; display: grid; gap: 0.8rem; color: var(--arena-suave); }
    .caso__proceso li::marker { font-family: var(--mono); color: var(--teal-900); }

    /* Imágenes: anchas entre secciones y en rejilla al final */
    .caso__figura { margin: 0; }
    .caso__figura img {
      width: 100%; object-fit: cover; display: block;
      border-radius: var(--radius-lg);
      background: var(--gray-light);
    }
    .caso__figura--ancha { margin: 3rem 0; }
    .caso__figura--ancha img { aspect-ratio: 16 / 9; }
    .caso__galeria {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem;
      margin: 3rem 0;
    }
    .caso__galeria .caso__figura img { aspect-ratio: 4 / 3; }
    /* Una sola imagen suelta ocupa el ancho completo en vez de media columna */
    .caso__galeria .caso__figura:only-child { grid-column: 1 / -1; }
    .caso__galeria .caso__figura:only-child img { aspect-ratio: 16 / 9; }
    @media (max-width: 700px) { .caso__galeria { grid-template-columns: 1fr; } }
    .caso__figura figcaption {
      font-size: 0.78rem; color: var(--arena-suave);
      font-family: var(--mono); margin-top: 0.6rem;
    }

    .caso__decision { border-left: 3px solid var(--coral); padding-left: 1.5rem; }

    .caso__resultados { list-style: none; display: grid; gap: 0.7rem; }
    .caso__resultados li {
      border-bottom: 1px solid var(--linea);
      padding: 0.8rem 0; color: var(--text-primary);
      font-size: 0.95rem;
    }

    .caso__next {
      display: flex; align-items: center; gap: 1.5rem;
      margin-top: 4rem; padding: 1.4rem;
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
  imgError = new Set<string>();
  thumbError = false;
  private route = inject(ActivatedRoute);
  i18n = inject(TranslateService);

  private slug = toSignal(
    this.route.paramMap.pipe(map(params => {
      window.scrollTo(0, 0);
      this.thumbError = false;
      return params.get('slug');
    }))
  );

  /** Se recalcula al cambiar de ruta O de idioma. */
  caso = computed(() => this.i18n.cases().find(c => c.slug === this.slug()));

  /** Portada: la imagen del grid de proyectos y, si no hay, la del caso. */
  portada = computed(() => {
    const c = this.caso();
    if (!c) { return undefined; }
    const projects = this.i18n.t('projects');
    const p = Array.isArray(projects) ? projects.find((x: any) => x.slug === c.slug) : undefined;
    return p?.img ?? c.cover?.src;
  });

  galeria = computed(() => this.caso()?.gallery ?? []);

  /** Las que no se muestran intercaladas van a la rejilla final. */
  resto = computed(() => this.galeria().slice(2));

  siguiente = computed(() => {
    const cases = this.i18n.cases();
    const c = this.caso();
    if (!c || cases.length === 0) { return undefined; }
    const i = cases.findIndex(x => x.slug === c.slug);
    return cases[(i + 1) % cases.length];
  });

  /** Miniatura del siguiente caso: la imagen del grid de proyectos
      (llave "projects") y, si no hay, la portada del caseList. */
  nextThumb = computed(() => {
    const s = this.siguiente();
    if (!s) { return undefined; }
    const projects = this.i18n.t('projects');
    const p = Array.isArray(projects) ? projects.find((x: any) => x.slug === s.slug) : undefined;
    return p?.img ?? s.cover?.src;
  });
}

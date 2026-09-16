import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';

/**
 * Página de caso con diagramación editorial. Cada caso usa 7 imágenes
 * nombradas con las siglas del proyecto (llave "code" de projects):
 *   <CODE>-portada · <CODE>-banner · <CODE>-cuadrada · <CODE>-1..4
 * viven en assets/img/CASOS/ y se intentan como .png y luego .jpg.
 * Si un archivo no existe, su bloque simplemente no se muestra.
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

        <!-- 1 · PORTADA a todo el ancho -->
        @if (img('portada'); as base) {
          @if (ext(base) !== 'none') {
            <figure class="caso__portada">
              <img [src]="base + '.' + ext(base)" [alt]="c.title" (error)="onImgError(base)" />
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

        <!-- 2 · BANNER apaisado -->
        @if (img('banner'); as base) {
          @if (ext(base) !== 'none') {
            <figure class="caso__banner" appReveal>
              <img [src]="base + '.' + ext(base)" [alt]="c.title" loading="lazy" (error)="onImgError(base)" />
            </figure>
          }
        }

        <section class="caso__col caso__decision" appReveal>
          <h2>{{ 'cases.labels.decision' | t }}</h2>
          <p>{{ c.keyDecision }}</p>
        </section>

        <!-- 3 · CUADRADA -->
        @if (img('cuadrada'); as base) {
          @if (ext(base) !== 'none') {
            <figure class="caso__cuadrada" appReveal>
              <img [src]="base + '.' + ext(base)" [alt]="c.title" loading="lazy" (error)="onImgError(base)" />
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

        <!-- 4 · REJILLA 1-4 -->
        <div class="caso__galeria">
          @for (n of [1, 2, 3, 4]; track n) {
            @if (img(n); as base) {
              @if (ext(base) !== 'none') {
                <figure class="caso__figura" appReveal>
                  <img [src]="base + '.' + ext(base)" [alt]="c.title" loading="lazy" (error)="onImgError(base)" />
                </figure>
              }
            }
          }
        </div>

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

    /* Imágenes: cada una con su proporción */
    figure { margin: 0; }
    figure img {
      width: 100%; object-fit: cover; display: block;
      border-radius: var(--radius-lg);
      background: var(--gray-light);
    }
    .caso__portada { margin-bottom: 3rem; }
    .caso__portada img { aspect-ratio: 21 / 9; }
    .caso__banner { margin: 3rem 0; }
    .caso__banner img { aspect-ratio: 16 / 9; }
    .caso__cuadrada { margin: 3rem auto; max-width: 720px; }
    .caso__cuadrada img { aspect-ratio: 1 / 1; }
    .caso__galeria {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem;
      margin: 3rem 0;
    }
    .caso__galeria img { aspect-ratio: 4 / 3; }
    @media (max-width: 700px) {
      .caso__galeria { grid-template-columns: 1fr; }
      .caso__portada img { aspect-ratio: 16 / 9; }
    }

    /* Texto + barra lateral de datos */
    .caso__cols {
      display: grid; grid-template-columns: minmax(0, 1fr) 240px;
      gap: 3.5rem; align-items: start;
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
  thumbError = false;
  /** Extensión resuelta por imagen: se intenta .png y luego .jpg. */
  private exts = new Map<string, 'png' | 'jpg' | 'none'>();
  private route = inject(ActivatedRoute);
  i18n = inject(TranslateService);

  private slug = toSignal(
    this.route.paramMap.pipe(map(params => {
      window.scrollTo(0, 0);
      this.thumbError = false;
      this.exts.clear();
      return params.get('slug');
    }))
  );

  /** Se recalcula al cambiar de ruta O de idioma. */
  caso = computed(() => this.i18n.cases().find(c => c.slug === this.slug()));

  /** Siglas del proyecto (llave "code" en projects). */
  private code = computed(() => this.project(this.slug())?.code);

  /** Ruta base de una imagen del caso, sin extensión. */
  img(name: string | number): string | undefined {
    const code = this.code();
    return code ? `assets/img/CASOS/${code}-${name}` : undefined;
  }

  ext(base: string): 'png' | 'jpg' | 'none' {
    return this.exts.get(base) ?? 'png';
  }

  onImgError(base: string): void {
    this.exts.set(base, this.ext(base) === 'png' ? 'jpg' : 'none');
  }

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

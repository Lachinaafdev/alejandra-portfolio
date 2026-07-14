import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { ImageRevealDirective, ParallaxDirective } from '../anim/scroll-animations';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [RouterLink, TranslatePipe, RevealDirective, ImageRevealDirective, ParallaxDirective],
  template: `
    @if (caso(); as c) {
      <article class="wrap caso">
        <a routerLink="/" class="caso__back">{{ 'cases.back' | t }}</a>

        <header class="caso__head">
          <p class="eyebrow">{{ c.ticketNo }} · {{ c.period }}</p>
          <h1>{{ c.title }}</h1>
          <div class="caso__meta">
            <div><strong>{{ 'cases.labels.role' | t }}</strong>{{ c.role }}</div>
            <div><strong>{{ 'cases.labels.tools' | t }}</strong>{{ c.tools.join(' · ') }}</div>
            <div class="caso__metric">
              <strong>{{ 'cases.labels.metric' | t }}</strong>
              <span>{{ c.metric.value }}</span> {{ c.metric.label }}
            </div>
          </div>
        </header>

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

        @if (c.gallery?.length) {
          <section appReveal>
            <h2>{{ 'gallery.title' | t }}</h2>
            <div class="caso__galeria">
              @for (img of c.gallery; track img.src) {
                <figure class="caso__figura">
                  @if (!imgError.has(img.src)) {
                    <span class="caso__figura-frame" appImageReveal
                          [revealDirection]="$index % 2 === 0 ? 'vertical' : 'diagonal'">
                      <img [src]="img.src" [alt]="img.caption" loading="lazy" appParallax [parallaxY]="18" (error)="imgError.add(img.src)" />
                    </span>
                  } @else {
                    <div class="caso__figura-placeholder">
                      <span>{{ 'gallery.missing' | t }}</span>
                      <code>src/{{ img.src }}</code>
                    </div>
                  }
                  <figcaption>{{ img.caption }}</figcaption>
                </figure>
              }
            </div>
          </section>
        }

        <section class="caso__decision" appReveal>
          <h2>{{ 'cases.labels.decision' | t }}</h2>
          <p>{{ c.keyDecision }}</p>
        </section>

        <section appReveal>
          <h2>{{ 'cases.labels.results' | t }}</h2>
          <ul class="caso__resultados">
            @for (r of c.results; track $index) {
              <li>{{ r }}</li>
            }
          </ul>
        </section>

        <section appReveal>
          <h2>{{ 'cases.labels.learning' | t }}</h2>
          <p>{{ c.learning }}</p>
        </section>

        @if (siguiente(); as s) {
          <a class="caso__next" [routerLink]="['/caso', s.slug]">
            <span class="eyebrow">{{ 'cases.next' | t }}</span>
            <span class="caso__next-title">{{ s.title }} →</span>
          </a>
        }
      </article>
    }
  `,
  styles: [`
    .caso { padding-top: 4rem; max-width: 780px; }
    .caso__back { font-family: var(--mono); font-size: 0.82rem; }
    .caso__head h1 { font-size: clamp(2.1rem, 5vw, 3.3rem); line-height: 1.08; margin: 1rem 0 2rem; }
    .caso__head { animation: caseIn 0.6s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
    @keyframes caseIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .caso__head { animation: none; } }

    .caso__meta {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem; padding: 1.5rem 0; border-top: 1px solid var(--linea);
      border-bottom: 1px solid var(--linea);
      color: var(--arena-suave); font-size: 0.88rem;
    }
    .caso__meta strong {
      display: block; font-family: var(--mono); font-weight: 500;
      font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cenote); margin-bottom: 0.4rem;
    }
    .caso__metric span { font-family: var(--mono); color: var(--coral); font-size: 1.2rem; }

    .caso__tldr {
      background: var(--white); border: 1px solid var(--border);
      border-left: 3px solid var(--teal-700);
      border-radius: var(--radius-md); padding: 1.8rem; margin: 2.5rem 0;
      box-shadow: var(--shadow-sm);
    }
    .caso__tldr p:last-child { margin-top: 0.6rem; }

    section { margin: 2.8rem 0; }
    section h2 { font-size: 1.5rem; margin-bottom: 0.9rem; }
    section p { color: var(--arena-suave); }

    .caso__proceso { padding-left: 1.2rem; display: grid; gap: 0.8rem; color: var(--arena-suave); }
    .caso__proceso li::marker { font-family: var(--mono); color: var(--cenote); }

    .caso__galeria { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .caso__figura { margin: 0; }
    .caso__figura-frame {
      display: block; position: relative;
      aspect-ratio: 4 / 3; overflow: hidden;
      border-radius: var(--radius-md); border: 1px solid var(--border);
    }
    .caso__figura img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
      display: block; will-change: transform;
    }
    .caso__figura-placeholder {
      aspect-ratio: 4 / 3; border: 1px dashed var(--linea); border-radius: 12px;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 1rem;
      color: var(--arena-suave); font-size: 0.7rem; font-family: var(--mono);
    }
    .caso__figura-placeholder code { color: var(--cenote); font-size: 0.64rem; word-break: break-all; }
    .caso__figura figcaption {
      font-size: 0.78rem; color: var(--arena-suave);
      font-family: var(--mono); margin-top: 0.5rem;
    }

    .caso__decision {
      border-left: 3px solid var(--coral);
      padding-left: 1.5rem;
    }

    .caso__resultados { list-style: none; display: grid; gap: 0.7rem; }
    .caso__resultados li {
      background: var(--white);
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 0.8rem 1.1rem; color: var(--text-primary);
      font-size: 0.95rem;
      transition: border-color var(--duration-fast) var(--ease-out),
                  transform var(--duration-fast) var(--ease-out);
    }
    .caso__resultados li:hover { border-color: var(--teal-700); transform: translateX(6px); }

    .caso__next {
      display: block; margin-top: 4rem; padding: 1.8rem;
      background: var(--white);
      border: 1px solid var(--border); border-radius: var(--radius-md);
      transition: border-color var(--duration-base) var(--ease-out),
                  box-shadow var(--duration-base) var(--ease-out),
                  transform var(--duration-base) var(--ease-out);
    }
    .caso__next:hover { border-color: var(--teal-700); box-shadow: var(--shadow-md); transform: translateY(-4px); }
    .caso__next-title {
      display: block; font-family: var(--display);
      font-size: 1.25rem; color: var(--arena); margin-top: 0.4rem;
    }
  `]
})
export class CaseComponent {
  imgError = new Set<string>();
  private route = inject(ActivatedRoute);
  i18n = inject(TranslateService);

  private slug = toSignal(
    this.route.paramMap.pipe(map(params => {
      window.scrollTo(0, 0);
      return params.get('slug');
    }))
  );

  /** Se recalcula al cambiar de ruta O de idioma. */
  caso = computed(() => this.i18n.cases().find(c => c.slug === this.slug()));

  siguiente = computed(() => {
    const cases = this.i18n.cases();
    const c = this.caso();
    if (!c || cases.length === 0) { return undefined; }
    const i = cases.findIndex(x => x.slug === c.slug);
    return cases[(i + 1) % cases.length];
  });
}

import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../data/cases';
import { TranslatePipe } from '../i18n/i18n';
import { ParallaxDirective } from '../motion/motion';

/**
 * Bloque de caso plano full-width: fondo con gradiente propio
 * (cíclico navy / deep / teal) con parallax, texto blanco
 * abajo-izquierda y flecha ↗ en círculo arriba-derecha.
 * Conserva toda la info del ticket: nº de caso y fechas, título,
 * rol, métrica destacada y CTA.
 */
@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe, ParallaxDirective],
  template: `
    <a class="work" [routerLink]="['/caso', caso.slug]">
      <span class="work__bg" appParallax aria-hidden="true"></span>
      <span class="work__arrow" aria-hidden="true">↗</span>
      <div class="work__body">
        <span class="work__eyebrow">{{ caso.ticketNo }} · {{ caso.period }}</span>
        <h3>{{ caso.title }}</h3>
        <p class="work__role">{{ caso.role }}</p>
        <div class="work__foot">
          <span class="work__metric"><b>{{ caso.metric.value }}</b> {{ caso.metric.label }}</span>
          <span class="work__cta">{{ 'cases.cta' | t }}</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    :host { display: block; }
    .work {
      position: relative;
      display: flex; align-items: flex-end;
      min-height: clamp(340px, 55vh, 520px);
      overflow: hidden;
      color: #fff;
      border-radius: 0;
    }

    /* Fondo sobredimensionado: absorbe el parallax sin dejar huecos */
    .work__bg {
      position: absolute; inset: -12% 0; height: 124%;
      will-change: transform;
      transition: scale 0.6s var(--ease-out);
    }
    .work:hover .work__bg { scale: 1.04; }
    :host(:nth-child(3n + 1)) .work__bg {
      background:
        radial-gradient(ellipse 90% 70% at 78% 18%, rgba(255, 255, 255, 0.18), transparent 60%),
        linear-gradient(135deg, var(--navy), #10193a);
    }
    :host(:nth-child(3n + 2)) .work__bg {
      background:
        radial-gradient(ellipse 90% 70% at 78% 18%, rgba(255, 255, 255, 0.16), transparent 60%),
        linear-gradient(135deg, var(--deep), #06181e);
    }
    :host(:nth-child(3n)) .work__bg {
      background:
        radial-gradient(ellipse 90% 70% at 78% 18%, rgba(255, 255, 255, 0.2), transparent 60%),
        linear-gradient(135deg, var(--teal-700), #085249);
    }

    .work__arrow {
      position: absolute; top: 2rem; right: 2rem; z-index: 1;
      width: 3rem; height: 3rem; border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      display: grid; place-items: center;
      font-size: 1.1rem; color: #fff;
      transition: translate 0.35s var(--ease-out), background 0.35s var(--ease-out);
    }
    .work:hover .work__arrow { translate: 4px -4px; background: rgba(255, 255, 255, 0.12); }

    .work__body {
      position: relative; z-index: 1;
      width: 100%;
      padding: clamp(1.6rem, 4vw, 3rem);
      display: flex; flex-direction: column; gap: 0.4rem;
    }
    .work__eyebrow {
      font-family: var(--mono); font-size: 0.7rem; font-weight: 500;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: rgba(255, 255, 255, 0.75);
    }
    .work__body h3 {
      color: #fff;
      font-size: clamp(1.7rem, 4vw, 3rem);
      letter-spacing: -0.03em;
      margin: 0.4rem 0 0.2rem;
      max-width: 22ch;
    }
    .work__role { color: rgba(255, 255, 255, 0.78); font-size: 0.92rem; }
    .work__foot {
      display: flex; flex-wrap: wrap; align-items: baseline;
      justify-content: space-between; gap: 1rem;
      margin-top: 1.4rem; padding-top: 1.1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.22);
    }
    .work__metric {
      font-family: var(--mono); font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.85);
    }
    .work__metric b { font-size: 1.7rem; font-weight: 500; color: #fff; margin-right: 0.5rem; }
    .work__cta {
      font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
      color: #fff;
      transition: translate 0.25s var(--ease-out);
    }
    .work:hover .work__cta { translate: 4px 0; }
  `]
})
export class TicketCardComponent {
  @Input({ required: true }) caso!: CaseStudy;
}

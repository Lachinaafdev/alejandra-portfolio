import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../data/cases';
import { TranslatePipe } from '../i18n/i18n';
import { ParallaxDirective, CaseEntranceDirective } from '../motion/motion';

/**
 * Card de caso: bloque plano full-width con fondo de gradiente
 * propio (cíclico navy / deep / teal), texto blanco abajo-izquierda
 * y flecha en círculo arriba-derecha. El fondo hace parallax al
 * hacer scroll y cada card entra con una animación distinta según
 * su índice (cortina / desliza / zoom-out).
 */
@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe, ParallaxDirective, CaseEntranceDirective],
  template: `
    <a class="card" [class]="'card--' + (index % 3)" [routerLink]="['/caso', caso.slug]" [appCaseEntrance]="index">
      <div class="work__bg" appParallax aria-hidden="true"></div>
      <span class="card__arrow" aria-hidden="true">↗</span>
      <div class="card__content">
        <span class="card__eyebrow">{{ caso.ticketNo }} · {{ caso.period }}</span>
        <h3>{{ caso.title }}</h3>
        <p class="card__role">{{ caso.role }}</p>
        <div class="card__foot">
          <span class="card__metric">
            <strong>{{ caso.metric.value }}</strong> {{ caso.metric.label }}
          </span>
          <span class="card__cta">{{ 'cases.cta' | t }}</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card {
      position: relative;
      display: flex; align-items: flex-end;
      min-height: clamp(340px, 55vh, 520px);
      border-radius: 0;
      overflow: hidden;
      color: #fff;
    }

    /* Fondo absoluto sobredimensionado para el parallax (±6%).
       El gradiente vive en el ::before para que el hover (scale)
       no pelee con el transform inline que pone GSAP. */
    .work__bg {
      position: absolute; inset: -12% 0; height: 124%;
      z-index: 0;
    }
    .work__bg::before {
      content: '';
      position: absolute; inset: 0;
      transition: transform 0.6s var(--ease-out);
    }
    .card:hover .work__bg::before { transform: scale(1.04); }

    .card--0 .work__bg::before {
      background:
        radial-gradient(ellipse 60% 55% at 72% 18%, rgba(255, 255, 255, 0.22), transparent 60%),
        linear-gradient(135deg, #22336B 0%, var(--navy) 55%, #101A3D 100%);
    }
    .card--1 .work__bg::before {
      background:
        radial-gradient(ellipse 60% 55% at 28% 15%, rgba(255, 255, 255, 0.18), transparent 60%),
        linear-gradient(135deg, #14444F 0%, var(--deep) 55%, #06181E 100%);
    }
    .card--2 .work__bg::before {
      background:
        radial-gradient(ellipse 60% 55% at 75% 80%, rgba(255, 255, 255, 0.2), transparent 60%),
        linear-gradient(135deg, #12A594 0%, var(--cenote) 55%, #085248 100%);
    }

    .card__arrow {
      position: absolute; top: 1.4rem; right: 1.4rem; z-index: 2;
      width: 46px; height: 46px;
      display: grid; place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.55);
      border-radius: 50%;
      font-size: 1.25rem; line-height: 1; color: #fff;
      transition: transform var(--duration-base) var(--ease-out),
                  background var(--duration-base) var(--ease-out);
    }
    .card:hover .card__arrow { transform: translate(4px, -4px); background: rgba(255, 255, 255, 0.12); }

    .card__content {
      position: relative; z-index: 1;
      width: 100%;
      padding: clamp(1.4rem, 2.2vw, 2rem);
    }
    .card__eyebrow {
      font-family: var(--mono); font-size: 0.7rem; font-weight: 500;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: rgba(255, 255, 255, 0.75);
    }
    .card__content h3 {
      font-family: var(--display); font-weight: 600;
      font-size: clamp(1.35rem, 1.8vw, 1.75rem);
      letter-spacing: -0.03em; line-height: 1.12;
      color: #fff;
      margin: 0.8rem 0 0.5rem;
    }
    .card__role { color: rgba(255, 255, 255, 0.75); font-size: 0.9rem; }

    .card__foot {
      display: flex; flex-wrap: wrap; align-items: flex-end;
      justify-content: space-between; gap: 1rem;
      margin-top: 1.6rem;
    }
    .card__metric {
      font-family: var(--mono); font-size: 0.72rem; line-height: 1.4;
      color: rgba(255, 255, 255, 0.85); max-width: 26ch;
    }
    .card__metric strong {
      display: block;
      font-weight: 500; font-size: clamp(1.5rem, 2vw, 2rem);
      letter-spacing: -0.02em; color: #fff;
    }
    .card__cta {
      font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
      color: #fff; white-space: nowrap;
      border-bottom: 1px solid rgba(255, 255, 255, 0.55);
      padding-bottom: 0.2rem;
      transition: border-color var(--duration-fast) var(--ease-out);
    }
    .card:hover .card__cta { border-color: #fff; }

    @media (max-width: 560px) {
      .card__arrow { top: 1.2rem; right: 1.2rem; width: 44px; height: 44px; }
    }
  `]
})
export class TicketCardComponent {
  @Input({ required: true }) caso!: CaseStudy;
  @Input() index = 0;
}

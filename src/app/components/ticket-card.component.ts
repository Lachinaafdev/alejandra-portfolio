import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../data/cases';
import { TranslatePipe } from '../i18n/i18n';
import { ImageRevealDirective, ParallaxDirective } from '../anim/scroll-animations';

/**
 * Card de proyecto: la imagen de portada es la protagonista y
 * debajo va lo esencial — caso, título, rol y el dato clave como
 * chip de color. Sube tu imagen a la ruta indicada en el JSON
 * (cover.src); mientras no exista se muestra un placeholder.
 */
@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe, ImageRevealDirective, ParallaxDirective],
  template: `
    <a class="card" [routerLink]="['/caso', caso.slug]">
      <div class="card__media" appImageReveal>
        @if (caso.cover && !coverError) {
          <img [src]="caso.cover.src" [alt]="caso.cover.alt" loading="lazy" appParallax (error)="coverError = true" />
        } @else {
          <div class="card__placeholder">
            <span>{{ 'gallery.missing' | t }}</span>
            <code>src/{{ caso.cover?.src || 'assets/img/' + caso.slug + '-cover.jpg' }}</code>
          </div>
        }
      </div>
      <div class="card__body">
        <span class="eyebrow">{{ caso.ticketNo }} · {{ caso.period }}</span>
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
      display: flex; flex-direction: column;
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      overflow: hidden;
      position: relative;
      height: 100%;
      transition: transform var(--duration-base) var(--ease-out),
                  border-color var(--duration-base) var(--ease-out),
                  box-shadow var(--duration-base) var(--ease-out);
    }
    /* Barra de acento teal → purple: se dibuja al hover */
    .card::after {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--teal-700), var(--purple-500));
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-slow) var(--ease-out);
      z-index: 1;
    }
    .card:hover { transform: translateY(-8px); border-color: var(--teal-700); box-shadow: var(--shadow-md); }
    .card:hover::after { transform: scaleX(1); }

    /* La imagen manda: proporción amplia y protagonismo total */
    .card__media {
      position: relative;
      aspect-ratio: 4 / 3;
      background: var(--gray-light);
      overflow: hidden;
    }
    /* El zoom lo maneja GSAP (parallax + escala); sin transition CSS
       en transform para no pelear con el scrub */
    .card__media img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
      will-change: transform;
    }
    .card__placeholder {
      position: absolute; inset: 12px;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-sm);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 0.8rem;
      color: var(--cocoa-500); font-size: 0.68rem; font-family: var(--mono);
    }
    .card__placeholder code { color: var(--teal-700); font-size: 0.62rem; word-break: break-all; }

    .card__body { display: flex; flex-direction: column; flex: 1; padding: 1.5rem 1.5rem 1.4rem; }
    .card__body .eyebrow { font-size: 0.66rem; color: var(--cocoa-500); }
    .card__body h3 { font-size: 1.22rem; letter-spacing: -0.3px; line-height: 1.25; margin: 0.6rem 0 0.45rem; }
    .card__role { color: var(--text-secondary); font-size: 0.85rem; }

    .card__foot {
      display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;
      margin-top: auto; padding-top: 1.1rem;
    }
    /* El dato clave como chip de color: cada caso con su tono */
    .card__metric {
      font-family: var(--mono); font-size: 0.7rem; line-height: 1.35;
      border-radius: 999px; padding: 0.35rem 0.85rem;
    }
    .card__metric strong { font-weight: 700; font-size: 0.82rem; }
    .card__cta {
      font-family: var(--mono); font-size: 0.75rem; font-weight: 500;
      color: var(--teal-700); white-space: nowrap;
      transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
    }
    .card:hover .card__cta { color: var(--purple-500); transform: translateX(4px); }

    /* Rotación de la paleta por caso: teal, purple, green glow */
    :host(:nth-child(3n + 1)) .card__metric { background: var(--teal-100); color: var(--teal-900); }
    :host(:nth-child(3n + 1)) .card__placeholder { background: var(--teal-100); border-color: rgba(42, 143, 157, 0.3); }
    :host(:nth-child(3n + 2)) .card__metric { background: var(--purple-100); color: var(--purple-700); }
    :host(:nth-child(3n + 2)) .card__placeholder { background: var(--purple-100); border-color: rgba(122, 79, 163, 0.3); }
    :host(:nth-child(3n)) .card__metric { background: var(--green-glow-light); color: var(--green-glow-dark); }
    :host(:nth-child(3n)) .card__placeholder { background: var(--green-glow-light); border-color: rgba(154, 166, 0, 0.35); }
  `]
})
export class TicketCardComponent {
  @Input({ required: true }) caso!: CaseStudy;
  coverError = false;
}

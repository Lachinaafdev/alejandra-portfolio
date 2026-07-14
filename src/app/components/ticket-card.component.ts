import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CaseStudy } from '../data/cases';
import { TranslatePipe } from '../i18n/i18n';

/**
 * Firma visual del portafolio: cada caso de estudio es un "ticket de tour".
 * Incluye espacio de imagen de portada: sube tu imagen a la ruta indicada
 * en el JSON (cover.src) y aparecerá automáticamente; mientras no exista,
 * se muestra un placeholder con la ruta esperada.
 */
@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <a class="ticket" [routerLink]="['/caso', caso.slug]">
      <div class="ticket__media">
        @if (caso.cover && !coverError) {
          <img [src]="caso.cover.src" [alt]="caso.cover.alt" loading="lazy" (error)="coverError = true" />
        } @else {
          <div class="ticket__placeholder">
            <span>{{ 'gallery.missing' | t }}</span>
            <code>src/{{ caso.cover?.src || 'assets/img/' + caso.slug + '-cover.jpg' }}</code>
          </div>
        }
      </div>
      <div class="ticket__body">
        <span class="eyebrow">{{ caso.ticketNo }} · {{ caso.period }}</span>
        <h3>{{ caso.title }}</h3>
        <p class="ticket__role">{{ caso.role }}</p>
      </div>
      <div class="ticket__stub">
        <span class="ticket__value">{{ caso.metric.value }}</span>
        <span class="ticket__label">{{ caso.metric.label }}</span>
        <span class="ticket__cta">{{ 'cases.cta' | t }}</span>
      </div>
    </a>
  `,
  styles: [`
    .ticket {
      display: grid;
      grid-template-columns: 260px 1fr 220px;
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      overflow: hidden;
      transition: transform var(--duration-base) var(--ease-out),
                  border-color var(--duration-base) var(--ease-out),
                  box-shadow var(--duration-base) var(--ease-out);
      position: relative;
    }
    /* Barra de acento superior teal → purple: se dibuja al hover */
    .ticket::after {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--teal-700), var(--purple-500));
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-slow) var(--ease-out);
      z-index: 1;
    }
    .ticket:hover { transform: translateY(-8px); border-color: var(--teal-700); box-shadow: var(--shadow-md); }
    .ticket:hover::after { transform: scaleX(1); }

    .ticket__media { position: relative; min-height: 190px; background: var(--wax-paper); }
    .ticket__media img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.5s var(--ease-out);
    }
    .ticket:hover .ticket__media img { transform: scale(1.04); }
    .ticket__placeholder {
      position: absolute; inset: 10px;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-sm);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 0.8rem;
      color: var(--cocoa-500); font-size: 0.68rem; font-family: var(--mono);
    }
    .ticket__placeholder code { color: var(--teal-700); font-size: 0.62rem; word-break: break-all; }

    .ticket__body { padding: 2rem; }
    .ticket__body h3 { font-size: 1.5rem; letter-spacing: -0.5px; margin: 0.7rem 0 0.6rem; }
    .ticket__body .eyebrow { font-size: 0.68rem; color: var(--cocoa-500); }
    .ticket__role { color: var(--text-secondary); font-size: 0.9rem; }
    .ticket__role::before {
      content: '';
      display: inline-block; width: 7px; height: 7px;
      background: var(--teal-300); border-radius: 2px;
      margin-right: 0.5rem; vertical-align: 1px;
    }

    /* Talón perforado del ticket */
    .ticket__stub {
      border-left: 2px dashed var(--border-strong);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.25rem;
      position: relative;
      background: var(--gray-light);
      transition: filter var(--duration-base) var(--ease-out);
    }
    .ticket:hover .ticket__stub { filter: saturate(1.15); }
    .ticket__stub::before, .ticket__stub::after {
      content: '';
      position: absolute;
      left: -11px;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: var(--mar-profundo);
      border: 1px solid var(--border-strong);
    }
    .ticket__stub::before { top: -11px; }
    .ticket__stub::after { bottom: -11px; }

    .ticket__value {
      font-family: var(--display);
      font-size: 2.3rem;
      font-weight: 700;
      letter-spacing: -1px;
      color: var(--purple-500);
    }
    .ticket__label { font-size: 0.78rem; color: var(--gray-dark); line-height: 1.4; }
    .ticket__cta {
      margin-top: 0.9rem;
      font-family: var(--mono);
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--teal-700);
      transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
    }
    .ticket:hover .ticket__cta { color: var(--purple-500); transform: translateX(4px); }

    /* Cada caso tiene su propio campo de color: teal, purple, green */
    :host(:nth-child(3n + 1)) .ticket__stub { background: var(--teal-100); border-left-color: rgba(42, 143, 157, 0.3); }
    :host(:nth-child(3n + 1)) .ticket__value { color: var(--teal-900); }
    :host(:nth-child(3n + 1)) .ticket__media { background: var(--teal-100); }
    :host(:nth-child(3n + 2)) .ticket__stub { background: var(--purple-100); border-left-color: rgba(122, 79, 163, 0.3); }
    :host(:nth-child(3n + 2)) .ticket__value { color: var(--purple-700); }
    :host(:nth-child(3n + 2)) .ticket__media { background: var(--purple-100); }
    :host(:nth-child(3n)) .ticket__stub { background: var(--green-glow-light); border-left-color: rgba(154, 166, 0, 0.35); }
    :host(:nth-child(3n)) .ticket__value { color: var(--green-glow-dark); }
    :host(:nth-child(3n)) .ticket__media { background: var(--green-glow-light); }

    @media (max-width: 900px) {
      .ticket { grid-template-columns: 1fr 220px; }
      .ticket__media { grid-column: 1 / -1; min-height: 180px; }
    }
    @media (max-width: 640px) {
      .ticket { grid-template-columns: 1fr; }
      .ticket__stub { border-left: none; border-top: 2px dashed var(--linea); }
      .ticket__stub::before { left: -11px; top: -11px; }
      .ticket__stub::after { left: auto; right: -11px; top: -11px; bottom: auto; }
    }
  `]
})
export class TicketCardComponent {
  @Input({ required: true }) caso!: CaseStudy;
  coverError = false;
}

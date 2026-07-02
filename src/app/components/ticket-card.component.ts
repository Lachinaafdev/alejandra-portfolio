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
      background: var(--mar-medio);
      border: 1px solid var(--linea);
      border-radius: 14px;
      color: var(--arena);
      overflow: hidden;
      transition: transform 0.25s ease, border-color 0.25s ease;
      position: relative;
    }
    .ticket:hover { transform: translateY(-4px); border-color: var(--cenote); }

    .ticket__media { position: relative; min-height: 190px; background: var(--mar-profundo); }
    .ticket__media img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.4s ease;
    }
    .ticket:hover .ticket__media img { transform: scale(1.04); }
    .ticket__placeholder {
      position: absolute; inset: 10px;
      border: 1px dashed var(--linea); border-radius: 10px;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 0.8rem;
      color: var(--arena-suave); font-size: 0.68rem; font-family: var(--mono);
    }
    .ticket__placeholder code { color: var(--cenote); font-size: 0.62rem; word-break: break-all; }

    .ticket__body { padding: 2rem; }
    .ticket__body h3 { font-size: 1.4rem; margin: 0.6rem 0 0.5rem; }
    .ticket__role { color: var(--arena-suave); font-size: 0.9rem; }

    /* Talón perforado del ticket */
    .ticket__stub {
      border-left: 2px dashed var(--linea);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.25rem;
      position: relative;
    }
    .ticket__stub::before, .ticket__stub::after {
      content: '';
      position: absolute;
      left: -11px;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: var(--mar-profundo);
      border: 1px solid var(--linea);
    }
    .ticket__stub::before { top: -11px; }
    .ticket__stub::after { bottom: -11px; }

    .ticket__value {
      font-family: var(--mono);
      font-size: 2rem;
      font-weight: 500;
      color: var(--coral);
    }
    .ticket__label { font-size: 0.78rem; color: var(--arena-suave); line-height: 1.4; }
    .ticket__cta {
      margin-top: 0.9rem;
      font-family: var(--mono);
      font-size: 0.78rem;
      color: var(--cenote);
    }

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

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';

/**
 * Página de metodología: los flujos de trabajo con IA que uso en
 * proyectos reales. Cada flujo se lee como un pipeline
 * Entrada → IA → Criterio → Entregable, donde el paso humano
 * (el criterio) es el protagonista visual.
 */
@Component({
  selector: 'app-ai-method',
  standalone: true,
  imports: [RouterLink, TranslatePipe, RevealDirective],
  template: `
    <article class="wrap ia">
      <a routerLink="/" class="ia__back">{{ 'method.page.back' | t }}</a>

      <header class="ia__head">
        <p class="eyebrow">{{ 'method.page.eyebrow' | t }}</p>
        <h1>{{ 'method.page.title' | t }}</h1>
        <p class="ia__intro">{{ 'method.page.intro' | t }}</p>
      </header>

      <!-- PRINCIPIOS -->
      <section class="ia__principios" appReveal>
        <h2>{{ 'method.page.principlesTitle' | t }}</h2>
        <div class="ia__principios-grid">
          @for (p of ('method.page.principles' | t); track $index) {
            <div class="ia__principio" appReveal [revealDelay]="$index * 100">
              <span class="ia__principio-n">{{ $index + 1 }}</span>
              <h3>{{ p.title }}</h3>
              <p>{{ p.text }}</p>
            </div>
          }
        </div>
      </section>

      <!-- FLUJOS -->
      <section class="ia__flujos">
        <h2 appReveal>{{ 'method.page.workflowsTitle' | t }}</h2>
        @for (flujo of ('method.page.workflows' | t); track flujo.n) {
          <div class="flujo" appReveal>
            <header class="flujo__head">
              <span class="flujo__n">{{ 'method.page.flowLabel' | t }} {{ flujo.n }}</span>
              <h3>{{ flujo.title }}</h3>
              <p class="flujo__when">
                <strong>{{ 'method.page.whenLabel' | t }}</strong>{{ flujo.when }}
              </p>
            </header>
            <div class="flujo__pipeline">
              <div class="flujo__paso">
                <span class="flujo__label">{{ 'method.page.stepLabels.input' | t }}</span>
                <p>{{ flujo.input }}</p>
              </div>
              <div class="flujo__paso">
                <span class="flujo__label">{{ 'method.page.stepLabels.ai' | t }}</span>
                <p>{{ flujo.ai }}</p>
              </div>
              <div class="flujo__paso flujo__paso--humano">
                <span class="flujo__label">{{ 'method.page.stepLabels.human' | t }}</span>
                <p>{{ flujo.human }}</p>
              </div>
              <div class="flujo__paso">
                <span class="flujo__label">{{ 'method.page.stepLabels.output' | t }}</span>
                <p>{{ flujo.output }}</p>
              </div>
            </div>
            <div class="flujo__tools">
              @for (tool of flujo.tools; track $index) {
                <span>{{ tool }}</span>
              }
            </div>
          </div>
        }
      </section>

      <!-- LÍMITES -->
      <section class="ia__limites" appReveal>
        <h2>{{ 'method.page.boundariesTitle' | t }}</h2>
        <p class="ia__limites-intro">{{ 'method.page.boundariesIntro' | t }}</p>
        <ul>
          @for (b of ('method.page.boundaries' | t); track $index) {
            <li appReveal [revealDelay]="$index * 100">
              <h3>{{ b.title }}</h3>
              <p>{{ b.text }}</p>
            </li>
          }
        </ul>
      </section>
    </article>
  `,
  styles: [`
    .ia { padding-top: 4rem; max-width: 880px; }
    .ia__back { font-family: var(--mono); font-size: 0.82rem; }

    .ia__head { animation: iaIn 0.6s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
    .ia__head h1 { font-size: clamp(1.9rem, 4.5vw, 3rem); margin: 1rem 0 1.4rem; max-width: 22ch; }
    .ia__intro { max-width: 62ch; color: var(--arena-suave); }
    @keyframes iaIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .ia__head { animation: none; } }

    section { margin-top: 4rem; }
    section h2 { font-size: clamp(1.4rem, 3vw, 1.9rem); margin-bottom: 1.6rem; }

    /* Principios */
    .ia__principios-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .ia__principio {
      border: 1px solid var(--linea); border-radius: 14px;
      padding: 1.4rem 1.5rem;
      background: var(--mar-medio);
    }
    .ia__principio-n {
      font-family: var(--mono); font-size: 0.78rem;
      color: var(--mar-profundo); background: var(--cenote);
      width: 1.6rem; height: 1.6rem; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 0.8rem;
    }
    .ia__principio h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
    .ia__principio p { color: var(--arena-suave); font-size: 0.88rem; }
    @media (max-width: 720px) { .ia__principios-grid { grid-template-columns: 1fr; } }

    /* Flujos */
    .ia__flujos { display: grid; gap: 1.4rem; }
    .ia__flujos h2 { margin-bottom: 0.2rem; }
    .flujo {
      border: 1px solid var(--linea); border-radius: 16px;
      padding: 1.8rem;
      transition: border-color 0.25s;
    }
    .flujo:hover { border-color: var(--cenote); }
    .flujo__n {
      font-family: var(--mono); font-size: 0.72rem;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--cenote);
    }
    .flujo__head h3 { font-size: 1.35rem; margin: 0.5rem 0 0.7rem; }
    .flujo__when { color: var(--arena-suave); font-size: 0.92rem; max-width: 68ch; }
    .flujo__when strong {
      display: block; font-family: var(--mono); font-weight: 500;
      font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cenote); margin-bottom: 0.2rem;
    }

    .flujo__pipeline {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem;
      margin-top: 1.4rem;
    }
    .flujo__paso {
      border: 1px solid var(--linea); border-radius: 10px;
      padding: 0.9rem 1rem;
      position: relative;
    }
    /* Flecha entre pasos del pipeline */
    .flujo__paso:not(:last-child)::after {
      content: '→';
      position: absolute; right: -0.85rem; top: 0.8rem;
      color: var(--cenote); font-family: var(--mono); font-size: 0.8rem;
      z-index: 1;
    }
    .flujo__paso--humano { border-color: var(--coral); }
    .flujo__paso--humano .flujo__label { color: var(--coral); }
    .flujo__label {
      display: block; font-family: var(--mono); font-size: 0.64rem;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cenote); margin-bottom: 0.45rem;
    }
    .flujo__paso p { color: var(--arena-suave); font-size: 0.84rem; line-height: 1.55; }

    .flujo__tools { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.2rem; }
    .flujo__tools span {
      font-family: var(--mono); font-size: 0.7rem;
      border: 1px solid var(--linea); border-radius: 999px;
      padding: 0.25rem 0.7rem; color: var(--cenote);
    }

    @media (max-width: 860px) {
      .flujo__pipeline { grid-template-columns: repeat(2, 1fr); }
      .flujo__paso:nth-child(2)::after { content: ''; }
    }
    @media (max-width: 520px) {
      .flujo__pipeline { grid-template-columns: 1fr; }
      .flujo__paso:not(:last-child)::after { content: ''; }
    }

    /* Límites */
    .ia__limites {
      border-left: 3px solid var(--coral);
      padding-left: 1.5rem;
    }
    .ia__limites-intro { color: var(--arena-suave); margin-bottom: 1.4rem; max-width: 62ch; }
    .ia__limites ul { list-style: none; display: grid; gap: 1rem; }
    .ia__limites h3 { font-size: 1.05rem; margin-bottom: 0.3rem; }
    .ia__limites li p { color: var(--arena-suave); font-size: 0.92rem; max-width: 68ch; }
  `]
})
export class AiMethodComponent implements OnInit {
  i18n = inject(TranslateService);

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}

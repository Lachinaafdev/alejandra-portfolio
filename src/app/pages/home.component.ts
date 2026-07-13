import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { TicketCardComponent } from '../components/ticket-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TicketCardComponent, TranslatePipe, RevealDirective],
  template: `
    <!-- HERO (animación de entrada al cargar) -->
    <section class="hero wrap">
      <p class="eyebrow hero__enter">{{ 'hero.eyebrow' | t }}</p>
      <h1 class="hero__enter hero__enter--2">
        {{ 'hero.titleA' | t }}
        <em>{{ 'hero.titleEm' | t }}</em>
        {{ 'hero.titleB' | t }}
      </h1>
      <p class="hero__sub hero__enter hero__enter--3">{{ 'hero.sub' | t }}</p>
      <div class="hero__facts hero__enter hero__enter--4">
        @for (fact of ('hero.facts' | t); track $index) {
          <div><span>{{ fact.value }}</span>{{ fact.label }}</div>
        }
      </div>
    </section>

    <!-- CASOS (reveal al hacer scroll) -->
    <section id="casos" class="wrap casos">
      <p class="eyebrow" appReveal>{{ 'cases.eyebrow' | t }}</p>
      <h2 appReveal>{{ 'cases.title' | t }}</h2>
      <div class="casos__list">
        @for (caso of i18n.cases(); track caso.slug) {
          <app-ticket-card [caso]="caso" appReveal [revealDelay]="$index * 120" />
        }
      </div>
    </section>


    <!-- METODOLOGÍA CON IA (card tipo consola → página de flujos) -->
    <section id="metodologia" class="wrap metodo">
      <p class="eyebrow" appReveal>{{ 'method.eyebrow' | t }}</p>
      <a class="prompt" routerLink="/metodologia-ia" appReveal>
        <div class="prompt__bar">
          <span class="prompt__dot"></span>
          <span class="prompt__dot"></span>
          <span class="prompt__dot"></span>
          <span class="prompt__path">{{ 'method.card.path' | t }}</span>
          <span class="prompt__count">{{ 'method.card.count' | t }}</span>
        </div>
        <div class="prompt__body">
          <h2>{{ 'method.title' | t }}</h2>
          <p>{{ 'method.card.text' | t }}</p>
          <ul class="prompt__flows">
            @for (flow of ('method.card.flows' | t); track $index) {
              <li><span class="prompt__caret">›</span>{{ flow }}</li>
            }
          </ul>
          <span class="prompt__cta">{{ 'method.card.cta' | t }}</span>
        </div>
      </a>
    </section>

    <!-- SOBRE MÍ -->
    <section id="sobre-mi" class="wrap sobre">
      <p class="eyebrow" appReveal>{{ 'about.eyebrow' | t }}</p>
      <h2 appReveal>{{ 'about.title' | t }}</h2>
      <div class="sobre__grid">
        <div class="sobre__text" appReveal>
          <p>{{ 'about.p1' | t }}</p>
          <p>{{ 'about.p2' | t }}</p>
        </div>
        <ul class="sobre__stack" appReveal [revealDelay]="150">
          @for (skill of ('about.stack' | t); track $index) {
            <li>{{ skill }}</li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: [`
    .hero { padding-top: 6rem; padding-bottom: 5rem; }
    .hero h1 {
      font-size: clamp(2.1rem, 5.4vw, 3.6rem);
      margin: 1.2rem 0 1.4rem;
      max-width: 18ch;
    }
    .hero h1 em { color: var(--cenote); font-style: italic; }
    .hero__sub { max-width: 52ch; color: var(--arena-suave); font-size: 1.05rem; }
    .hero__facts {
      display: flex; flex-wrap: wrap; gap: 2.5rem;
      margin-top: 3rem; padding-top: 2rem;
      border-top: 1px solid var(--linea);
      color: var(--arena-suave); font-size: 0.82rem;
    }
    .hero__facts span {
      display: block; font-family: var(--mono);
      color: var(--arena); font-size: 1rem; margin-bottom: 0.2rem;
    }

    /* Entrada del hero al cargar la página */
    .hero__enter { animation: heroUp 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
    .hero__enter--2 { animation-delay: 0.12s; }
    .hero__enter--3 { animation-delay: 0.24s; }
    .hero__enter--4 { animation-delay: 0.36s; }
    @keyframes heroUp {
      from { opacity: 0; transform: translateY(26px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero__enter { animation: none; }
    }

    .casos { padding-top: 2rem; }
    .casos h2, .sobre h2 { font-size: clamp(1.6rem, 3.4vw, 2.3rem); margin: 0.7rem 0 2rem; }
    .casos__list { display: grid; gap: 1.5rem; }


    /* Metodología con IA — card tipo consola de prompt,
       deliberadamente distinto al ticket de los casos */
    .metodo { padding-top: 6rem; }
    .prompt {
      display: block; margin-top: 1.2rem;
      border: 1px solid var(--linea); border-radius: 16px;
      background: linear-gradient(150deg, var(--mar-medio), color-mix(in srgb, var(--mar-profundo) 70%, var(--cenote) 6%));
      color: var(--arena); overflow: hidden;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .prompt:hover {
      border-color: var(--cenote);
      box-shadow: 0 0 40px color-mix(in srgb, var(--cenote) 18%, transparent);
    }
    .prompt__bar {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.8rem 1.4rem;
      border-bottom: 1px solid var(--linea);
      font-family: var(--mono); font-size: 0.72rem;
    }
    .prompt__dot {
      width: 9px; height: 9px; border-radius: 50%;
      border: 1px solid var(--linea);
      background: color-mix(in srgb, var(--arena-suave) 25%, transparent);
    }
    .prompt__path { margin-left: 0.8rem; color: var(--arena-suave); }
    .prompt__count { margin-left: auto; color: var(--cenote); }
    .prompt__body { padding: 2rem 1.8rem 1.8rem; }
    .prompt__body h2 { font-size: clamp(1.5rem, 3.2vw, 2.1rem); margin-bottom: 0.8rem; }
    .prompt__body > p { max-width: 62ch; color: var(--arena-suave); font-size: 0.98rem; }
    .prompt__flows {
      list-style: none; margin: 1.5rem 0 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1.5rem;
      font-family: var(--mono); font-size: 0.8rem; color: var(--arena);
    }
    .prompt__caret { color: var(--cenote); margin-right: 0.55rem; }
    .prompt__cta {
      display: inline-block; margin-top: 1.8rem;
      font-family: var(--mono); font-size: 0.82rem; color: var(--cenote);
    }
    @media (max-width: 860px) { .prompt__flows { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) {
      .prompt__flows { grid-template-columns: 1fr; }
      .prompt__path { display: none; }
    }

    .sobre { padding-top: 6rem; }
    .sobre__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; }
    .sobre__text p + p { margin-top: 1rem; }
    .sobre__text { color: var(--arena-suave); }
    .sobre__stack { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
    .sobre__stack li {
      font-family: var(--mono); font-size: 0.82rem;
      border: 1px solid var(--linea); border-radius: 8px;
      padding: 0.55rem 0.9rem;
    }
    @media (max-width: 720px) { .sobre__grid { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent {
  i18n = inject(TranslateService);
}

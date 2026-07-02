import { Component, inject } from '@angular/core';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { TicketCardComponent } from '../components/ticket-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TicketCardComponent, TranslatePipe, RevealDirective],
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


    <!-- METODOLOGÍA CON IA -->
    <section id="metodologia" class="wrap metodo">
      <p class="eyebrow" appReveal>{{ 'method.eyebrow' | t }}</p>
      <h2 appReveal>{{ 'method.title' | t }}</h2>
      <p class="metodo__intro" appReveal>{{ 'method.intro' | t }}</p>
      <ol class="metodo__steps">
        @for (step of ('method.steps' | t); track $index) {
          <li class="metodo__step" appReveal [revealDelay]="$index * 100">
            <span class="metodo__n">{{ step.n }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
              <div class="metodo__tools">
                @for (tool of step.tools; track $index) {
                  <span>{{ tool }}</span>
                }
              </div>
            </div>
          </li>
        }
      </ol>
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


    /* Metodología con IA */
    .metodo { padding-top: 6rem; }
    .metodo h2 { font-size: clamp(1.6rem, 3.4vw, 2.3rem); margin: 0.7rem 0 1.2rem; }
    .metodo__intro { max-width: 62ch; color: var(--arena-suave); margin-bottom: 2.5rem; }
    .metodo__steps { list-style: none; display: grid; gap: 1rem; counter-reset: none; }
    .metodo__step {
      display: grid; grid-template-columns: 64px 1fr; gap: 1.2rem;
      border: 1px solid var(--linea); border-radius: 14px;
      padding: 1.5rem 1.8rem;
      transition: border-color 0.25s;
    }
    .metodo__step:hover { border-color: var(--cenote); }
    .metodo__n {
      font-family: var(--mono); font-size: 1.4rem;
      color: var(--cenote); padding-top: 0.2rem;
    }
    .metodo__step h3 { font-size: 1.15rem; margin-bottom: 0.4rem; }
    .metodo__step p { color: var(--arena-suave); font-size: 0.95rem; }
    .metodo__tools { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem; }
    .metodo__tools span {
      font-family: var(--mono); font-size: 0.7rem;
      border: 1px solid var(--linea); border-radius: 999px;
      padding: 0.25rem 0.7rem; color: var(--cenote);
    }
    @media (max-width: 520px) { .metodo__step { grid-template-columns: 1fr; gap: 0.5rem; } }

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

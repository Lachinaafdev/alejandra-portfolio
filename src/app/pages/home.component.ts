import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective, MagneticDirective } from '../i18n/i18n';
import { CaseShowcaseComponent } from '../components/case-showcase.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CaseShowcaseComponent, TranslatePipe, RevealDirective, MagneticDirective],
  template: `
    <!-- HERO (timeline GSAP de entrada + blob de gradiente flotante) -->
    <section class="hero wrap">
      <div class="hero__blob" aria-hidden="true"></div>
      <p class="eyebrow hero__enter">{{ 'hero.eyebrow' | t }}</p>
      <h1 class="hero__enter">
        {{ 'hero.titleA' | t }}
        <em>{{ 'hero.titleEm' | t }}</em>
        {{ 'hero.titleB' | t }}
      </h1>
      <p class="hero__sub hero__enter">{{ 'hero.sub' | t }}</p>
      <div class="hero__facts hero__enter">
        @for (fact of ('hero.facts' | t); track $index) {
          <div><span>{{ fact.value }}</span>{{ fact.label }}</div>
        }
      </div>
    </section>

    <!-- CASOS (reveal al hacer scroll) -->
    <section id="casos" class="wrap casos">
      <div class="sec-head" appReveal>
        <span class="sec-head__n">01</span>
        <p class="eyebrow">{{ 'cases.eyebrow' | t }}</p>
        <span class="sec-head__line"></span>
      </div>
      <h2 appReveal>{{ 'cases.title' | t }}</h2>
      <app-case-showcase />
    </section>


    <!-- METODOLOGÍA CON IA (card tipo consola → página de flujos) -->
    <section id="metodologia" class="wrap metodo">
      <div class="sec-head" appReveal>
        <span class="sec-head__n">02</span>
        <p class="eyebrow">{{ 'method.eyebrow' | t }}</p>
        <span class="sec-head__line"></span>
      </div>
      <a class="prompt" routerLink="/metodologia-ia" appReveal>
        <div class="prompt__bar">
          <span class="prompt__dot prompt__dot--teal"></span>
          <span class="prompt__dot prompt__dot--purple"></span>
          <span class="prompt__dot prompt__dot--green"></span>
          <span class="prompt__path">{{ 'method.card.path' | t }}</span>
          <span class="prompt__count">{{ 'method.card.count' | t }}</span>
        </div>
        <div class="prompt__body">
          <h2>{{ 'method.title' | t }}</h2>
          <p>{{ 'method.card.text' | t }}</p>
          <ul class="prompt__flows">
            @for (flow of ('method.card.flows' | t); track $index) {
              <li><span class="prompt__num">0{{ $index + 1 }}</span>{{ flow }}</li>
            }
          </ul>
          <span class="prompt__cta">{{ 'method.card.cta' | t }}</span>
        </div>
      </a>
    </section>

    <!-- SOBRE MÍ -->
    <section id="sobre-mi" class="wrap sobre">
      <div class="sec-head" appReveal>
        <span class="sec-head__n">03</span>
        <p class="eyebrow">{{ 'about.eyebrow' | t }}</p>
        <span class="sec-head__line"></span>
      </div>
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
    .hero { position: relative; padding-top: 7rem; padding-bottom: 5rem; }
    /* Retícula de puntos sutil: textura de mesa de trabajo */
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background-image: radial-gradient(var(--border-strong) 1px, transparent 1px);
      background-size: 26px 26px;
      mask-image: radial-gradient(ellipse 70% 60% at 75% 20%, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 75% 20%, black 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }
    .hero h1 {
      font-size: clamp(2.4rem, 6vw, 4.3rem);
      line-height: 1.06;
      margin: 1.3rem 0 1.6rem;
      max-width: 21ch;
      position: relative;
    }
    .hero h1 em {
      font-style: italic;
      color: var(--teal-900);
      /* Marcador green glow: barrido tipo subrayado de plumón */
      background: linear-gradient(120deg, var(--green-glow-light), var(--green-glow-light));
      background-repeat: no-repeat;
      background-position: 0 82%;
      background-size: 0% 38%;
      animation: markerSweep 0.8s var(--ease-out) 1.1s forwards;
    }
    @keyframes markerSweep { to { background-size: 100% 38%; } }

    .hero__sub { max-width: 52ch; color: var(--text-secondary); font-size: 1.05rem; line-height: 1.8; }

    /* Stats como bloques de color suaves: cifra en serif, etiqueta en mono */
    .hero__facts {
      display: flex; flex-wrap: wrap; gap: 1rem;
      margin-top: 3.5rem;
      font-family: var(--mono); font-size: 0.66rem;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--gray-dark);
    }
    .hero__facts div {
      padding: 1.1rem 1.4rem;
      border-radius: var(--radius-md);
      transition: transform var(--duration-base) var(--ease-out);
    }
    .hero__facts div:hover { transform: translateY(-4px); }
    .hero__facts div:nth-child(3n + 1) { background: var(--teal-100); }
    .hero__facts div:nth-child(3n + 2) { background: var(--purple-100); }
    .hero__facts div:nth-child(3n) { background: var(--green-glow-light); }
    .hero__facts span {
      display: block; font-family: var(--display); font-weight: 700;
      font-size: 1.55rem; letter-spacing: -0.5px;
      margin-bottom: 0.3rem; text-transform: none;
    }
    .hero__facts div:nth-child(3n + 1) span { color: var(--teal-900); }
    .hero__facts div:nth-child(3n + 2) span { color: var(--purple-700); }
    .hero__facts div:nth-child(3n) span { color: var(--green-glow-dark); }

    /* Blob de gradiente: aporta color sin ensuciar la lectura */
    .hero__blob {
      position: absolute; top: 2rem; right: -6rem;
      width: 420px; height: 420px;
      background: radial-gradient(circle at 35% 35%, var(--teal-100) 0%, var(--purple-100) 55%, transparent 75%);
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.9;
      pointer-events: none;
      z-index: -1;
    }

    /* Estado inicial de la entrada del hero (lo anima GSAP) */
    .hero__enter { opacity: 0; }
    @media (prefers-reduced-motion: reduce) {
      .hero__enter { opacity: 1; }
    }

    .casos { padding-top: 3rem; }
    .casos h2, .sobre h2 { font-size: clamp(1.8rem, 3.8vw, 2.6rem); margin: 1rem 0 2.2rem; }


    /* Metodología con IA — card tipo consola de prompt,
       deliberadamente distinto al ticket de los casos */
    .metodo { padding-top: 6rem; }
    .prompt {
      display: block; margin-top: 1.2rem;
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      background: var(--white);
      color: var(--text-primary); overflow: hidden;
      position: relative;
      transition: border-color var(--duration-base) var(--ease-out),
                  box-shadow var(--duration-base) var(--ease-out),
                  transform var(--duration-base) var(--ease-out);
    }
    /* Barra de acento superior: teal → purple, se dibuja al hover */
    .prompt::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--grad-primary);
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-slow) var(--ease-out);
    }
    .prompt:hover { border-color: var(--teal-700); box-shadow: var(--shadow-lg); transform: translateY(-6px); }
    .prompt:hover::before { transform: scaleX(1); }

    .prompt__bar {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.85rem 1.4rem;
      border-bottom: 1px solid var(--border);
      background: var(--gray-light);
      font-family: var(--mono); font-size: 0.72rem;
    }
    .prompt__dot { width: 10px; height: 10px; border-radius: 50%; }
    .prompt__dot--teal { background: var(--teal-700); }
    .prompt__dot--purple { background: var(--purple-500); }
    .prompt__dot--green { background: var(--green-glow); }
    .prompt__path { margin-left: 0.8rem; color: var(--cocoa-500); }
    .prompt__path::after {
      content: '▍';
      color: var(--teal-700);
      animation: caretBlink 1.1s steps(1) infinite;
    }
    @keyframes caretBlink { 50% { opacity: 0; } }
    .prompt__count {
      margin-left: auto;
      background: var(--purple-100); color: var(--purple-500);
      border: 1px solid rgba(122, 79, 163, 0.2);
      border-radius: 999px; padding: 0.2rem 0.75rem;
      font-weight: 500;
    }
    .prompt__body { padding: 2.2rem 1.8rem 2rem; }
    .prompt__body h2 { font-size: clamp(1.5rem, 3.2vw, 2.1rem); margin-bottom: 0.8rem; }
    .prompt__body > p { max-width: 62ch; color: var(--text-secondary); font-size: 0.98rem; }
    .prompt__flows {
      list-style: none; margin: 1.6rem 0 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1.5rem;
      font-family: var(--mono); font-size: 0.8rem; color: var(--cocoa-700);
    }
    .prompt__flows li {
      padding-bottom: 0.55rem;
      border-bottom: 1px solid var(--border);
      transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
    }
    .prompt:hover .prompt__flows li:hover { color: var(--purple-500); transform: translateX(4px); }
    .prompt__num { color: var(--gray-medium); margin-right: 0.7rem; font-size: 0.68rem; }
    .prompt__cta {
      display: inline-block; margin-top: 1.9rem;
      font-family: var(--mono); font-size: 0.82rem; font-weight: 500;
      color: var(--teal-700);
      transition: color var(--duration-fast) var(--ease-out);
    }
    /* Se lee como un comando por ejecutar */
    .prompt__cta::before { content: '$ '; color: var(--green-glow-dark); }
    .prompt:hover .prompt__cta { color: var(--purple-500); }
    @media (max-width: 860px) { .prompt__flows { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) {
      .prompt__flows { grid-template-columns: 1fr; }
      .prompt__path { display: none; }
    }

    .sobre { padding-top: 6rem; }
    .sobre__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; }
    .sobre__text p + p { margin-top: 1rem; }
    .sobre__text { color: var(--text-secondary); }
    /* Capitular editorial en el primer párrafo */
    .sobre__text p:first-of-type::first-letter {
      font-family: var(--display); font-weight: 700;
      font-size: 3.1rem; line-height: 0.85;
      float: left; padding: 0.1em 0.45rem 0 0;
      color: var(--teal-700);
    }
    /* Skills como tags de color rotando la paleta */
    .sobre__stack { list-style: none; display: flex; flex-wrap: wrap; align-content: start; gap: 0.6rem; }
    .sobre__stack li {
      font-family: var(--mono); font-size: 0.8rem; font-weight: 500;
      border-radius: 999px;
      padding: 0.5rem 1rem;
      transition: transform var(--duration-fast) var(--ease-out);
    }
    .sobre__stack li:hover { transform: translateY(-3px); }
    .sobre__stack li:nth-child(4n + 1) { background: var(--teal-100); color: var(--teal-900); }
    .sobre__stack li:nth-child(4n + 2) { background: var(--purple-100); color: var(--purple-700); }
    .sobre__stack li:nth-child(4n + 3) { background: var(--green-glow-light); color: var(--green-glow-dark); }
    .sobre__stack li:nth-child(4n) { background: var(--wax-paper); color: var(--cocoa-700); }
    @media (max-width: 720px) { .sobre__grid { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements AfterViewInit {
  i18n = inject(TranslateService);
  private host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    const root = this.host.nativeElement;

    // Entrada del hero: cascada con snap suave
    gsap.fromTo(root.querySelectorAll('.hero__enter'),
      { opacity: 0, y: 42 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.13, clearProps: 'transform' }
    );

    // El blob respira lentamente todo el tiempo
    gsap.to(root.querySelector('.hero__blob'), {
      y: 30, x: -20, scale: 1.08,
      duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
  }
}

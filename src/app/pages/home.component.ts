import {
  Component, ElementRef, OnDestroy, afterNextRender, effect, inject, viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { TicketCardComponent } from '../components/ticket-card.component';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../motion/motion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TicketCardComponent, TranslatePipe, RevealDirective],
  template: `
    <!-- HERO: blanco, tipografía gigante, entrada por mask reveal (solo CSS) -->
    <section class="hero wrap">
      <div class="mask"><p class="eyebrow" style="animation-delay: 0s">{{ 'hero.eyebrow' | t }}</p></div>
      <div class="mask">
        <h1 style="animation-delay: 0.08s">
          {{ 'hero.titleA' | t }}
          <em>{{ 'hero.titleEm' | t }}</em>
          {{ 'hero.titleB' | t }}
        </h1>
      </div>
      <div class="mask"><p class="hero__sub" style="animation-delay: 0.2s">{{ 'hero.sub' | t }}</p></div>
      <div class="mask">
        <div class="hero__facts" style="animation-delay: 0.3s">
          @for (fact of ('hero.facts' | t); track $index) {
            <div><span>{{ fact.value }}</span>{{ fact.label }}</div>
          }
        </div>
      </div>
    </section>

    <!-- REEL PINEADO: blanco/completo → gris/encogido-redondeado → negro -->
    <div class="reel-zone" #reelZone>
      <div class="reel-sticky" #reelSticky>
        <div class="reel" #reel>
          <div class="reel__fallback" aria-hidden="true"></div>
          <video autoplay muted loop playsinline preload="auto" src="assets/video/reel.mp4"></video>
          <span class="reel__hint">{{ 'reel.hint' | t }}</span>
        </div>
      </div>
    </div>

    <!-- LÁMINA BLANCA: pasa por encima del reel pineado -->
    <div class="over">
      <!-- Marquee infinito con el stack -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          @for (group of [0, 1]; track group) {
            <div class="marquee__group">
              @for (skill of ('about.stack' | t); track $index) {
                <span>{{ skill }}</span><span class="marquee__sep">✳</span>
              }
            </div>
          }
        </div>
      </div>

      <!-- CASOS: cards planas full-width -->
      <section id="casos" class="casos">
        <div class="wrap">
          <div class="sec-head" appReveal>
            <span class="sec-head__n">01</span>
            <p class="eyebrow">{{ 'cases.eyebrow' | t }}</p>
            <span class="sec-head__line"></span>
          </div>
          <h2 appReveal>{{ 'cases.title' | t }}</h2>
        </div>
        <div class="casos__list">
          @for (caso of i18n.cases(); track caso.slug) {
            <app-ticket-card [caso]="caso" [index]="$index" />
          }
        </div>
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
            <span class="prompt__dot prompt__dot--coral"></span>
            <span class="prompt__dot prompt__dot--navy"></span>
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
    </div>
  `,
  styles: [`
    /* ---------- HERO ---------- */
    .hero { padding-top: 6rem; padding-bottom: 7rem; }
    .hero h1 {
      font-size: clamp(3.2rem, 11.5vw, 10.5rem);
      line-height: 1.0;
      margin: 1.6rem 0 2rem;
    }
    .hero h1 em { font-style: normal; color: var(--cenote); }
    .hero__sub { max-width: 54ch; color: var(--text-secondary); font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.8; }
    .hero__facts {
      display: flex; flex-wrap: wrap; gap: 2.5rem;
      margin-top: 3.5rem; padding-top: 1.4rem;
      border-top: 1px solid var(--linea);
      font-family: var(--mono); font-size: 0.66rem;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--gray-dark);
    }
    .hero__facts span {
      display: block; font-family: var(--display); font-weight: 600;
      font-size: 1.4rem; letter-spacing: -0.02em;
      margin-bottom: 0.3rem; text-transform: none; color: var(--text-primary);
    }

    /* Mask reveal de entrada: contenedor que recorta, hijo que sube.
       El texto llega async del i18n, así que es 100% CSS. */
    .mask { overflow: hidden; }
    .mask > * {
      transform: translateY(115%);
      animation: maskUp 1s var(--ease-mask) forwards;
    }
    @keyframes maskUp { to { transform: translateY(0); } }

    /* ---------- REEL PINEADO ---------- */
    .reel-zone { height: 300vh; position: relative; }
    .reel-sticky {
      position: sticky; top: 0; height: 100vh;
      overflow: hidden; display: grid; place-items: center;
      background: #fff;
    }
    .reel {
      position: relative;
      width: 100vw; height: 100vh;
      border-radius: 0; overflow: hidden;
      transform-origin: center;
      will-change: transform, border-radius;
    }
    .reel video {
      position: absolute; inset: 0; z-index: 1;
      width: 100%; height: 100%; object-fit: cover;
    }
    /* Mientras no exista el mp4, un gradiente animado "reproduce" algo */
    .reel__fallback {
      position: absolute; inset: 0; z-index: 0;
      background: linear-gradient(120deg, #22336B, #0B2A33, #0E8F82);
      background-size: 300% 300%;
      animation: reelFlow 9s ease-in-out infinite;
    }
    @keyframes reelFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .reel__hint {
      position: absolute; z-index: 2;
      left: 50%; bottom: 2.2rem; transform: translateX(-50%);
      font-family: var(--mono); font-size: 0.72rem; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
      color: #fff; background: rgba(5, 5, 5, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 999px; padding: 0.55rem 1.2rem;
      backdrop-filter: blur(6px);
    }

    /* ---------- LÁMINA BLANCA SOBRE EL REEL ---------- */
    .over {
      position: relative; z-index: 5;
      background: #fff;
      margin-top: -60vh;
      padding-top: 4.5rem;
    }

    /* ---------- MARQUEE ---------- */
    .marquee {
      overflow: hidden;
      border-top: 1px solid var(--linea);
      border-bottom: 1px solid var(--linea);
      padding: 1.3rem 0;
      margin-bottom: 6rem;
    }
    .marquee__track {
      display: flex; width: max-content;
      animation: marqueeMove 28s linear infinite;
    }
    .marquee:hover .marquee__track { animation-play-state: paused; }
    .marquee__group {
      display: flex; align-items: center; gap: 2.2rem;
      padding-right: 2.2rem; white-space: nowrap;
      font-family: var(--display); font-weight: 600;
      font-size: clamp(1.3rem, 2.6vw, 2.1rem);
      letter-spacing: -0.02em; color: var(--text-primary);
    }
    .marquee__sep { color: var(--cenote); font-size: 0.75em; }
    @keyframes marqueeMove { to { transform: translateX(-50%); } }

    /* ---------- SECCIONES ---------- */
    .casos h2, .sobre h2 {
      font-size: clamp(2.4rem, 5.5vw, 4.4rem);
      margin: 1.2rem 0 2.6rem;
    }
    .casos__list { display: flex; flex-direction: column; gap: 1rem; }

    /* Metodología: la card consola, aplanada al nuevo tema */
    .metodo { padding-top: 7rem; }
    .prompt {
      display: block; margin-top: 1.2rem;
      border: 1px solid var(--linea); border-radius: 0;
      background: var(--white);
      color: var(--text-primary); overflow: hidden;
      position: relative;
      transition: border-color var(--duration-base) var(--ease-out);
    }
    .prompt::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--grad-primary);
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-slow) var(--ease-out);
    }
    .prompt:hover { border-color: var(--text-primary); }
    .prompt:hover::before { transform: scaleX(1); }

    .prompt__bar {
      display: flex; align-items: center; gap: 0.45rem;
      padding: 0.85rem 1.4rem;
      border-bottom: 1px solid var(--linea);
      background: var(--gray-light);
      font-family: var(--mono); font-size: 0.72rem;
    }
    .prompt__dot { width: 10px; height: 10px; border-radius: 50%; }
    .prompt__dot--teal { background: var(--cenote); }
    .prompt__dot--coral { background: var(--coral); }
    .prompt__dot--navy { background: var(--navy); }
    .prompt__path { margin-left: 0.8rem; color: var(--gray-dark); }
    .prompt__path::after {
      content: '▍';
      color: var(--cenote);
      animation: caretBlink 1.1s steps(1) infinite;
    }
    @keyframes caretBlink { 50% { opacity: 0; } }
    .prompt__count {
      margin-left: auto;
      background: var(--white); color: var(--teal-900);
      border: 1px solid var(--linea);
      border-radius: 999px; padding: 0.2rem 0.75rem;
      font-weight: 500;
    }
    .prompt__body { padding: 2.4rem 1.8rem 2.2rem; }
    .prompt__body h2 { font-size: clamp(1.6rem, 3.4vw, 2.4rem); margin-bottom: 0.9rem; }
    .prompt__body > p { max-width: 62ch; color: var(--text-secondary); font-size: 0.98rem; }
    .prompt__flows {
      list-style: none; margin: 1.6rem 0 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1.5rem;
      font-family: var(--mono); font-size: 0.8rem; color: var(--gray-dark);
    }
    .prompt__flows li {
      padding-bottom: 0.55rem;
      border-bottom: 1px solid var(--linea);
      transition: color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
    }
    .prompt:hover .prompt__flows li:hover { color: var(--text-primary); transform: translateX(4px); }
    .prompt__num { color: var(--gray-medium); margin-right: 0.7rem; font-size: 0.68rem; }
    .prompt__cta {
      display: inline-block; margin-top: 1.9rem;
      font-family: var(--mono); font-size: 0.82rem; font-weight: 500;
      color: var(--teal-900);
      transition: color var(--duration-fast) var(--ease-out);
    }
    .prompt__cta::before { content: '$ '; color: var(--gray-medium); }
    .prompt:hover .prompt__cta { color: var(--text-primary); }
    @media (max-width: 860px) { .prompt__flows { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) {
      .prompt__flows { grid-template-columns: 1fr; }
      .prompt__path { display: none; }
    }

    .sobre { padding-top: 7rem; padding-bottom: 3rem; }
    .sobre__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; }
    .sobre__text p + p { margin-top: 1rem; }
    .sobre__text { color: var(--text-secondary); max-width: 60ch; }
    .sobre__stack { list-style: none; display: flex; flex-wrap: wrap; align-content: start; gap: 0.6rem; }
    .sobre__stack li {
      font-family: var(--mono); font-size: 0.8rem; font-weight: 500;
      border: 1px solid var(--border-strong); border-radius: 999px;
      padding: 0.5rem 1rem; color: var(--text-primary);
      transition: border-color var(--duration-fast) var(--ease-out),
                  background var(--duration-fast) var(--ease-out);
    }
    .sobre__stack li:hover { border-color: var(--text-primary); background: var(--gray-light); }
    @media (max-width: 720px) { .sobre__grid { grid-template-columns: 1fr; } }

    /* ---------- REDUCED MOTION: todo estático ---------- */
    @media (prefers-reduced-motion: reduce) {
      .mask > * { transform: none; animation: none; }
      .reel-zone { height: auto; }
      .reel-sticky { position: static; background: #111; }
      .over { margin-top: 0; }
      .marquee__track { animation: none; }
    }
  `]
})
export class HomeComponent implements OnDestroy {
  i18n = inject(TranslateService);

  private reelZone = viewChild.required<ElementRef<HTMLElement>>('reelZone');
  private reelSticky = viewChild.required<ElementRef<HTMLElement>>('reelSticky');
  private reel = viewChild.required<ElementRef<HTMLElement>>('reel');

  private reelTl?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.initReel());

    // El texto llega async del i18n y cambia las alturas del layout:
    // recalcular las posiciones de todos los ScrollTriggers.
    effect(() => {
      this.i18n.cases();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }

  /* Secuencia del reel (scrub sobre los 300vh de .reel-zone):
     0.00–0.15 blanco, video completo · 0.15–0.55 gris + encoge y
     redondea · 0.55–1.00 negro, video pequeño al centro. */
  private initReel(): void {
    if (prefersReducedMotion()) { return; }

    this.reelTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.reelZone().nativeElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    this.reelTl
      .to(this.reelSticky().nativeElement, { backgroundColor: '#8f8f8f', duration: 0.4 }, 0.15)
      .to(this.reel().nativeElement, { scale: 0.58, borderRadius: 28, duration: 0.4 }, 0.15)
      .to(this.reelSticky().nativeElement, { backgroundColor: '#050505', duration: 0.45 }, 0.55);
  }

  ngOnDestroy(): void {
    this.reelTl?.scrollTrigger?.kill();
    this.reelTl?.kill();
  }
}

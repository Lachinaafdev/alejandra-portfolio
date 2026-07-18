import { Component, ElementRef, OnDestroy, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { TicketCardComponent } from '../components/ticket-card.component';
import { CaseEntranceDirective, prefersReducedMotion } from '../motion/motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TicketCardComponent, CaseEntranceDirective, TranslatePipe, RevealDirective],
  template: `
    <!-- HERO blanco: entrada con mask reveal (solo CSS) -->
    <section class="hero wrap">
      <div class="mask"><p class="eyebrow mask__in">{{ 'hero.eyebrow' | t }}</p></div>
      <div class="mask"><h1 class="mask__in mask__in--d1">
        {{ 'hero.titleA' | t }}
        <em>{{ 'hero.titleEm' | t }}</em>
        {{ 'hero.titleB' | t }}
      </h1></div>
      <div class="mask"><p class="hero__sub mask__in mask__in--d2">{{ 'hero.sub' | t }}</p></div>
      <div class="mask"><div class="hero__facts mask__in mask__in--d3">
        @for (fact of ('hero.facts' | t); track $index) {
          <div><span>{{ fact.value }}</span>{{ fact.label }}</div>
        }
      </div></div>
    </section>

    <!-- REEL PINEADO: blanco/completo → gris/encogido → negro -->
    <div class="reel-zone">
      <div class="reel-sticky">
        <div class="reel">
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
          <div class="marquee__group">
            @for (skill of ('about.stack' | t); track $index) {
              <span>{{ skill }}<i>✳</i></span>
            }
          </div>
          <div class="marquee__group">
            @for (skill of ('about.stack' | t); track $index) {
              <span>{{ skill }}<i>✳</i></span>
            }
          </div>
        </div>
      </div>

      <!-- CASOS: bloques planos full-width -->
      <section id="casos" class="casos">
        <div class="wrap">
          <p class="eyebrow" appReveal>{{ 'cases.eyebrow' | t }}</p>
          <h2 appReveal>{{ 'cases.title' | t }}</h2>
        </div>
        <div class="casos__list">
          @for (caso of i18n.cases(); track caso.slug) {
            <app-ticket-card [caso]="caso" [appCaseEntrance]="$index" />
          }
        </div>
      </section>

      <!-- METODOLOGÍA CON IA (card tipo consola → página de flujos) -->
      <section id="metodologia" class="wrap metodo">
        <p class="eyebrow" appReveal>{{ 'method.eyebrow' | t }}</p>
        <h2 appReveal>{{ 'method.title' | t }}</h2>
        <a class="prompt" routerLink="/metodologia-ia" appReveal>
          <div class="prompt__bar">
            <span class="prompt__dot prompt__dot--teal"></span>
            <span class="prompt__dot prompt__dot--coral"></span>
            <span class="prompt__dot prompt__dot--navy"></span>
            <span class="prompt__path">{{ 'method.card.path' | t }}</span>
            <span class="prompt__count">{{ 'method.card.count' | t }}</span>
          </div>
          <div class="prompt__body">
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
    </div>
  `,
  styles: [`
    /* ---------- HERO ---------- */
    .hero { padding-top: 10rem; padding-bottom: 4rem; }
    .hero h1 {
      font-size: clamp(3.2rem, 11.5vw, 10.5rem);
      margin: 1.2rem 0 2rem;
    }
    .hero h1 em { font-style: normal; color: var(--teal-700); }
    .hero__sub { max-width: 54ch; color: var(--text-secondary); font-size: 1.08rem; line-height: 1.8; }
    .hero__facts {
      display: flex; flex-wrap: wrap; gap: 2.8rem;
      margin-top: 2.6rem; padding-top: 1.6rem;
      border-top: 1px solid var(--linea);
      font-family: var(--mono); font-size: 0.68rem;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--text-secondary);
    }
    .hero__facts span {
      display: block; font-family: var(--display); font-weight: 600;
      font-size: 1.3rem; letter-spacing: -0.02em; text-transform: none;
      color: var(--text-primary); margin-bottom: 0.25rem;
    }

    /* Mask reveal de entrada (solo CSS; el texto llega async del i18n) */
    .mask { overflow: hidden; }
    .mask__in {
      display: block;
      transform: translateY(115%);
      animation: maskUp 1s var(--ease-mask) forwards;
    }
    .mask__in--d1 { animation-delay: 0.1s; }
    .mask__in--d2 { animation-delay: 0.22s; }
    .mask__in--d3 { animation-delay: 0.34s; }
    @keyframes maskUp { to { transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) {
      .mask__in { transform: none; animation: none; }
    }

    /* ---------- REEL PINEADO ---------- */
    .reel-zone { height: 300vh; position: relative; }
    .reel-sticky {
      position: sticky; top: 0; height: 100vh;
      overflow: hidden;
      display: grid; place-items: center;
      background: #fff;
    }
    .reel {
      position: relative;
      width: 100vw; height: 100vh;
      border-radius: 0;
      transform-origin: center;
      will-change: transform, border-radius;
      overflow: hidden;
    }
    .reel video {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
    }
    /* Mientras no exista el mp4: gradiente "reproduciéndose" */
    .reel__fallback {
      position: absolute; inset: 0;
      background: linear-gradient(120deg, #22336b, #0b2a33, #0e8f82, #22336b);
      background-size: 300% 300%;
      animation: reelFlow 9s ease-in-out infinite alternate;
    }
    @keyframes reelFlow {
      from { background-position: 0% 50%; }
      to { background-position: 100% 50%; }
    }
    .reel__hint {
      position: absolute; bottom: 2.2rem; left: 50%;
      transform: translateX(-50%);
      font-family: var(--mono); font-size: 0.72rem; white-space: nowrap;
      background: rgba(255, 255, 255, 0.92); color: var(--text-primary);
      border-radius: 999px; padding: 0.55rem 1.2rem;
    }

    /* ---------- LÁMINA QUE CUBRE EL REEL ---------- */
    .over {
      position: relative; z-index: 5;
      background: #fff;
      margin-top: -60vh;
      padding-top: 4.5rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .reel-zone { height: auto; }
      .reel-sticky { position: static; height: auto; background: #111; padding: 0; }
      .reel { width: 100%; height: auto; aspect-ratio: 16 / 9; }
      .over { margin-top: 0; }
    }

    /* ---------- MARQUEE ---------- */
    .marquee {
      overflow: hidden;
      border-top: 1px solid var(--linea);
      border-bottom: 1px solid var(--linea);
      padding: 1.2rem 0;
    }
    .marquee__track {
      display: flex; width: max-content;
      animation: marquee 28s linear infinite;
    }
    .marquee:hover .marquee__track { animation-play-state: paused; }
    .marquee__group {
      display: flex; align-items: center; gap: 2.4rem;
      padding-right: 2.4rem;
      font-family: var(--display); font-weight: 600;
      font-size: clamp(1.1rem, 2.4vw, 1.6rem);
      letter-spacing: -0.02em;
      white-space: nowrap; color: var(--text-primary);
    }
    .marquee__group span { display: inline-flex; align-items: center; gap: 2.4rem; }
    .marquee__group i { font-style: normal; color: var(--teal-700); font-size: 0.9em; }
    @media (prefers-reduced-motion: reduce) {
      .marquee__track { animation: none; }
    }

    /* ---------- SECCIONES ---------- */
    section h2 {
      font-size: clamp(2.4rem, 5.5vw, 4.4rem);
      margin: 0.9rem 0 2.4rem;
    }

    .casos { padding-top: 5rem; }
    .casos__list { display: grid; gap: 0.75rem; }

    .metodo { padding-top: 7rem; }
    .prompt {
      display: block;
      border: 1px solid var(--linea);
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
    .prompt__dot--teal { background: var(--teal-700); }
    .prompt__dot--coral { background: var(--coral); }
    .prompt__dot--navy { background: var(--navy); }
    .prompt__path { margin-left: 0.8rem; color: var(--text-secondary); }
    .prompt__path::after {
      content: '▍';
      color: var(--teal-700);
      animation: caretBlink 1.1s steps(1) infinite;
    }
    @keyframes caretBlink { 50% { opacity: 0; } }
    .prompt__count {
      margin-left: auto;
      border: 1px solid var(--border-strong);
      border-radius: 999px; padding: 0.2rem 0.75rem;
      color: var(--text-primary); font-weight: 500;
    }
    .prompt__body { padding: 2.2rem 1.8rem 2rem; }
    .prompt__body > p { max-width: 62ch; color: var(--text-secondary); font-size: 0.98rem; }
    .prompt__flows {
      list-style: none; margin: 1.6rem 0 0;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem 1.5rem;
      font-family: var(--mono); font-size: 0.8rem; color: var(--text-primary);
    }
    .prompt__flows li { padding-bottom: 0.55rem; border-bottom: 1px solid var(--linea); }
    .prompt__num { color: var(--gray-medium); margin-right: 0.7rem; font-size: 0.68rem; }
    .prompt__cta {
      display: inline-block; margin-top: 1.9rem;
      font-family: var(--mono); font-size: 0.82rem; font-weight: 500;
      color: var(--teal-700);
    }
    .prompt__cta::before { content: '$ '; color: var(--coral); }
    .prompt:hover .prompt__cta { color: var(--coral); }
    @media (max-width: 860px) { .prompt__flows { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) {
      .prompt__flows { grid-template-columns: 1fr; }
      .prompt__path { display: none; }
    }

    .sobre { padding-top: 7rem; padding-bottom: 3rem; }
    .sobre__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; }
    .sobre__text p + p { margin-top: 1rem; }
    .sobre__text { color: var(--text-secondary); }
    .sobre__stack { list-style: none; display: flex; flex-wrap: wrap; align-content: start; gap: 0.6rem; }
    .sobre__stack li {
      font-family: var(--mono); font-size: 0.8rem;
      border: 1px solid var(--border-strong); border-radius: 999px;
      padding: 0.45rem 1rem; color: var(--text-primary);
    }
    @media (max-width: 720px) { .sobre__grid { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements OnDestroy {
  i18n = inject(TranslateService);
  private host = inject(ElementRef<HTMLElement>);
  private reelTl?: gsap.core.Timeline;

  constructor() {
    afterNextRender(() => this.initReel());
  }

  /* Secuencia del reel (scrub): blanco/completo → gris/encogido → negro */
  private initReel(): void {
    if (prefersReducedMotion()) { return; }
    const root = this.host.nativeElement;
    const zone = root.querySelector('.reel-zone');
    const sticky = root.querySelector('.reel-sticky');
    const reel = root.querySelector('.reel');
    if (!zone || !sticky || !reel) { return; }

    this.reelTl = gsap.timeline({
      scrollTrigger: { trigger: zone, start: 'top top', end: 'bottom bottom', scrub: true },
    });
    this.reelTl
      .to(sticky, { backgroundColor: '#8f8f8f', duration: 0.4, ease: 'none' }, 0.15)
      .to(reel, { scale: 0.58, borderRadius: 28, duration: 0.4, ease: 'none' }, 0.15)
      .to(sticky, { backgroundColor: '#050505', duration: 0.45, ease: 'none' }, 0.55);
  }

  ngOnDestroy(): void {
    this.reelTl?.scrollTrigger?.kill();
    this.reelTl?.kill();
  }
}

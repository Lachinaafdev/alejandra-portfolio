import {
  Component, ElementRef, OnDestroy, afterNextRender, computed, effect, inject, viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, RevealDirective } from '../i18n/i18n';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../motion/motion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe, RevealDirective],
  template: `
    <!-- HERO: blanco, título corto y gigante tipo "Product Designer".
         El h1 es el primer segmento del eyebrow i18n; el resto de
         segmentos queda como línea meta. Entrada por mask reveal (CSS). -->
    <section class="hero wrap">
      <div class="mask"><p class="eyebrow" style="animation-delay: 0s">{{ heroParts().rest }}</p></div>
      <div class="mask">
        <h1 style="animation-delay: 0.08s">{{ heroParts().main }}</h1>
      </div>
      <div class="mask"><p class="hero__sub" style="animation-delay: 0.2s">{{ 'hero.sub' | t }}</p></div>
      <!-- Datos rápidos del hero: ocultos para dejar el hero como el
           prototipo (solo eyebrow + título + párrafo). Cambia el
           @if (false) por @if (true) para mostrarlos de nuevo. -->
      @if (false) {
      <div class="mask">
        <div class="hero__facts" style="animation-delay: 0.3s">
          @for (fact of ('hero.facts' | t); track $index) {
            <div><span>{{ fact.value }}</span>{{ fact.label }}</div>
          }
        </div>
      </div>
      }
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
      <!-- Carrusel infinito de marcas: los archivos viven en
           assets/img/logos/ y se llaman EXACTAMENTE como cada entrada
           de la llave i18n "clients" (DELTA.png, TRANSAT.png, …).
           Se intenta .png y luego .svg; si no existe el archivo se
           muestra el nombre en texto. Dos grupos idénticos + keyframe
           a -50% = loop continuo; se pausa al pasar el mouse. -->
      <div class="clients" aria-hidden="true">
        <div class="clients__track">
          @for (group of [0, 1]; track group) {
            <div class="clients__group">
              @for (brand of ('clients' | t); track $index) {
                @if (logoExt(brand) !== 'text') {
                  <img
                    class="clients__logo"
                    [src]="'assets/img/logos/' + brand + '.' + logoExt(brand)"
                    [alt]="brand"
                    loading="lazy"
                    (error)="onLogoError(brand)" />
                } @else {
                  <span class="clients__name">{{ brand }}</span>
                }
              }
            </div>
          }
        </div>
      </div>

      <!-- Marquee del stack: oculto para dejar solo el carrusel de
           marcas, como el prototipo. Cambia @if (false) por @if (true)
           para mostrarlo de nuevo. -->
      @if (false) {
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
      }

      <!-- PROYECTOS: grid como el mock — imagen con esquinas suaves,
           título y categoría debajo. La lista vive en la llave i18n
           "projects"; las entradas con slug enlazan a su caso. -->
      <section id="casos" class="casos">
        <div class="wrap">
          <div class="sec-head" appReveal>
            <span class="sec-head__n">01</span>
            <p class="eyebrow">{{ 'cases.eyebrow' | t }}</p>
            <span class="sec-head__line"></span>
          </div>
          <!-- Título de sección oculto (el mock muestra el grid directo).
               Cambia @if (false) por @if (true) para recuperarlo. -->
          @if (false) {
          <h2 appReveal>{{ 'cases.title' | t }}</h2>
          }
          <div class="casos__grid">
            @for (p of ('projects' | t); track $index) {
              @if (p.slug) {
                <a class="proj" [routerLink]="['/caso', p.slug]" appReveal [revealDelay]="($index % 3) * 100">
                  <div class="proj__media"><img [src]="p.img" [alt]="p.title" loading="lazy" /></div>
                  <h3 class="proj__title">{{ p.title }}</h3>
                  <p class="proj__cat">{{ p.category }}</p>
                </a>
              } @else {
                <div class="proj" appReveal [revealDelay]="($index % 3) * 100">
                  <div class="proj__media"><img [src]="p.img" [alt]="p.title" loading="lazy" /></div>
                  <h3 class="proj__title">{{ p.title }}</h3>
                  <p class="proj__cat">{{ p.category }}</p>
                </div>
              }
            }
          </div>
        </div>
      </section>

      <!-- STATEMENT: la frase de posicionamiento del hero, en grande -->
      <section class="wrap statement" appReveal>
        <p class="statement__text">
          {{ 'hero.titleA' | t }}
          <em>{{ 'hero.titleEm' | t }}</em>
          {{ 'hero.titleB' | t }}
        </p>
        <a routerLink="/" fragment="casos" class="btn">{{ 'nav.cases' | t }}</a>
      </section>

      <!-- METODOLOGÍA CON IA: oculta por ahora, como en el prototipo.
           Para volver a mostrarla cambia el @if (false) por @if (true)
           o quita el bloque @if. La página /metodologia-ia sigue viva
           y accesible desde el menú. -->
      @if (false) {
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
      }

      <!-- SOBRE MÍ -->
      <section id="sobre-mi" class="wrap sobre">
        <div class="sec-head" appReveal>
          <span class="sec-head__n">02</span>
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
    .hero { padding-top: 5.5rem; padding-bottom: 6rem; }
    .hero h1 {
      font-size: clamp(3.2rem, 11.5vw, 10.5rem);
      font-weight: 700;
      line-height: 0.95;
      margin: 1.2rem 0 1.6rem;
      color: var(--navy);
    }
    .hero__sub { max-width: 66ch; color: var(--text-secondary); font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.75; }
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

    /* ---------- CARRUSEL DE MARCAS ---------- */
    .clients { overflow: hidden; padding: 3.5rem 0 4rem; }
    .clients__track {
      display: flex; width: max-content;
      animation: clientsMove 30s linear infinite;
    }
    .clients:hover .clients__track { animation-play-state: paused; }
    .clients__group {
      display: flex; align-items: center;
      gap: clamp(3rem, 7vw, 6.5rem);
      padding-right: clamp(3rem, 7vw, 6.5rem);
    }
    .clients__logo { height: clamp(30px, 4vw, 46px); width: auto; }
    .clients__name {
      font-family: var(--mono); font-size: 0.8rem; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--gray-dark); white-space: nowrap;
    }
    @keyframes clientsMove { to { transform: translateX(-50%); } }

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
    .casos__grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 2.4rem 1.4rem;
    }
    @media (max-width: 1000px) { .casos__grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .casos__grid { grid-template-columns: 1fr; } }

    /* Card de proyecto: imagen arriba, texto debajo (como el mock) */
    .proj { display: block; color: var(--text-primary); }
    .proj__media {
      border-radius: 12px; overflow: hidden;
      aspect-ratio: 405 / 480;
      background: var(--gray-light);
    }
    .proj__media img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 0.6s var(--ease-out);
    }
    a.proj:hover .proj__media img { transform: scale(1.04); }
    .proj__title {
      margin-top: 0.9rem;
      font-family: var(--body); font-weight: 600;
      font-size: 0.95rem; line-height: 1.35; letter-spacing: 0;
      color: var(--text-primary);
    }
    a.proj:hover .proj__title { color: var(--teal-900); }
    .proj__cat { margin-top: 0.15rem; font-size: 0.78rem; color: var(--gray-medium); }

    /* Statement gigante después del grid, con el acento en color
       y el CTA a los casos alineado a la derecha, como el mock */
    .statement { padding-top: 7rem; display: flex; flex-direction: column; }
    .statement .btn { align-self: flex-end; }
    .statement__text {
      font-family: var(--display); font-weight: 600;
      font-size: clamp(2rem, 4.6vw, 4rem);
      letter-spacing: -0.035em; line-height: 1.08;
      color: var(--text-primary); max-width: 1050px;
    }
    .statement__text em { font-style: normal; color: var(--cenote); }
    .statement .btn { margin-top: 2.4rem; }

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
      .clients__track { animation: none; }
    }
  `]
})
export class HomeComponent implements OnDestroy {
  i18n = inject(TranslateService);

  /* El eyebrow i18n ("Product Designer · Service Design · …") se parte:
     el primer segmento es el título gigante, el resto la línea meta. */
  heroParts = computed(() => {
    const parts = String(this.i18n.t('hero.eyebrow') ?? '')
      .split('·').map(p => p.trim()).filter(Boolean);
    return { main: parts[0] ?? '', rest: parts.slice(1).join(' · ') };
  });

  /* Logos: el archivo se llama exactamente como la entrada de
     "clients" (p. ej. DELTA → assets/img/logos/DELTA.png). Se intenta
     .png, luego .svg; si ninguno existe, el nombre en texto. */
  private logoTries = new Map<string, 'png' | 'svg' | 'text'>();

  logoExt(brand: string): 'png' | 'svg' | 'text' {
    return this.logoTries.get(brand) ?? 'png';
  }

  onLogoError(brand: string): void {
    this.logoTries.set(brand, this.logoExt(brand) === 'png' ? 'svg' : 'text');
  }

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

import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, MagneticDirective } from '../i18n/i18n';
import { gsap } from '../motion/motion';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe, MagneticDirective],
  template: `
    <header class="header">
      <div class="wrap header__in">
        <a routerLink="/" class="header__logo">A·Fierro</a>
        <nav class="header__nav">
          <a routerLink="/" fragment="casos">{{ 'nav.cases' | t }}</a>
          <a routerLink="/metodologia-ia" class="header__hide-sm">{{ 'nav.method' | t }}</a>
          <a routerLink="/" fragment="sobre-mi">{{ 'nav.about' | t }}</a>
          <button
            class="header__lang"
            type="button"
            (click)="i18n.toggle()"
            [attr.aria-label]="i18n.lang() === 'es' ? 'Switch to English' : 'Cambiar a español'">
            <span [class.on]="i18n.lang() === 'es'">ES</span>
            <span class="header__lang-sep">/</span>
            <span [class.on]="i18n.lang() === 'en'">EN</span>
          </button>
          <a href="mailto:alejandrafierrorm@gmail.com" class="header__contact" appMagnetic>{{ 'nav.contact' | t }}</a>
        </nav>
      </div>
      <div class="header__progress" aria-hidden="true"></div>
    </header>
  `,
  styles: [`
    /* Header fijo en blend difference: logo y nav se invierten
       solos sobre el negro/gris del reel. Todo su contenido debe
       ser blanco puro para que la inversión funcione. */
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      mix-blend-mode: difference;
      color: #fff;
    }
    .header__in { display: flex; align-items: center; justify-content: space-between; padding-top: 1.1rem; padding-bottom: 1.1rem; }
    .header__logo { font-family: var(--display); font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; }
    .header__logo::after {
      content: '';
      display: inline-block; width: 7px; height: 7px;
      background: #fff; border-radius: 50%;
      margin-left: 5px; vertical-align: 2px;
    }
    .header__nav { display: flex; align-items: center; gap: 1.6rem; }
    .header__nav a:not(.header__contact) { color: rgba(255, 255, 255, 0.75); font-size: 0.9rem; position: relative; }
    .header__nav a:not(.header__contact):hover { color: #fff; }
    .header__nav a:not(.header__contact)::after {
      content: '';
      position: absolute; left: 0; bottom: -5px;
      width: 100%; height: 1px;
      background: #fff;
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-base) var(--ease-out);
    }
    .header__nav a:not(.header__contact):hover::after { transform: scaleX(1); }

    .header__contact {
      display: inline-block;
      font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
      padding: 0.5rem 1.1rem;
      border: 1px solid rgba(255, 255, 255, 0.55); border-radius: 999px;
      color: #fff;
      transition: background var(--duration-base) var(--ease-out),
                  border-color var(--duration-base) var(--ease-out);
    }
    .header__contact:hover { background: rgba(255, 255, 255, 0.15); border-color: #fff; color: #fff; }

    .header__lang {
      background: transparent; border: 1px solid rgba(255, 255, 255, 0.45); border-radius: 999px;
      font-family: var(--mono); font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.75); cursor: pointer;
      padding: 0.4rem 0.8rem; letter-spacing: 0.06em;
      transition: border-color var(--duration-fast) var(--ease-out);
    }
    .header__lang:hover { border-color: #fff; }
    .header__lang .on { color: #fff; font-weight: 500; }
    .header__lang-sep { opacity: 0.4; margin: 0 0.2rem; }

    .header__lang:focus-visible, .header a:focus-visible { outline-color: #fff; }

    /* Barra de progreso de lectura (blanca: se invierte sola) */
    .header__progress {
      position: absolute; bottom: -1px; left: 0;
      height: 2px; width: 100%;
      background: #fff;
      transform: scaleX(0); transform-origin: left;
    }

    @media (max-width: 620px) { .header__nav { gap: 0.9rem; } .header__hide-sm { display: none; } }
  `]
})
export class HeaderComponent implements AfterViewInit {
  i18n = inject(TranslateService);
  private host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    gsap.to(this.host.nativeElement.querySelector('.header__progress'), {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
    });
  }
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe, MagneticDirective],
  template: `
    <footer class="footer">
      <div class="wrap footer__in">
        <div>
          <p class="eyebrow">{{ 'footer.eyebrow' | t }}</p>
          <h2>{{ 'footer.titleA' | t }}<br /><em>{{ 'footer.titleB' | t }}</em></h2>
          <a href="mailto:alejandrafierrorm@gmail.com" class="btn btn--solid" appMagnetic>alejandrafierrorm&#64;gmail.com</a>
        </div>
        <div class="footer__meta">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
          <span>{{ 'footer.location' | t }}</span>
          <span>{{ 'footer.rights' | t }}</span>
          <button type="button" class="footer__top" (click)="scrollTop()">{{ 'footer.top' | t }} ↑</button>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Footer gigante, plano y blanco: cierra la lámina que cubre
       al reel, así que necesita fondo y stacking propios. */
    .footer {
      position: relative; z-index: 5;
      background: var(--white);
      border-top: 1px solid var(--linea);
    }
    .footer__in { padding-top: 6rem; padding-bottom: 3rem; display: grid; gap: 3.5rem; }
    .footer h2 {
      font-size: clamp(2.6rem, 8vw, 6.5rem);
      letter-spacing: -0.035em; line-height: 1.0;
      margin: 1.4rem 0 2.4rem;
    }
    .footer h2 em { font-style: normal; color: var(--cenote); }
    .footer__meta {
      display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem;
      color: var(--gray-dark); font-size: 0.85rem; font-family: var(--mono);
      border-top: 1px solid var(--linea); padding-top: 1.4rem;
    }
    .footer__meta a { color: var(--text-primary); }
    .footer__meta a::after { content: ' ↗'; font-size: 0.75rem; }
    .footer__meta a:hover { color: var(--teal-900); }
    .footer__top {
      margin-left: auto;
      background: none; border: none; cursor: pointer;
      font-family: var(--mono); font-size: 0.85rem;
      color: var(--text-primary);
      transition: color var(--duration-fast) var(--ease-out);
    }
    .footer__top:hover { color: var(--teal-900); }
  `]
})
export class FooterComponent {
  scrollTop(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}

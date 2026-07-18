import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, MagneticDirective } from '../i18n/i18n';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe, MagneticDirective],
  template: `
    <header class="header">
      <div class="wrap header__in">
        <a routerLink="/" class="header__logo">A·Fierro</a>
        <nav class="header__nav">
          <a routerLink="/" fragment="casos" class="header__hide-xs">{{ 'nav.cases' | t }}</a>
          <a routerLink="/metodologia-ia" class="header__hide-sm">{{ 'nav.method' | t }}</a>
          <a routerLink="/" fragment="sobre-mi" class="header__hide-xs">{{ 'nav.about' | t }}</a>
          <button
            class="header__lang"
            type="button"
            (click)="i18n.toggle()"
            [attr.aria-label]="i18n.lang() === 'es' ? 'Switch to English' : 'Cambiar a español'">
            <span [class.on]="i18n.lang() === 'es'">ES</span>
            <span class="header__lang-sep">/</span>
            <span [class.on]="i18n.lang() === 'en'">EN</span>
          </button>
          <a href="mailto:alejandrafierrorm@gmail.com" class="header__cta" appMagnetic>{{ 'nav.contact' | t }}</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    /* Fijo y en difference: logo y nav se invierten solos sobre
       el fondo negro del reel */
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 20;
      mix-blend-mode: difference;
      color: #fff;
    }
    .header__in { display: flex; align-items: center; justify-content: space-between; padding-top: 1.1rem; padding-bottom: 1.1rem; }
    .header__logo {
      font-family: var(--display); font-size: 1.25rem; font-weight: 700;
      letter-spacing: -0.02em; color: #fff;
    }
    .header__nav { display: flex; align-items: center; gap: 1.6rem; }
    .header__nav a:not(.header__cta) { color: #fff; font-size: 0.9rem; position: relative; }
    .header__nav a:not(.header__cta)::after {
      content: '';
      position: absolute; left: 0; bottom: -5px;
      width: 100%; height: 1px; background: #fff;
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-base) var(--ease-out);
    }
    .header__nav a:not(.header__cta):hover::after { transform: scaleX(1); }

    .header__lang {
      background: none; border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 999px;
      font-family: var(--mono); font-size: 0.72rem;
      color: #fff; cursor: pointer;
      padding: 0.4rem 0.8rem; letter-spacing: 0.06em;
      transition: border-color var(--duration-fast) var(--ease-out);
    }
    .header__lang:hover { border-color: #fff; }
    .header__lang .on { font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .header__lang-sep { opacity: 0.5; margin: 0 0.2rem; }

    .header__cta {
      font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
      border: 1px solid #fff; border-radius: 999px;
      padding: 0.5rem 1.2rem; color: #fff;
      transition: background var(--duration-base) var(--ease-out),
                  color var(--duration-base) var(--ease-out);
    }
    .header__cta:hover { background: #fff; color: #000; }

    @media (max-width: 620px) { .header__nav { gap: 0.9rem; } .header__hide-sm { display: none; } }
    @media (max-width: 460px) { .header__hide-xs { display: none; } }
  `]
})
export class HeaderComponent {
  i18n = inject(TranslateService);
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
          <h2>{{ 'footer.titleA' | t }}<br />{{ 'footer.titleB' | t }}</h2>
          <a href="mailto:alejandrafierrorm@gmail.com" class="btn btn--solid" appMagnetic>alejandrafierrorm&#64;gmail.com</a>
        </div>
        <div class="footer__meta">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn ↗</a>
          <span>{{ 'footer.location' | t }}</span>
          <span>{{ 'footer.rights' | t }}</span>
          <button type="button" class="footer__top" (click)="scrollTop()">{{ 'footer.top' | t }} ↑</button>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { border-top: 1px solid var(--linea); margin-top: 6rem; background: var(--white); }
    .footer__in { padding-top: 6rem; padding-bottom: 3rem; display: grid; gap: 3.5rem; }
    .footer h2 {
      font-size: clamp(2.6rem, 8vw, 6.5rem);
      margin: 1.2rem 0 2.4rem;
    }
    .footer__meta {
      display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem;
      color: var(--text-secondary); font-size: 0.85rem; font-family: var(--mono);
      border-top: 1px solid var(--linea); padding-top: 1.4rem;
    }
    .footer__meta a { color: var(--text-primary); }
    .footer__meta a:hover { color: var(--coral); }
    .footer__top {
      margin-left: auto;
      background: none; border: none; cursor: pointer;
      font-family: var(--mono); font-size: 0.85rem;
      color: var(--text-primary);
      transition: color var(--duration-fast) var(--ease-out);
    }
    .footer__top:hover { color: var(--coral); }
  `]
})
export class FooterComponent {
  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

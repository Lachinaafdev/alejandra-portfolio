import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '../i18n/i18n';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
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
          <a href="mailto:alejandrafierrorm@gmail.com" class="header__contact">{{ 'nav.contact' | t }}</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    /* Header fijo con fondo blanco sólido (sin blend ni barra de
       progreso de lectura) */
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      background: var(--white);
      border-bottom: 1px solid var(--linea);
    }
    .header__in { display: flex; align-items: center; justify-content: space-between; padding-top: 1.1rem; padding-bottom: 1.1rem; }
    .header__logo { font-family: var(--display); font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
    .header__logo::after {
      content: '';
      display: inline-block; width: 7px; height: 7px;
      background: var(--cenote); border-radius: 50%;
      margin-left: 5px; vertical-align: 2px;
    }
    .header__nav { display: flex; align-items: center; gap: 1.6rem; }
    .header__nav a:not(.header__contact) { color: var(--gray-dark); font-size: 0.9rem; position: relative; }
    .header__nav a:not(.header__contact):hover { color: var(--text-primary); }
    .header__nav a:not(.header__contact)::after {
      content: '';
      position: absolute; left: 0; bottom: -5px;
      width: 100%; height: 1px;
      background: var(--text-primary);
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-base) var(--ease-out);
    }
    .header__nav a:not(.header__contact):hover::after { transform: scaleX(1); }

    .header__contact {
      display: inline-block;
      font-family: var(--mono); font-size: 0.78rem; font-weight: 500;
      padding: 0.5rem 1.1rem;
      border: 1px solid var(--border-strong); border-radius: 999px;
      color: var(--text-primary);
      transition: background var(--duration-base) var(--ease-out),
                  border-color var(--duration-base) var(--ease-out);
    }
    .header__contact:hover { background: var(--gray-light); border-color: var(--text-primary); color: var(--text-primary); }

    .header__lang {
      background: transparent; border: 1px solid var(--border-strong); border-radius: 999px;
      font-family: var(--mono); font-size: 0.72rem;
      color: var(--gray-dark); cursor: pointer;
      padding: 0.4rem 0.8rem; letter-spacing: 0.06em;
      transition: border-color var(--duration-fast) var(--ease-out);
    }
    .header__lang:hover { border-color: var(--text-primary); }
    .header__lang .on { color: var(--text-primary); font-weight: 500; }
    .header__lang-sep { opacity: 0.4; margin: 0 0.2rem; }

    @media (max-width: 620px) { .header__nav { gap: 0.9rem; } .header__hide-sm { display: none; } }
  `]
})
export class HeaderComponent {
  i18n = inject(TranslateService);
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <footer class="footer">
      <div class="wrap footer__in">
        <h2>{{ 'footer.titleA' | t }}</h2>
        <a href="mailto:alejandrafierrorm@gmail.com" class="footer__mail">alejandrafierrorm&#64;gmail.com</a>
      </div>
      <div class="footer__bar">
        <div class="wrap footer__meta">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
          <span>{{ 'footer.rights' | t }}</span>
          <button type="button" class="footer__top" (click)="scrollTop()">{{ 'footer.top' | t }} ↑</button>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Footer sobrio como el mock: título mediano en navy y correo
       en mono subrayado. Cierra la lámina que cubre al reel, así
       que necesita fondo y stacking propios. */
    .footer {
      position: relative; z-index: 5;
      background: var(--white);
      border-top: 1px solid var(--linea);
    }
    .footer__in { padding-top: 4rem; padding-bottom: 3.5rem; }
    .footer h2 {
      font-family: var(--body); font-weight: 600;
      font-size: clamp(1.5rem, 2.6vw, 2rem);
      letter-spacing: -0.01em; line-height: 1.2;
      color: var(--navy);
      margin: 0 0 0.9rem;
    }
    .footer__mail {
      font-family: var(--mono); font-size: 0.9rem;
      color: var(--navy);
      border-bottom: 1px solid var(--navy); padding-bottom: 2px;
      transition: color var(--duration-fast) var(--ease-out),
                  border-color var(--duration-fast) var(--ease-out);
    }
    .footer__mail:hover { color: var(--coral); border-color: var(--coral); }

    /* Barra inferior oscura, full-bleed, con la meta y volver arriba */
    .footer__bar { background: #050505; }
    .footer__meta {
      display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem;
      color: rgba(255, 255, 255, 0.65); font-size: 0.78rem; font-family: var(--mono);
      padding-top: 1.1rem; padding-bottom: 1.1rem;
    }
    .footer__meta a { color: #fff; }
    .footer__meta a::after { content: ' ↗'; font-size: 0.72rem; }
    .footer__meta a:hover { color: var(--teal-300); }
    .footer__top {
      margin-left: auto;
      background: none; border: none; cursor: pointer;
      font-family: var(--mono); font-size: 0.78rem;
      color: #fff;
      transition: color var(--duration-fast) var(--ease-out);
    }
    .footer__top:hover { color: var(--teal-300); }
    .footer__top:focus-visible { outline-color: #fff; }
  `]
})
export class FooterComponent {
  scrollTop(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}

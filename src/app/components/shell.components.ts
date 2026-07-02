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
          <a routerLink="/" fragment="metodologia" class="header__hide-sm">{{ 'nav.method' | t }}</a>
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
          <a href="mailto:alejandrafierrorm@gmail.com" class="btn">{{ 'nav.contact' | t }}</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky; top: 0; z-index: 10;
      background: color-mix(in srgb, var(--mar-profundo) 85%, transparent);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--linea);
    }
    .header__in { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; padding-bottom: 1rem; }
    .header__logo { font-family: var(--display); font-size: 1.3rem; font-weight: 700; color: var(--arena); }
    .header__nav { display: flex; align-items: center; gap: 1.6rem; }
    .header__nav a:not(.btn) { color: var(--arena-suave); font-size: 0.9rem; }
    .header__nav a:not(.btn):hover { color: var(--cenote); }
    .header__nav .btn { padding: 0.5rem 1.1rem; font-size: 0.78rem; }

    .header__lang {
      background: none; border: 1px solid var(--linea); border-radius: 999px;
      font-family: var(--mono); font-size: 0.72rem;
      color: var(--arena-suave); cursor: pointer;
      padding: 0.4rem 0.8rem; letter-spacing: 0.06em;
      transition: border-color 0.25s;
    }
    .header__lang:hover { border-color: var(--cenote); }
    .header__lang .on { color: var(--cenote); font-weight: 500; }
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
        <div>
          <p class="eyebrow">{{ 'footer.eyebrow' | t }}</p>
          <h2>{{ 'footer.titleA' | t }}<br />{{ 'footer.titleB' | t }}</h2>
          <a href="mailto:alejandrafierrorm@gmail.com" class="btn btn--solid">alejandrafierrorm&#64;gmail.com</a>
        </div>
        <div class="footer__meta">
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a>
          <span>{{ 'footer.location' | t }}</span>
          <span>{{ 'footer.rights' | t }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { border-top: 1px solid var(--linea); margin-top: 6rem; }
    .footer__in { padding-top: 4rem; padding-bottom: 3rem; display: grid; gap: 2.5rem; }
    .footer h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin: 0.8rem 0 1.6rem; }
    .footer__meta { display: flex; flex-wrap: wrap; gap: 1.5rem; color: var(--arena-suave); font-size: 0.85rem; font-family: var(--mono); }
  `]
})
export class FooterComponent {}

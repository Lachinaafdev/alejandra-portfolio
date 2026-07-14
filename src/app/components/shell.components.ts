import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe, MagneticDirective } from '../i18n/i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
          <a href="mailto:alejandrafierrorm@gmail.com" class="btn" appMagnetic>{{ 'nav.contact' | t }}</a>
        </nav>
      </div>
      <div class="header__progress" aria-hidden="true"></div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky; top: 0; z-index: 10;
      background: color-mix(in srgb, var(--gray-light) 85%, transparent);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .header__in { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; padding-bottom: 1rem; }
    .header__logo { font-family: var(--display); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); }
    .header__logo:hover { color: var(--teal-700); }
    /* Punto green glow: el "encendido" de la marca */
    .header__logo::after {
      content: '';
      display: inline-block; width: 7px; height: 7px;
      background: var(--green-glow); border-radius: 50%;
      margin-left: 5px; vertical-align: 2px;
    }
    .header__nav { display: flex; align-items: center; gap: 1.6rem; }
    .header__nav a:not(.btn) { color: var(--text-secondary); font-size: 0.9rem; position: relative; }
    .header__nav a:not(.btn):hover { color: var(--text-primary); }
    .header__nav a:not(.btn)::after {
      content: '';
      position: absolute; left: 0; bottom: -5px;
      width: 100%; height: 2px;
      background: var(--grad-primary);
      transform: scaleX(0); transform-origin: left;
      transition: transform var(--duration-base) var(--ease-out);
    }
    .header__nav a:not(.btn):hover::after { transform: scaleX(1); }
    .header__nav .btn { padding: 0.5rem 1.1rem; font-size: 0.78rem; }

    .header__lang {
      background: var(--white); border: 1px solid var(--border-strong); border-radius: 999px;
      font-family: var(--mono); font-size: 0.72rem;
      color: var(--text-secondary); cursor: pointer;
      padding: 0.4rem 0.8rem; letter-spacing: 0.06em;
      transition: border-color var(--duration-fast) var(--ease-out);
    }
    .header__lang:hover { border-color: var(--teal-700); }
    .header__lang .on { color: var(--teal-700); font-weight: 500; }
    .header__lang-sep { opacity: 0.4; margin: 0 0.2rem; }

    /* Barra de progreso de lectura: teal → purple, la anima GSAP */
    .header__progress {
      position: absolute; bottom: -1px; left: 0;
      height: 2px; width: 100%;
      background: var(--grad-primary);
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
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border);
      margin-top: 6rem;
      background: linear-gradient(135deg, var(--teal-100) 0%, var(--purple-100) 50%, var(--wax-paper) 100%);
    }
    .footer__in { padding-top: 5rem; padding-bottom: 3rem; display: grid; gap: 2.5rem; }
    .footer h2 { font-size: clamp(2rem, 5vw, 3.4rem); letter-spacing: -1px; margin: 1rem 0 1.8rem; }
    .footer h2 em { font-style: italic; color: var(--teal-900); }
    .footer__meta { display: flex; flex-wrap: wrap; gap: 1.5rem; color: var(--cocoa-500); font-size: 0.85rem; font-family: var(--mono); }
    .footer__meta a { color: var(--teal-900); }
    .footer__meta a::after { content: ' ↗'; font-size: 0.75rem; }
    .footer__meta a:hover { color: var(--purple-500); }
  `]
})
export class FooterComponent {}

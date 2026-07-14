import {
  Injectable, Pipe, PipeTransform, Directive, ElementRef,
  inject, signal, computed, effect, OnInit, Input,
} from '@angular/core';
import { CaseStudy } from '../data/cases';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type Lang = 'es' | 'en';

/* ============================================================
   TranslateService — carga assets/i18n/{es|en}.json
   y expone el diccionario y los casos como signals.
   ============================================================ */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  readonly lang = signal<Lang>(this.initialLang());
  private readonly dict = signal<Record<string, unknown>>({});

  /** Casos de estudio ya localizados, listos para las páginas. */
  readonly cases = computed<CaseStudy[]>(
    () => (this.dict()['caseList'] as CaseStudy[]) ?? []
  );

  constructor() {
    effect(() => {
      const lang = this.lang();
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
      this.load(lang);
    });
  }

  toggle(): void {
    this.lang.set(this.lang() === 'es' ? 'en' : 'es');
  }

  /** Resuelve una llave con notación de punto: 'cases.labels.role' */
  t(key: string): any {
    return key
      .split('.')
      .reduce<any>((node, part) => (node ? node[part] : undefined), this.dict()) ?? '';
  }

  private async load(lang: Lang): Promise<void> {
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      this.dict.set(await res.json());
    } catch {
      console.error(`No se pudo cargar assets/i18n/${lang}.json`);
    }
  }

  private initialLang(): Lang {
    const saved = localStorage.getItem('lang');
    if (saved === 'es' || saved === 'en') { return saved; }
    return navigator.language?.startsWith('en') ? 'en' : 'es';
  }
}

/* ============================================================
   Pipe de traducción: {{ 'hero.sub' | t }}
   Impuro para reaccionar al cambio de idioma; devuelve
   referencias estables del diccionario, así que también
   funciona con arreglos en @for.
   ============================================================ */
@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private i18n = inject(TranslateService);
  transform(key: string): any {
    return this.i18n.t(key);
  }
}

/* ============================================================
   Directiva de animación (GSAP + ScrollTrigger): revela el
   elemento al entrar en viewport con un movimiento suave hacia
   arriba. Respeta prefers-reduced-motion.
   Uso: <section appReveal> · <div appReveal [revealDelay]="120">
   ============================================================ */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit {
  @Input() revealDelay = 0;
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('reveal--visible');
      return;
    }

    gsap.fromTo(node,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: this.revealDelay / 1000,
        clearProps: 'transform',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        onStart: () => node.classList.add('reveal--visible'),
      }
    );
  }
}

/* ============================================================
   Directiva magnética: el elemento sigue sutilmente al cursor
   y regresa con rebote elástico al salir. Para CTAs.
   Uso: <a appMagnetic>…</a>
   ============================================================ */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    const node = this.el.nativeElement;

    node.addEventListener('mousemove', (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      gsap.to(node, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.4, ease: 'power2.out',
      });
    });
    node.addEventListener('mouseleave', () => {
      gsap.to(node, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  }
}

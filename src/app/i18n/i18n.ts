import {
  Injectable, Pipe, PipeTransform, Directive, ElementRef,
  inject, signal, computed, effect, OnInit, Input,
} from '@angular/core';
import { CaseStudy } from '../data/cases';

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
   Directiva de animación: revela el elemento al entrar en
   viewport. Respeta prefers-reduced-motion.
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
      node.classList.add('reveal--in');
      return;
    }
    if (this.revealDelay) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add('reveal--in');
          io.disconnect();
        }
      }),
      { threshold: 0.15 }
    );
    io.observe(node);
  }
}

import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '../i18n/i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Showcase de casos: lista numerada a la izquierda y "pantalla"
 * deslizable a la derecha (marco tipo navegador con las portadas).
 * Flechas y clics en la lista mueven el carrusel; la entrada al
 * viewport llega coreografiada con GSAP.
 */
@Component({
  selector: 'app-case-showcase',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="show">
      <div class="show__list">
        @for (caso of i18n.cases(); track caso.slug; let i = $index) {
          <button type="button" class="show__item" [class.show__item--on]="i === active()" (click)="go(i)">
            <span class="show__n">0{{ i + 1 }}</span>
            <span class="show__info">
              <strong>{{ caso.title }}</strong>
              <em><b>{{ caso.metric.value }}</b> {{ caso.metric.label }}</em>
            </span>
          </button>
        }
        @if (activeCase(); as c) {
          <a class="show__cta" [routerLink]="['/caso', c.slug]">{{ 'cases.cta' | t }}</a>
        }
      </div>

      <div class="show__stage">
        <button type="button" class="show__arrow show__arrow--prev"
                (click)="step(-1)" [attr.aria-label]="'cases.prev' | t">←</button>

        <a class="show__frame" [routerLink]="['/caso', activeCase()?.slug]">
          <span class="show__bar">
            <span class="show__dot show__dot--teal"></span>
            <span class="show__dot show__dot--purple"></span>
            <span class="show__dot show__dot--green"></span>
            <span class="show__url">a-fierro.design/caso/{{ activeCase()?.slug }}</span>
          </span>
          <span class="show__screen">
            <span class="show__track" #track>
              @for (caso of i18n.cases(); track caso.slug; let i = $index) {
                <span class="show__slide">
                  @if (caso.cover && !imgError.has(caso.slug)) {
                    <img [src]="caso.cover.src" [alt]="caso.cover.alt" loading="lazy" (error)="imgError.add(caso.slug)" />
                  } @else {
                    <span class="show__placeholder">
                      <span>{{ 'gallery.missing' | t }}</span>
                      <code>src/{{ caso.cover?.src || 'assets/img/' + caso.slug + '-cover.jpg' }}</code>
                    </span>
                  }
                </span>
              }
            </span>
          </span>
        </a>

        <button type="button" class="show__arrow show__arrow--next"
                (click)="step(1)" [attr.aria-label]="'cases.next' | t">→</button>
      </div>
    </div>
  `,
  styles: [`
    .show {
      display: grid; grid-template-columns: 0.9fr 1.4fr;
      gap: 2.5rem; align-items: center;
    }

    /* Lista numerada: el paso activo manda, el resto espera apagado */
    .show__list { display: flex; flex-direction: column; gap: 0.7rem; }
    .show__item {
      display: flex; align-items: center; gap: 1rem;
      text-align: left; cursor: pointer;
      background: var(--white);
      border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 0.95rem 1.1rem;
      opacity: 0.5;
      font-family: var(--body);
      transition: opacity var(--duration-base) var(--ease-out),
                  transform var(--duration-base) var(--ease-out),
                  border-color var(--duration-base) var(--ease-out),
                  box-shadow var(--duration-base) var(--ease-out);
    }
    .show__item:hover { opacity: 0.85; }
    .show__item--on {
      opacity: 1;
      transform: translateX(10px);
      border-color: var(--teal-700);
      box-shadow: var(--shadow-md);
    }
    .show__n {
      flex: none;
      font-family: var(--mono); font-size: 0.72rem; font-weight: 700;
      width: 1.9rem; height: 1.9rem; border-radius: 7px;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--wax-paper); color: var(--cocoa-700);
      transition: background var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out);
    }
    .show__item:nth-child(3n + 1).show__item--on .show__n { background: var(--teal-700); color: var(--white); }
    .show__item:nth-child(3n + 2).show__item--on .show__n { background: var(--purple-500); color: var(--white); }
    .show__item:nth-child(3n).show__item--on .show__n { background: var(--green-glow); color: var(--text-primary); }
    .show__info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
    .show__info strong {
      font-family: var(--display); font-weight: 600; font-size: 0.98rem;
      line-height: 1.3; color: var(--text-primary);
    }
    .show__info em {
      font-style: normal; font-family: var(--mono); font-size: 0.68rem;
      color: var(--text-secondary);
    }
    .show__info em b { color: var(--purple-500); font-weight: 700; }
    .show__cta {
      margin-top: 0.6rem; align-self: start;
      font-family: var(--mono); font-size: 0.8rem; font-weight: 500;
      color: var(--teal-700);
    }
    .show__cta:hover { color: var(--purple-500); }

    /* Escenario: marco tipo navegador + flechas */
    .show__stage { display: flex; align-items: center; gap: 0.9rem; min-width: 0; }
    .show__arrow {
      flex: none;
      width: 2.6rem; height: 2.6rem; border-radius: 50%;
      border: 1px solid var(--border-strong); background: var(--white);
      color: var(--teal-700); font-size: 1rem; cursor: pointer;
      transition: background var(--duration-fast) var(--ease-out),
                  color var(--duration-fast) var(--ease-out),
                  border-color var(--duration-fast) var(--ease-out),
                  transform var(--duration-fast) var(--ease-out);
    }
    .show__arrow:hover {
      background: var(--purple-500); border-color: var(--purple-500);
      color: var(--white); transform: scale(1.08);
    }
    .show__arrow:active { transform: scale(0.94); }

    .show__frame {
      display: block; flex: 1; min-width: 0;
      background: var(--white);
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    .show__bar {
      display: flex; align-items: center; gap: 0.4rem;
      padding: 0.7rem 1.1rem;
      border-bottom: 1px solid var(--border);
      background: var(--gray-light);
    }
    .show__dot { width: 9px; height: 9px; border-radius: 50%; }
    .show__dot--teal { background: var(--teal-700); }
    .show__dot--purple { background: var(--purple-500); }
    .show__dot--green { background: var(--green-glow); }
    .show__url {
      margin-left: 0.7rem;
      font-family: var(--mono); font-size: 0.66rem;
      color: var(--cocoa-500);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .show__screen { display: block; overflow: hidden; }
    .show__track { display: flex; will-change: transform; }
    .show__slide { flex: 0 0 100%; position: relative; aspect-ratio: 16 / 10; }
    .show__slide img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .show__placeholder {
      position: absolute; inset: 14px;
      border: 1px dashed var(--border-strong); border-radius: var(--radius-sm);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      gap: 0.4rem; text-align: center; padding: 1rem;
      color: var(--cocoa-500); font-size: 0.7rem; font-family: var(--mono);
    }
    .show__placeholder code { color: var(--teal-700); font-size: 0.64rem; word-break: break-all; }
    .show__slide:nth-child(3n + 1) .show__placeholder { background: var(--teal-100); border-color: rgba(42, 143, 157, 0.3); }
    .show__slide:nth-child(3n + 2) .show__placeholder { background: var(--purple-100); border-color: rgba(122, 79, 163, 0.3); }
    .show__slide:nth-child(3n) .show__placeholder { background: var(--green-glow-light); border-color: rgba(154, 166, 0, 0.35); }

    @media (max-width: 860px) {
      .show { grid-template-columns: 1fr; gap: 1.6rem; }
      .show__stage { order: -1; }
      .show__arrow { display: none; }
    }
  `]
})
export class CaseShowcaseComponent implements AfterViewInit, OnDestroy {
  i18n = inject(TranslateService);
  imgError = new Set<string>();
  active = signal(0);
  activeCase = computed(() => this.i18n.cases()[this.active()]);

  private host = inject(ElementRef<HTMLElement>);
  private entrance?: gsap.core.Timeline;

  go(i: number): void {
    const total = this.i18n.cases().length || 1;
    this.active.set(((i % total) + total) % total);
    const track = this.host.nativeElement.querySelector('.show__track');
    if (!track) { return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(track, { xPercent: -100 * this.active() });
      return;
    }
    gsap.to(track, { xPercent: -100 * this.active(), duration: 0.75, ease: 'power3.inOut' });
  }

  step(dir: number): void {
    this.go(this.active() + dir);
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    const root = this.host.nativeElement;

    // Entrada coreografiada: el marco cae con rebote, la lista
    // aparece en cascada y las flechas hacen pop al final.
    this.entrance = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 78%', once: true },
    });
    this.entrance
      .from(root.querySelector('.show__frame'), {
        y: 70, opacity: 0, rotation: 2.5, duration: 0.9, ease: 'back.out(1.4)',
      })
      .from(root.querySelectorAll('.show__item, .show__cta'), {
        x: -34, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out', clearProps: 'transform',
      }, '-=0.45')
      .from(root.querySelectorAll('.show__arrow'), {
        scale: 0, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'back.out(2)', clearProps: 'transform',
      }, '-=0.25');
  }

  ngOnDestroy(): void {
    this.entrance?.scrollTrigger?.kill();
    this.entrance?.kill();
  }
}

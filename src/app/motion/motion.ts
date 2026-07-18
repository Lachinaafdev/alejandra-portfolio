import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ============================================================
   Punto único de registro de ScrollTrigger: todo el proyecto
   importa gsap/ScrollTrigger desde aquí.
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ============================================================
   Parallax scrub sobre fondos absolutos (.work__bg): el fondo
   se desplaza de -6% a 6% mientras su contenedor cruza el
   viewport. Uso: <div class="work__bg" appParallax></div>
   ============================================================ */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private trigger?: ScrollTrigger;

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) { return; }
    const node = this.el.nativeElement;
    const tween = gsap.fromTo(node,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: node.parentElement ?? node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
    this.trigger = tween.scrollTrigger;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}

/* ============================================================
   Entradas de las cards de casos: tres variantes cíclicas por
   índice para que ninguna card repita animación.
     0 → cortina (clip-path de abajo hacia arriba)
     1 → desliza desde la izquierda
     2 → fade de la card + zoom-out de su .work__bg
   Uso: <a class="card" [appCaseEntrance]="index">
   ============================================================ */
@Directive({ selector: '[appCaseEntrance]', standalone: true })
export class CaseEntranceDirective implements AfterViewInit, OnDestroy {
  @Input('appCaseEntrance') index = 0;
  private el = inject(ElementRef<HTMLElement>);
  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) { return; }
    const node = this.el.nativeElement;
    const scrollTrigger = { trigger: node, start: 'top 82%', once: true } as const;

    switch (this.index % 3) {
      case 0: {
        const tween = gsap.fromTo(node,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger }
        );
        this.keep(tween.scrollTrigger);
        break;
      }
      case 1: {
        const tween = gsap.fromTo(node,
          { opacity: 0, x: -70 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger }
        );
        this.keep(tween.scrollTrigger);
        break;
      }
      case 2: {
        const bg = node.querySelector('.work__bg');
        const tl = gsap.timeline({ scrollTrigger });
        tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);
        if (bg) {
          tl.fromTo(bg, { scale: 1.25 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);
        }
        this.keep(tl.scrollTrigger);
        break;
      }
    }
  }

  private keep(trigger?: ScrollTrigger): void {
    if (trigger) { this.triggers.push(trigger); }
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
  }
}

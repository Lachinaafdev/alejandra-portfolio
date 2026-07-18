import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   appParallax — el elemento se desplaza yPercent -6 → 6 mientras
   su PADRE cruza el viewport (scrub). Pensado para fondos
   sobredimensionados (inset vertical negativo) que nunca dejan
   huecos al moverse.
   Uso: <span class="work__bg" appParallax></span>
   ============================================================ */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private tween?: gsap.core.Tween;

  ngOnInit(): void {
    if (prefersReducedMotion()) { return; }
    const node = this.el.nativeElement;
    this.tween = gsap.fromTo(node,
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
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}

/* ============================================================
   appCaseEntrance — entrada distinta por card según índice (mod 3):
   0 · cortina: clip-path inset(100% 0 0 0) → inset(0% 0 0 0)
   1 · desliza desde la izquierda: x -70 + fade
   2 · zoom-out: la card aparece y su .work__bg baja de scale 1.25 a 1
   Uso: <app-ticket-card [appCaseEntrance]="$index" />
   ============================================================ */
@Directive({ selector: '[appCaseEntrance]', standalone: true })
export class CaseEntranceDirective implements OnInit, OnDestroy {
  @Input({ alias: 'appCaseEntrance', required: true }) index = 0;
  private el = inject(ElementRef<HTMLElement>);
  private anims: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  ngOnInit(): void {
    if (prefersReducedMotion()) { return; }
    const node = this.el.nativeElement;
    const trigger = { trigger: node, start: 'top 82%', once: true };

    switch (this.index % 3) {
      case 0:
        this.anims.push(gsap.fromTo(node,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: trigger }
        ));
        break;
      case 1:
        this.anims.push(gsap.fromTo(node,
          { opacity: 0, x: -70 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: trigger }
        ));
        break;
      case 2: {
        const bg = node.querySelector('.work__bg');
        const tl = gsap.timeline({ scrollTrigger: trigger });
        tl.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);
        if (bg) {
          tl.fromTo(bg, { scale: 1.25 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);
        }
        this.anims.push(tl);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    for (const anim of this.anims) {
      anim.scrollTrigger?.kill();
      anim.kill();
    }
  }
}

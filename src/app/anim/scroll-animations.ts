import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   appImageReveal — la imagen (o su contenedor) se descubre con
   un clip-path ligado al progreso del scroll (scrub), estilo
   Facilpay. Direcciones: vertical | horizontal | diagonal.
   Uso: <div class="card__media" appImageReveal> · [revealDirection]="'diagonal'"
   ============================================================ */
const CLIPS = {
  vertical: {
    from: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    to: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
  },
  horizontal: {
    from: 'polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)',
    to: 'polygon(100% 0%, 100% 100%, 0% 100%, 0% 0%)',
  },
  diagonal: {
    from: 'polygon(100% 100%, 100% 100%, 100% 100%, 0% 100%)',
    to: 'polygon(100% 100%, 100% 0%, 0% 0%, 0% 100%)',
  },
} as const;

@Directive({ selector: '[appImageReveal]', standalone: true })
export class ImageRevealDirective implements OnInit, OnDestroy {
  @Input() revealDirection: keyof typeof CLIPS = 'vertical';
  private el = inject(ElementRef<HTMLElement>);
  private tween?: gsap.core.Tween;

  ngOnInit(): void {
    if (reducedMotion()) { return; }
    const clip = CLIPS[this.revealDirection];
    this.tween = gsap.fromTo(this.el.nativeElement,
      { clipPath: clip.from },
      {
        clipPath: clip.to,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: 'top 94%',
          end: 'top 45%',
          scrub: 0.6,
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
   appParallax — el elemento se desplaza en Y a otra velocidad
   mientras cruza el viewport (scrub). Pensado para <img> dentro
   de un contenedor con overflow hidden: se escala un poco para
   que el desplazamiento nunca deje huecos.
   Uso: <img appParallax /> · [parallaxY]="30"
   ============================================================ */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() parallaxY = 26;
  private el = inject(ElementRef<HTMLElement>);
  private tween?: gsap.core.Tween;

  ngOnInit(): void {
    if (reducedMotion()) { return; }
    const node = this.el.nativeElement;
    const scale = 1 + (this.parallaxY * 2) / (node.clientHeight || 300);
    this.tween = gsap.fromTo(node,
      { y: -this.parallaxY, scale: Math.max(scale, 1.08) },
      {
        y: this.parallaxY,
        scale: Math.max(scale, 1.08),
        ease: 'none',
        scrollTrigger: {
          trigger: node.parentElement ?? node,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    );
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}

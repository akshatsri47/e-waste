'use client';

import { useEffect } from 'react';

export default function GsapAnimations() {
  useEffect(() => {
    let ctx: any;

    (async () => {
      const gsapMod = await import('gsap');
      const gsap = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { SplitText } = await import('gsap/SplitText');

      gsap.registerPlugin(ScrollTrigger, SplitText);

      // ── inject curtain DOM ─────────────────────────────────────────
      const curtain = document.createElement('div');
      curtain.id = 'gsap-curtain';
      curtain.style.cssText = `
        position:fixed;inset:0;z-index:8888;pointer-events:none;
        display:flex;flex-direction:row;
      `;
      const PANELS = 4;
      for (let i = 0; i < PANELS; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
          flex:1;height:100%;
          background:${i % 2 === 0 ? '#0d1f0d' : '#1a3a1a'};
        `;
        curtain.appendChild(p);
      }
      document.body.appendChild(curtain);

      // ── preloader finishes at ~2.5s ────────────────────────────────
      // The preloader clip-path wipe takes ~0.9s starting ~1.6s in
      const INTRO_START = 2.55; // seconds after page load

      ctx = gsap.context(() => {

        /* ════════════════════════════════════════════════════
           ACT 1 — Curtain panels slide up (staggered)
           Signature Awwwards reveal — each panel peels away
        ════════════════════════════════════════════════════ */
        const panels = curtain.querySelectorAll('div');
        gsap.set(panels, { yPercent: 0 });
        gsap.to(panels, {
          yPercent: -105,
          duration: 1.1,
          stagger: 0.07,
          ease: 'power4.inOut',
          delay: INTRO_START,
          onComplete: () => curtain.remove(),
        });

        /* ACT 2 — Nav drop in */
        gsap.fromTo('#landing-nav',
          { yPercent: -100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: INTRO_START + 0.6 }
        );

        /* ACT 3 — Hero badge slides down */
        gsap.fromTo('#hero-badge',
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: INTRO_START + 0.75 }
        );

        /* ACT 4 — Headline: SplitText masked line roll-up */
        const headlineEl = document.querySelector<HTMLElement>('#hero-headline');
        if (headlineEl) {
          // Make visible so SplitText can measure it
          gsap.set(headlineEl, { opacity: 1 });
          try {
            const split = new SplitText(headlineEl, { type: 'lines' });
            split.lines.forEach((line: Element) => {
              const wrap = document.createElement('div');
              wrap.style.cssText = 'overflow:hidden;display:block;';
              line.parentNode!.insertBefore(wrap, line);
              wrap.appendChild(line);
              (line as HTMLElement).style.display = 'block';
            });
            gsap.fromTo(split.lines,
              { yPercent: 110 },
              { yPercent: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out', delay: INTRO_START + 0.85 }
            );
          } catch {
            gsap.fromTo(headlineEl,
              { opacity: 0, y: 60 },
              { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: INTRO_START + 0.85 }
            );
          }
        }

        /* ACT 5 — Images: scale from 1.18 → 1.0 (zoom-out snap-in) */
        gsap.fromTo('#hero-back-img',
          { scale: 1.18, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: 'power3.out', delay: INTRO_START + 0.55, transformOrigin: 'center center' }
        );
        gsap.fromTo('#hero-front-img',
          { scale: 1.18, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: 'power3.out', delay: INTRO_START + 0.72, transformOrigin: 'center center' }
        );

        /* ACT 6 — Stat card: slide + tilt */
        gsap.fromTo('#hero-stat-card',
          { x: -60, opacity: 0, rotateZ: -4 },
          { x: 0, opacity: 1, rotateZ: 0, duration: 1.0, ease: 'power3.out', delay: INTRO_START + 1.0, transformPerspective: 800 }
        );

        /* ACT 7 — CTA pill pop */
        gsap.fromTo('#hero-cta-btn',
          { opacity: 0, y: 24, scale: 0.88 },
          { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.8)', delay: INTRO_START + 1.15 }
        );

        /* ACT 8 — Bottom row rise up */
        gsap.fromTo(['#hero-green-card', '#hero-desc'],
          { opacity: 0, y: 70 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.15, delay: INTRO_START + 1.1 }
        );

        /* ACT 9 — Social pills stagger from right */
        gsap.fromTo('.hero-social-pill',
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: INTRO_START + 1.25 }
        );

        /* ══════════════════════════════════════════════════════
           PARALLAX & SCROLLTRIGGERS — delayed to prevent conflict with intro
        ══════════════════════════════════════════════════════ */
        setTimeout(() => {
          gsap.to('#hero-back-img', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom top', scrub: 1.6 },
            yPercent: -24, ease: 'none',
          });
          gsap.to('#hero-front-img', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom top', scrub: 2.2 },
            yPercent: -14, ease: 'none',
          });
          gsap.to('#hero-stat-card', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: '50% top', scrub: 1.0 },
            yPercent: 40, ease: 'none',
          });
          gsap.to('#hero-green-card', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: '40% top', scrub: 1.2 },
            yPercent: -10, ease: 'none',
          });
          gsap.to('#hero-desc', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: '40% top', scrub: 1.5 },
            yPercent: -14, ease: 'none',
          });
          gsap.to('#hero-headline', {
            scrollTrigger: { trigger: 'main', start: 'top top', end: '30% top', scrub: 1.0 },
            yPercent: -10, opacity: 0.4, ease: 'none',
          });

          // All .parallax-img images drift up on scroll
          document.querySelectorAll<HTMLElement>('.parallax-img').forEach(img => {
            gsap.to(img, {
              scrollTrigger: {
                trigger: img.closest('section') ?? img.parentElement!,
                start: 'top bottom', end: 'bottom top', scrub: 1.8,
              },
              yPercent: -18, ease: 'none',
            });
          });

          // Footer EVOLVE parallax
          gsap.to('#footer-evolve', {
            scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            y: -100, ease: 'none',
          });

          /* ══════════════════════════════════════════════════════
             SCROLL REVEALS
          ══════════════════════════════════════════════════════ */
          const reveal = (sel: string, vars: object) =>
            gsap.from(sel, { scrollTrigger: { trigger: sel, start: 'top 84%' }, ...vars });

          reveal('#stats-section',   { opacity: 0, y: 50,  duration: 0.9,  ease: 'power3.out' });
          reveal('.service-card',    { opacity: 0, y: 64, scale: 0.93, duration: 0.8, stagger: 0.13, ease: 'power3.out' });
          /* ══════════════════════════════════════════════════════
             WHY CHOOSE US — 4 dedicated animations
          ══════════════════════════════════════════════════════ */

          // 1 ── STAGGERED FADE-UP REVEAL (.why-point)
          //      Left points slide in from left, right points from right,
          //      each staggered 0.18 s so they feel like a cascading reveal.
          gsap.from('.why-point', {
            scrollTrigger: { trigger: '.why-point', start: 'top 82%' },
            opacity: 0,
            y: 48,
            duration: 0.85,
            stagger: {
              each: 0.18,
              from: 'start',
            },
            ease: 'power3.out',
          });

          // 2 ── SCALE-IN IMAGE ENTRANCE (#why-center-img)
          //      Starts scaled down + slightly blurred, pops into full size
          //      with a spring-like overshoot for a premium feel.
          gsap.from('#why-center-img', {
            scrollTrigger: { trigger: '#why-center-img', start: 'top 80%' },
            opacity: 0,
            scale: 0.72,
            filter: 'blur(10px)',
            duration: 1.15,
            ease: 'back.out(1.6)',
          });

          // 3 ── SCROLL-TRIGGERED PARALLAX IMAGE (img inside #why-center-img)
          //      The pill image drifts upward independently as the page scrolls,
          //      creating a subtle depth / Ken-Burns effect.
          const whyCenterInner = document.querySelector<HTMLElement>('#why-center-img img');
          if (whyCenterInner) {
            gsap.to(whyCenterInner, {
              scrollTrigger: {
                trigger: '#why-center-img',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.6,
              },
              yPercent: -18,
              scale: 1.08,
              ease: 'none',
            });
          }

          // 4 ── HOVER MICRO-INTERACTION (.why-point)
          //      On mouse-enter: card lifts, slight tilt toward cursor, accent
          //      number brightens, and a soft drop-shadow blooms.
          //      On mouse-leave: everything springs back cleanly.
          document.querySelectorAll<HTMLElement>('.why-point').forEach((el, idx) => {
            const dir = idx < 2 ? -1 : 1; // left group tilts left, right tilts right
            const numEl = el.querySelector<HTMLElement>('span');

            el.addEventListener('mouseenter', () => {
              gsap.to(el, {
                y: -8,
                rotateZ: dir * 1.2,
                boxShadow: '0 16px 40px rgba(122,154,58,0.18)',
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto',
              });
              if (numEl) {
                gsap.to(numEl, {
                  color: '#7A9A3A',
                  scale: 1.12,
                  duration: 0.3,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            });

            el.addEventListener('mouseleave', () => {
              gsap.to(el, {
                y: 0,
                rotateZ: 0,
                boxShadow: 'none',
                duration: 0.45,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              if (numEl) {
                gsap.to(numEl, {
                  color: '#ccc',
                  scale: 1,
                  duration: 0.35,
                  ease: 'power3.out',
                  overwrite: 'auto',
                });
              }
            });
          });
          reveal('#faq-section',     { opacity: 0, y: 48,  duration: 0.9,  ease: 'power3.out' });
          reveal('#cta-card',        { opacity: 0, scale: 0.9, y: 40, duration: 1.1, ease: 'power3.out' });

          /* ══════════════════════════════════════════════════════
             SPLIT TEXT + COLOUR WAVE — #wave-intro
             Each char rolls up through an overflow:hidden mask,
             then a green wave sweeps & reverses (yoyo)
          ══════════════════════════════════════════════════════ */
          const waveEl = document.querySelector<HTMLElement>('#wave-intro');
          if (waveEl) {
            // Make visible so SplitText can measure layout
            gsap.set(waveEl, { opacity: 1 });

            ScrollTrigger.create({
              trigger: '#wave-intro-wrap',
              start: 'top 80%',
              once: true,
              onEnter: () => {
                // Split into individual chars
                const split = new SplitText(waveEl, { type: 'chars,words' });

                // Wrap every char in an overflow:hidden clip mask
                split.chars.forEach((c: Element) => {
                  const mask = document.createElement('span');
                  mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
                  c.parentNode!.insertBefore(mask, c);
                  mask.appendChild(c);
                });

                // ACT 1 — chars roll up staggered
                const tl = gsap.timeline();
                tl.fromTo(split.chars,
                  { yPercent: 110 },
                  {
                    yPercent: 0,
                    duration: 0.75,
                    stagger: 0.018,
                    ease: 'power4.out',
                  }
                )
                // ACT 2 — green colour wave sweeps left-to-right then back
                .to(split.chars, {
                  color: '#7A9A3A',
                  duration: 0.3,
                  stagger: 0.02,
                  ease: 'power2.out',
                  yoyo: true,
                  repeat: 1,
                }, '>-0.2');
              },
            });

            // Parallax: section drifts up slowly as page scrolls
            gsap.to('#wave-intro-wrap', {
              scrollTrigger: {
                trigger: '#wave-intro-wrap',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
              yPercent: -6,
              ease: 'none',
            });
          }

          /* ══════════════════════════════════════════════════════
             BODY BG COLOR TRANSITION on scroll into Services
          ══════════════════════════════════════════════════════ */
          ScrollTrigger.create({
            trigger: '#services',
            start: 'top 60%', end: 'bottom 40%',
            onEnter:     () => gsap.to('body', { backgroundColor: '#1a2e1a', duration: 0.7, ease: 'power2.inOut' }),
            onLeave:     () => gsap.to('body', { backgroundColor: '#f0f0ec', duration: 0.7, ease: 'power2.inOut' }),
            onEnterBack: () => gsap.to('body', { backgroundColor: '#1a2e1a', duration: 0.7, ease: 'power2.inOut' }),
            onLeaveBack: () => gsap.to('body', { backgroundColor: '#f0f0ec', duration: 0.7, ease: 'power2.inOut' }),
          });
          
          ScrollTrigger.refresh();
        }, (INTRO_START + 1.5) * 1000);

      });
    })();

    return () => { ctx?.revert?.(); };
  }, []);

  return null;
}

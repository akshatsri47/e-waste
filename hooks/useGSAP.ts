'use client';

import { useCallback } from 'react';

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function splitIntoChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.innerHTML = '';
  return text.split('').map(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.cssText = 'display:inline-block;';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    el.appendChild(span);
    return span;
  });
}

/* ─────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────── */
export function useTextAnimation() {

  /** Each char flies up from below its overflow:hidden parent */
  const splitTextAnimation = useCallback(async (
    el: HTMLElement,
    opts?: { duration?: number; stagger?: number; delay?: number }
  ) => {
    const gsapMod = await import('gsap');
    const gsap = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;

    const { duration = 0.8, stagger = 0.025, delay = 0 } = opts ?? {};
    const chars = splitIntoChars(el);

    // Wrap each char in an overflow:hidden mask
    chars.forEach(c => {
      const wrap = document.createElement('span');
      wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      c.parentNode!.insertBefore(wrap, c);
      wrap.appendChild(c);
    });

    gsap.set(el, { opacity: 1 });
    gsap.fromTo(chars,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration, stagger, delay, ease: 'power4.out' }
    );
  }, []);

  /** Green colour wave rolls across revealed chars */
  const colorWaveAnimation = useCallback(async (
    el: HTMLElement,
    opts?: { delay?: number; waveColor?: string; baseColor?: string }
  ) => {
    const gsapMod = await import('gsap');
    const gsap = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;

    const { delay = 0, waveColor = '#7A9A3A', baseColor = '#1b1c1c' } = opts ?? {};
    const chars = Array.from(el.querySelectorAll<HTMLElement>('.char'));

    gsap.fromTo(chars,
      { color: baseColor },
      {
        color: waveColor,
        duration: 0.4,
        stagger: 0.03,
        delay,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      }
    );
  }, []);

  return { splitTextAnimation, colorWaveAnimation };
}

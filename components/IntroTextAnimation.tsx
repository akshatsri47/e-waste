'use client';

import { useRef, useEffect } from 'react';
import { useTextAnimation } from '@/hooks/useGSAP';

export default function IntroTextAnimation() {
  const textRef  = useRef<HTMLHeadingElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const hasRun   = useRef(false);

  const { splitTextAnimation, colorWaveAnimation } = useTextAnimation();

  /* ── Scroll-triggered entrance + colour wave ── */
  useEffect(() => {
    if (!textRef.current || !wrapRef.current) return;

    const el   = textRef.current;
    const wrap = wrapRef.current;

    let st: any;

    (async () => {
      const gsapMod = await import('gsap');
      const gsap    = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      /* ── hide until in view ── */
      gsap.set(el, { opacity: 0 });

      st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (hasRun.current) return;
          hasRun.current = true;

          // ACT 1 – chars roll up
          splitTextAnimation(el, { duration: 0.9, stagger: 0.022, delay: 0 });

          // ACT 2 – green colour wave after chars are in
          setTimeout(() => colorWaveAnimation(el, { delay: 0.1 }), 1000);
        },
      });

      /* ── Parallax: section drifts up as user scrolls ── */
      gsap.to(wrap, {
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.4,
        },
        yPercent: -8,
        ease: 'none',
      });
    })();

    return () => { st?.kill(); };
  }, [splitTextAnimation, colorWaveAnimation]);

  return (
    <div
      ref={wrapRef}
      style={{
        backgroundColor: '#f0f0ec',
        width: '100%',
        padding: '80px 0 40px',
        overflow: 'hidden',          /* clips parallax overshoot */
      }}
    >
      {/* decorative line */}
      <div style={{
        width: '1px', height: '60px',
        background: 'linear-gradient(to bottom, transparent, #7A9A3A)',
        margin: '0 auto 36px',
      }} />

      <section style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center',
      }}>
        {/* kicker */}
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#7A9A3A', marginBottom: '28px',
        }}>
          Project Evolve &nbsp;·&nbsp; Our Mission
        </p>

        {/* animated headline */}
        <h2
          ref={textRef}
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 4.2rem)',
            fontWeight: 800,
            color: '#1b1c1c',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          We are decoding the future of sustainable hardware lifecycles.
        </h2>

        {/* supporting line */}
        <p style={{
          marginTop: '32px', fontSize: '17px', color: '#666',
          lineHeight: 1.65, maxWidth: '640px', margin: '32px auto 0',
        }}>
          Transforming how enterprises retire, recover and re-purpose
          electronic assets — zero landfill, full compliance, certified impact.
        </p>
      </section>

      {/* bottom decorative line */}
      <div style={{
        width: '1px', height: '60px',
        background: 'linear-gradient(to bottom, #7A9A3A, transparent)',
        margin: '40px auto 0',
      }} />
    </div>
  );
}

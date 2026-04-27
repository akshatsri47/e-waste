'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── Custom Cursor ──────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!(t.closest('a,button,[data-cursor-expand]')));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`;
      }
      if (ringRef.current) {
        const r = hovering ? 36 : 20;
        ringRef.current.style.transform = `translate(${ring.current.x - r}px, ${ring.current.y - r}px)`;
        ringRef.current.style.width = `${r * 2}px`;
        ringRef.current.style.height = `${r * 2}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [hovering]);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 10, height: 10, borderRadius: '50%',
          backgroundColor: '#006036', pointerEvents: 'none',
          zIndex: 9999, mixBlendMode: 'multiply',
          transition: 'transform 0.05s linear',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 40, height: 40, borderRadius: '50%',
          border: `1.5px solid rgba(0,96,54,${hovering ? 0.7 : 0.35})`,
          pointerEvents: 'none', zIndex: 9998,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease',
        }}
      />
    </>
  );
}

/* ─── Hero Mouse Tilt + Parallax ────────────────────────────────── */
function HeroTilt() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const frontImg = document.getElementById('hero-front-img');
    const backImg = document.getElementById('hero-back-img');
    const statCard = document.getElementById('hero-stat-card');
    const headline = document.getElementById('hero-headline');

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;  // -0.5 to 0.5
      const dy = (e.clientY - cy) / rect.height;

      // Parallax layers
      if (backImg) backImg.style.transform = `translate(${dx * -18}px, ${dy * -10}px)`;
      if (frontImg) frontImg.style.transform = `translate(${dx * -28}px, ${dy * -14}px)`;
      if (statCard) statCard.style.transform = `translate(${dx * 14}px, ${dy * 10}px) rotate(${dx * 2}deg)`;
      if (headline) headline.style.transform = `translate(${dx * 8}px, ${dy * 4}px)`;
    };

    const handleLeave = () => {
      [backImg, frontImg, statCard, headline].forEach(el => {
        if (el) el.style.transform = '';
      });
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // Invisible overlay that covers the hero section
  return (
    <div
      ref={sectionRef}
      id="hero-tilt-overlay"
      style={{
        position: 'absolute', inset: 0,
        zIndex: 30, pointerEvents: 'none',
      }}
    />
  );
}

/* ─── Animated Counter ───────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startOnVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) setTriggered(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered, startOnVisible]);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);

  return { count, ref };
}

function AnimatedStat({
  value,
  suffix = '',
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || ran.current) return;
      ran.current = true;
      observer.disconnect();

      // kick off after caller-specified delay
      setTimeout(async () => {
        const gsapMod = await import('gsap');
        const gsap = (gsapMod as any).default ?? (gsapMod as any).gsap ?? gsapMod;

        const DIGITS = '0123456789';
        const totalMs = 1600;
        const fps = 60;
        const frames = (totalMs / 1000) * fps;
        let frame = 0;

        const tick = () => {
          frame++;
          const progress = frame / frames;
          const lockCount = Math.floor(progress * String(value).length);
          const valueStr = String(value);
          let display = '';

          for (let i = 0; i < valueStr.length; i++) {
            if (i < lockCount) {
              display += valueStr[i];
            } else {
              display += DIGITS[Math.floor(Math.random() * DIGITS.length)];
            }
          }
          el.textContent = display + suffix;

          if (frame < frames) requestAnimationFrame(tick);
          else {
            el.textContent = value + suffix;
            // green flash finish
            gsap.fromTo(el, { color: '#7A9A3A' }, { color: '#1b1c1c', duration: 0.6, ease: 'power2.out' });
          }
        };

        // entrance pop
        gsap.fromTo(wrap,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
        el.textContent = '0'.repeat(String(value).length) + suffix;
        requestAnimationFrame(tick);
      }, delay * 1000);
    }, { threshold: 0.5 });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [value, suffix, delay]);

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0 }}>
      <span
        ref={numRef}
        style={{
          fontSize: '48px', fontWeight: 800, color: '#1b1c1c',
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em',
          fontFamily: 'monospace',
        }}
      >
        {'0'.repeat(String(value).length)}{suffix}
      </span>
      <span style={{
        fontSize: '13px', color: '#6f7a70', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        {label}
      </span>
    </div>
  );
}


/* ─── FAQ Accordion ─────────────────────────────────────────────── */
const FAQ_DATA = [
  {
    q: 'What types of e-waste can I recycle?',
    a: 'You can recycle items like phones, laptops, tablets, chargers, and small electronic devices. You’ll see all supported items when scheduling a pickup.',
  },
  {
    q: 'How does the pickup process work?',
    a: 'We use DoD 5220.22-M certified data wiping and physical destruction processes, issuing a Certificate of Destruction for every device processed.',
  },
  {
    q: 'Can I drop off my e-waste instead of scheduling a pickup?',
    a: 'Yes. You can find nearby verified recycling centers using the map and choose a convenient drop-off option.',
  },
  {
    q: ' Do I get anything in return for recycling?',
    a: 'Yes. You earn tokens for every device you recycle, which can be redeemed for rewards and benefits.',
  },
  {
    q: 'How do you ensure my devices are handled safely?',
    a: 'We work with trusted and certified recycling partners to ensure every device is processed responsibly and with full transparency.',
  },
];

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {FAQ_DATA.map((item, i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid rgba(190,201,190,0.4)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '24px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', gap: '16px',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1b1c1c' }}>{item.q}</span>
            <span
              className="material-symbols-outlined"
              style={{
                color: '#316944', fontSize: '22px', flexShrink: 0,
                display: 'inline-block',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              add
            </span>
          </button>

          {/* Smooth slide */}
          <div
            style={{
              maxHeight: open === i ? '200px' : '0px',
              opacity: open === i ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
            }}
          >
            <p style={{ fontSize: '14px', color: '#6f7a70', lineHeight: 1.7, paddingBottom: '24px' }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Ambient Blob Background ───────────────────────────────────── */
function AmbientBlobs() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        zIndex: 0, overflow: 'hidden',
      }}
    >
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />
    </div>
  );
}

/* ─── Stat Counter (hero 99%) pulse ────────────────────────────── */
function HeroStatPulse() {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let v = 0;
    const timer = setInterval(() => {
      v += 3;
      if (v >= 99) { setCount(99); clearInterval(timer); }
      else setCount(v);
    }, 20);
    return () => clearInterval(timer);
  }, [started]);

  return (
    <div ref={ref} style={{ fontSize: '48px', fontWeight: 500, color: '#1b1c1c', lineHeight: 1 }}>
      {count}%
    </div>
  );
}

/* ─── Root Export ────────────────────────────────────────────────── */
export default function LandingAnimations() {
  return (
    <>
      <CustomCursor />
      <AmbientBlobs />
      <HeroTilt />
    </>
  );
}

export { AnimatedStat, FaqAccordion, HeroStatPulse };

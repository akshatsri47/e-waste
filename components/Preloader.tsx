'use client';

import { useEffect, useRef, useState } from 'react';

const TAGS = ['#ZeroWaste', '#EcoTech', '#CircularEconomy', '#ProjectEvolve', '#GreenFuture'];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [tagIdx, setTagIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cycle hashtags
    const tagTimer = setInterval(() => {
      setTagIdx(i => (i + 1) % TAGS.length);
    }, 420);

    // Count up 0 → 100
    let v = 0;
    const step = () => {
      v += Math.random() * 4 + 1;
      if (v >= 100) {
        v = 100;
        setCount(100);
        clearInterval(countTimer);
        clearInterval(tagTimer);
        // Brief hold then exit
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => setDone(true), 900);
        }, 300);
      } else {
        setCount(Math.floor(v));
      }
    };
    const countTimer = setInterval(step, 40);

    return () => {
      clearInterval(tagTimer);
      clearInterval(countTimer);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: '#0d1f0d',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transition: exiting ? 'clip-path 0.85s cubic-bezier(0.76,0,0.24,1)' : 'none',
        clipPath: exiting ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)',
      }}
    >
      {/* Grid dots background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'radial-gradient(circle, #b3f1c2 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Big faded # */}
      <div style={{
        position: 'absolute',
        fontSize: '55vw', fontWeight: 900,
        color: 'rgba(179,241,194,0.04)',
        lineHeight: 1, letterSpacing: '-0.05em',
        userSelect: 'none', pointerEvents: 'none',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s',
      }}>#</div>

      {/* Cycling hashtag */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', marginBottom: '48px',
      }}>
        <div
          key={tagIdx}
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800, color: '#b3f1c2',
            letterSpacing: '-0.03em',
            animation: 'tagIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {TAGS[tagIdx]}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(179,241,194,0.4)', marginTop: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Enterprise E-Waste Platform
        </div>
      </div>

      {/* Progress bar + counter */}
      <div style={{ position: 'relative', zIndex: 2, width: '280px', textAlign: 'center' }}>
        <div style={{
          width: '100%', height: '2px',
          backgroundColor: 'rgba(179,241,194,0.15)',
          borderRadius: '2px', overflow: 'hidden',
          marginBottom: '16px',
        }}>
          <div
            ref={barRef}
            style={{
              height: '100%',
              width: `${count}%`,
              background: 'linear-gradient(90deg, #3a5c3a, #b3f1c2)',
              borderRadius: '2px',
              transition: 'width 0.08s linear',
              boxShadow: '0 0 12px rgba(179,241,194,0.6)',
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: 'rgba(179,241,194,0.5)', letterSpacing: '0.1em', fontVariantNumeric: 'tabular-nums' }}>
          {String(count).padStart(3, '0')}%
        </span>
      </div>

      {/* Bottom logo */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '8px',
        color: 'rgba(179,241,194,0.3)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
        zIndex: 2,
      }}>
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
          <path d="M4 14C4 8.477 8.477 4 14 4s10 4.477 10 10-4.477 10-10 10S4 19.523 4 14z" fill="rgba(179,241,194,0.4)"/>
          <path d="M10 14l3 3 5-6" stroke="rgba(179,241,194,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        PROJECT EVOLVE
      </div>

      <style>{`
        @keyframes tagIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

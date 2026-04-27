"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import LandingAnimations, { AnimatedStat, FaqAccordion, HeroStatPulse } from '@/components/LandingAnimations'
import ScrollAnimation from '@/components/ScrollAnimation'
import GsapAnimations from '@/components/GsapAnimations'
import Preloader from '@/components/Preloader'

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
      setScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.evolve-reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0ec', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%' }}>
      <Preloader />
      <LandingAnimations />
      <GsapAnimations />


      <div className="evolve-vars">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

          .evolve-vars {
            --bg: #f2f4f0;
            --white: #ffffff;
            --dark: #1a2410;
            --green-deep: #2d4a1e;
            --green-mid: #4a7c2f;
            --green-accent: #6db33f;
            --green-light: #a8d47a;
            --green-pale: #dff0c8;
            --green-card: #7a9e4e;
            --text-muted: #6b7a5e;
            --border: rgba(74,124,47,0.15);
            --shadow: 0 20px 60px rgba(29,64,15,0.12);
            --radius: 20px;
            --radius-sm: 12px;
          }

          .evolve-nav {
            font-family: 'DM Sans', sans-serif;
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; align-items: center; justify-content: space-between;
            padding: 18px 60px;
            background: rgba(242,244,240,0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
            transition: all 0.4s ease;
          }
          .evolve-nav.scrolled { padding: 12px 60px; background: rgba(242,244,240,0.97); }

          .evolve-logo {
            display: flex; align-items: center; gap: 10px;
            font-family: 'Syne', sans-serif; font-weight: 800;
            font-size: 1.25rem; color: var(--green-deep); text-decoration: none;
          }
          .evolve-logo-icon {
            width: 34px; height: 34px; background: var(--green-mid);
            border-radius: 8px; display: grid; place-items: center;
          }
          .evolve-logo-icon svg { width: 18px; height: 18px; fill: white; }

          .evolve-nav-links {
            display: flex; align-items: center; gap: 36px; list-style: none; margin: 0; padding: 0;
          }
          .evolve-nav-links a {
            font-size: 0.9rem; font-weight: 400; color: var(--dark);
            text-decoration: none; letter-spacing: 0.01em;
            transition: color 0.2s;
          }
          .evolve-nav-links a:hover { color: var(--green-mid); }

          .evolve-nav-cta {
            display: flex; align-items: center; gap: 10px;
          }
          .evolve-btn-contact {
            padding: 10px 24px; border: 1.5px solid var(--dark);
            border-radius: 100px; font-size: 0.85rem; font-weight: 600;
            font-family: 'Syne', sans-serif; letter-spacing: 0.05em;
            background: transparent; color: var(--dark); cursor: pointer;
            text-decoration: none; transition: all 0.25s;
          }
          .evolve-btn-contact:hover { background: var(--dark); color: white; }
          .evolve-btn-phone {
            width: 40px; height: 40px; background: var(--green-mid);
            border-radius: 50%; display: grid; place-items: center;
            cursor: pointer; transition: background 0.25s;
          }
          .evolve-btn-phone:hover { background: var(--green-deep); }
          .evolve-btn-phone svg { width: 16px; height: 16px; fill: white; }

          .evolve-hero {
            font-family: 'DM Sans', sans-serif;
            min-height: 100vh;
            display: grid; grid-template-columns: 1fr 1fr;
            align-items: center; gap: 40px;
            padding: 120px 60px 60px;
            position: relative; overflow: hidden;
            background: var(--bg);
          }

          .evolve-hero-bg {
            position: absolute; inset: 0; pointer-events: none; overflow: hidden;
          }
          .evolve-hero-bg svg { width: 100%; height: 100%; opacity: 0.06; }

          .evolve-hero-left { position: relative; z-index: 2; }

          .evolve-hero-label {
            display: inline-flex; align-items: center; gap: 8px;
            color: var(--green-mid); font-size: 0.85rem; font-weight: 500;
            margin-bottom: 28px; letter-spacing: 0.02em;
          }
          .evolve-hero-label::before {
            content: ''; width: 6px; height: 6px; background: var(--green-accent);
            border-radius: 50%;
          }

          .evolve-hero-title {
            font-family: 'Syne', sans-serif; font-weight: 800;
            font-size: clamp(3rem, 5.5vw, 5.5rem);
            line-height: 0.96; letter-spacing: -0.02em;
            color: var(--green-deep); margin-bottom: 36px; margin-top: 0;
          }
          .evolve-hero-title .accent { color: var(--green-accent); }

          .evolve-hero-sub {
            font-size: 1.05rem; color: var(--text-muted); line-height: 1.65;
            max-width: 400px; margin-bottom: 48px; font-weight: 300; margin-top: 0;
          }

          .evolve-hero-actions { display: flex; align-items: center; gap: 20px; }

          .evolve-btn-primary {
            display: inline-flex; align-items: center; gap: 12px;
            padding: 16px 32px; background: var(--dark);
            color: white; border-radius: 100px;
            font-family: 'Syne', sans-serif; font-weight: 600;
            font-size: 0.85rem; letter-spacing: 0.08em; text-decoration: none;
            text-transform: uppercase; cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
            border: none;
          }
          .evolve-btn-primary:hover { background: var(--green-deep); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(29,64,15,0.25); }
          .evolve-btn-primary .arrow {
            width: 28px; height: 28px; background: var(--green-accent);
            border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
          }
          .evolve-btn-primary .arrow svg { width: 12px; height: 12px; }

          .evolve-btn-outline {
            display: inline-flex; align-items: center; gap: 8px;
            color: var(--green-mid); font-weight: 500; font-size: 0.9rem;
            text-decoration: none; cursor: pointer;
            transition: gap 0.2s;
          }
          .evolve-btn-outline:hover { gap: 14px; }

          .evolve-hero-right {
            position: relative; height: 520px; z-index: 2;
          }

          .evolve-hero-card {
            position: absolute; border-radius: var(--radius);
            overflow: hidden; box-shadow: var(--shadow);
            transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
          }
          .evolve-hero-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .evolve-hero-card:hover { transform: scale(1.02) translateY(-4px); }

          .evolve-card-main { right: 0; top: 0; width: 65%; height: 420px; }
          .evolve-card-secondary { left: 0; bottom: 0; width: 52%; height: 300px; }

          .evolve-stat-bubble {
            position: absolute; top: 60px; left: 50%;
            transform: translateX(-50%);
            background: white; border-radius: var(--radius);
            padding: 22px 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.12);
            z-index: 10; min-width: 200px;
            animation: evolveFloat 4s ease-in-out infinite;
          }
          @keyframes evolveFloat {
            0%,100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-8px); }
          }
          .evolve-stat-bubble .num {
            font-family: 'Syne', sans-serif; font-weight: 800;
            font-size: 2.4rem; color: var(--green-deep); line-height: 1;
            margin-bottom: 6px;
          }
          .evolve-stat-bubble .label { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
          .evolve-stat-bubble .icon {
            width: 38px; height: 38px; background: var(--green-mid);
            border-radius: 50%; display: grid; place-items: center; margin-top: 14px;
          }
          .evolve-stat-bubble .icon svg { width: 16px; height: 16px; fill: white; }

          .evolve-green-card {
            position: absolute; left: 60px; bottom: 60px;
            background: var(--green-card); border-radius: var(--radius);
            padding: 28px; max-width: 320px; z-index: 5;
            box-shadow: var(--shadow);
          }
          .evolve-green-card h3 {
            font-family: 'Syne', sans-serif; font-weight: 700;
            font-size: 1.15rem; color: white; text-transform: uppercase;
            letter-spacing: 0.02em; margin-bottom: 12px; margin-top: 0;
          }
          .evolve-green-card p { font-size: 0.85rem; color: rgba(255,255,255,0.75); line-height: 1.55; margin: 0; }

          .evolve-social-bar {
            position: fixed; right: 28px; top: 50%;
            transform: translateY(-50%); z-index: 90;
            display: flex; flex-direction: column; gap: 10px;
          }
          .evolve-social-btn {
            width: 38px; height: 38px; background: white;
            border-radius: 50%; display: grid; place-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            cursor: pointer; transition: all 0.25s;
            text-decoration: none;
          }
          .evolve-social-btn:hover { background: var(--green-mid); }
          .evolve-social-btn:hover svg { fill: white; }
          .evolve-social-btn svg { width: 14px; height: 14px; fill: var(--dark); transition: fill 0.25s; }

          .evolve-progress-bar {
            position: fixed; top: 0; left: 0; right: 0; height: 3px;
            background: var(--green-accent); transform-origin: left;
            transform: scaleX(0); z-index: 200;
            transition: transform 0.1s linear;
          }

          @keyframes evolveHeroSlideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: none; }
          }
          .evolve-hero-left > * { animation: evolveHeroSlideUp 0.8s cubic-bezier(0.34,1.56,0.64,1) both; }
          .evolve-hero-left .evolve-hero-label { animation-delay: 0.1s; }
          .evolve-hero-left .evolve-hero-title { animation-delay: 0.2s; }
          .evolve-hero-left .evolve-hero-sub { animation-delay: 0.3s; }
          .evolve-hero-left .evolve-hero-actions { animation-delay: 0.4s; }

          @keyframes evolveHeroSlideRight {
            from { opacity: 0; transform: translateX(60px); }
            to { opacity: 1; transform: none; }
          }
          .evolve-hero-right { animation: evolveHeroSlideRight 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
          
          .evolve-reveal {
            opacity: 0; transform: translateY(40px);
            transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1);
          }
          .evolve-reveal.visible { opacity: 1; transform: none; }
        `}</style>

        <div className="evolve-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }}></div>

        <nav className={`evolve-nav ${scrolled ? 'scrolled' : ''}`}>
          <Link href="#hero" className="evolve-logo">
            <div className="evolve-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" /></svg>
            </div>
            Evolve
          </Link>

          <ul className="evolve-nav-links">
            <li><Link href="#hero">Home</Link></li>
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#services">Our Services</Link></li>
            <li><Link href="#why">Why Us</Link></li>
            <li><Link href="#faq">FAQ</Link></li>
          </ul>

          <div className="evolve-nav-cta">
            <Link href="/login" className="evolve-btn-contact">Get Started</Link>
            <div className="evolve-btn-phone">
              <svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
            </div>
          </div>
        </nav>

        <div className="evolve-social-bar">
          <Link className="evolve-social-btn" href="#">
            <svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
          </Link>
          <Link className="evolve-social-btn" href="#">
            <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </Link>
          <Link className="evolve-social-btn" href="#">
            <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path fill="var(--bg)" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link>
        </div>

        <section id="hero" className="evolve-hero">
          <div className="evolve-hero-bg">
            <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <path d="M100,400 Q300,100 600,300 T1100,200" fill="none" stroke="#2d4a1e" strokeWidth="1.5" />
              <path d="M0,500 Q400,200 700,400 T1200,300" fill="none" stroke="#2d4a1e" strokeWidth="1" />
              <path d="M200,600 Q500,300 800,500 T1200,400" fill="none" stroke="#2d4a1e" strokeWidth="1" />
              <path d="M50,700 Q350,400 650,600 T1200,500" fill="none" stroke="#2d4a1e" strokeWidth="0.8" />
              <path d="M600,0 Q800,300 600,600 T600,900" fill="none" stroke="#2d4a1e" strokeWidth="1.2" />
              <path d="M400,0 Q600,200 400,500 T450,900" fill="none" stroke="#2d4a1e" strokeWidth="0.7" />
            </svg>
          </div>

          <div className="evolve-hero-left">
            <div className="evolve-hero-label">⊘ Energy Development</div>
            <h1 className="evolve-hero-title">Powering a<br /><span className="accent">Greener</span><br />Tomorrow</h1>
            <p className="evolve-hero-sub">Discover clean, affordable, and renewable power for your home and business. Reduce your carbon footprint today.</p>
            <div className="evolve-hero-actions">
              <Link href="#cta" className="evolve-btn-primary">
                DISCUSS PROJECT
                <span className="arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </Link>
              <Link href="#about" className="evolve-btn-outline">
                Learn More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </div>

          <div className="evolve-hero-right">
            <div className="evolve-hero-card evolve-card-main">
              <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80" alt="Wind turbines in green field" onError={(e) => { e.currentTarget.className = 'img-wind'; e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; }} />
            </div>
            <div className="evolve-stat-bubble">
              <div className="num">32%</div>
              <div className="label">Higher efficiency compared to<br />conventional wind turbines</div>
              <div className="icon">
                <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" /></svg>
              </div>
            </div>
            <div className="evolve-hero-card evolve-card-secondary">
              <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80" alt="Solar panels" onError={(e) => { e.currentTarget.className = 'img-solar'; e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; }} />
            </div>
          </div>

          <div className="evolve-green-card evolve-reveal">
            <h3>Bring Your<br />Ideas to Life</h3>
            <p>Delivering reliable and innovative energy solutions that power industries and communities</p>
          </div>
        </section>
      </div>

      <main>
        {/* ── INTRO WAVE TEXT ── */}
        <div id="wave-intro-wrap" style={{ backgroundColor: '#f0f0ec', width: '100%', padding: '80px 0 40px' }}>

          {/* vertical accent line */}
          <div style={{
            width: '1px', height: '56px',
            background: 'linear-gradient(to bottom, transparent, #7A9A3A)',
            margin: '0 auto 32px',
          }} />

          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#7A9A3A', marginBottom: '28px',
            }}>
              Project Evolve &nbsp;·&nbsp; Our Mission
            </p>

            <h2
              id="wave-intro"
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 4.2rem)',
                fontWeight: 800,
                color: '#1b1c1c',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                maxWidth: '960px',
                margin: '0 auto',
                opacity: 0,
              }}
            >
              WE ARE DECODING THE FUTURE OF SUSTAINABLE HARDWARE LIFECYCLES.
            </h2>

            <p style={{
              marginTop: '32px', fontSize: '17px', color: '#666',
              lineHeight: 1.65, maxWidth: '640px', margin: '32px auto 0',
            }}>
              Transforming how enterprises retire, recover and re-purpose electronic assets —
              zero landfill, full compliance, certified impact.
            </p>
          </section>

          <div style={{
            width: '1px', height: '56px',
            background: 'linear-gradient(to bottom, #7A9A3A, transparent)',
            margin: '40px auto 0',
          }} />
        </div>


        {/* ── STATS ── */}
        <div style={{ backgroundColor: '#f7f5f0', width: '100%' }}>
          <section id="about" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ maxWidth: '720px', margin: '0 auto 56px', fontSize: '17px', color: '#555', lineHeight: 1.65 }}>
              We are a network of sustainability experts and logistics professionals dedicated to transforming corporate hardware disposal with certified, compliant, and transparent e-waste solutions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '64px' }}>
              {([
                { value: 2400, suffix: 'k+', label: 'Tons CO2 Offset', delay: 0.2 },
                { value: 500, suffix: '+', label: 'Certified Facilities', delay: 0.3 },
                { value: 100, suffix: '%', label: 'Data Security', delay: 0.4 },
                { value: 99, suffix: '%', label: 'Landfill Diversion', delay: 0.5 },
              ] as const).map(s => (
                <AnimatedStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={s.delay} />
              ))}
            </div>
          </section>
        </div>

        {/* ── SERVICES ── */}
        <div className="evolve-vars" style={{ width: '100%' }}>
          <style>{`
            .img-wind { background: linear-gradient(135deg, #c8e6c0 0%, #4caf50 100%); }
            .img-solar { background: linear-gradient(135deg, #fff9c4 0%, #f9a825 100%); }
            .img-green { background: linear-gradient(135deg, #a5d6a7 0%, #2e7d32 100%); }
            
            .evolve-services {
              padding: 100px 60px;
              background: var(--bg);
              font-family: 'DM Sans', sans-serif;
            }
            .evolve-section-header {
              display: flex; justify-content: space-between; align-items: flex-end;
              margin-bottom: 48px;
              max-width: 1400px; margin-left: auto; margin-right: auto;
            }
            .evolve-section-tag {
              display: inline-block; background: var(--green-pale);
              color: var(--green-deep); font-size: 0.78rem; font-weight: 600;
              letter-spacing: 0.1em; text-transform: uppercase;
              padding: 6px 16px; border-radius: 100px; margin-bottom: 24px;
            }
            .evolve-section-title {
              font-family: 'Syne', sans-serif; font-weight: 700;
              font-size: 2.4rem; color: var(--dark); letter-spacing: -0.02em;
              margin: 0;
            }
            .evolve-section-desc {
              font-size: 0.9rem; color: var(--text-muted); max-width: 260px;
              line-height: 1.6; font-weight: 300; margin: 0;
            }
            
            .evolve-services-row {
              display: grid; grid-template-columns: repeat(3, 1fr);
              gap: 20px; max-width: 1400px; margin: 0 auto;
            }
            .evolve-service-card {
              background: white; border-radius: var(--radius); overflow: hidden;
              cursor: pointer; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
              border: 1.5px solid transparent;
            }
            .evolve-service-card:hover {
              transform: translateY(-6px);
              box-shadow: var(--shadow);
              border-color: var(--green-accent);
            }
            .evolve-service-card.active {
              background: var(--green-deep); border-color: var(--green-deep);
            }
            .evolve-service-card.active h4,
            .evolve-service-card.active p { color: white; }
            .evolve-service-card.active p { color: rgba(255,255,255,0.65); }

            .evolve-service-img {
              width: 100%; height: 180px; object-fit: cover; display: block;
            }
            .evolve-service-body { padding: 24px; }
            .evolve-service-icon {
              width: 40px; height: 40px; background: var(--green-pale);
              border-radius: 10px; display: grid; place-items: center;
              margin-bottom: 14px;
            }
            .evolve-service-card.active .evolve-service-icon { background: rgba(255,255,255,0.15); }
            .evolve-service-icon svg { width: 18px; height: 18px; fill: var(--green-mid); }
            .evolve-service-card.active .evolve-service-icon svg { fill: white; }
            .evolve-service-body h4 {
              font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
              margin-bottom: 8px; margin-top: 0; color: var(--dark);
            }
            .evolve-service-body p { font-size: 0.82rem; color: var(--text-muted); line-height: 1.55; margin: 0; }
            
            .evolve-stagger > * { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1); }
            .evolve-stagger.visible > *:nth-child(1) { opacity: 1; transform: none; transition-delay: 0.05s; }
            .evolve-stagger.visible > *:nth-child(2) { opacity: 1; transform: none; transition-delay: 0.15s; }
            .evolve-stagger.visible > *:nth-child(3) { opacity: 1; transform: none; transition-delay: 0.25s; }
            .evolve-stagger.visible > *:nth-child(4) { opacity: 1; transform: none; transition-delay: 0.35s; }
          `}</style>
          <section id="services" className="evolve-services">
            <div className="evolve-section-header evolve-reveal">
              <div>
                <div className="evolve-section-tag">What We Offer</div>
                <h2 className="evolve-section-title">Our Services</h2>
              </div>
              <p className="evolve-section-desc">We provide end-to-end green energy solutions to help you reduce your carbon footprint and lower your electricity bills.</p>
            </div>

            <div className="evolve-services-row evolve-stagger evolve-reveal">
              <div className="evolve-service-card" onClick={(e) => { document.querySelectorAll('.evolve-service-card').forEach(c => c.classList.remove('active')); e.currentTarget.classList.add('active'); }}>
                <img className="evolve-service-img" src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80" alt="Energy Audit" onError={(e) => { e.currentTarget.className = 'evolve-service-img img-solar'; e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; }} />
                <div className="evolve-service-body">
                  <div className="evolve-service-icon">
                    <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  </div>
                  <h4>Energy Audit & Consulting</h4>
                  <p>Comprehensive analysis of your energy consumption to identify savings opportunities and optimize efficiency.</p>
                </div>
              </div>

              <div className="evolve-service-card active" onClick={(e) => { document.querySelectorAll('.evolve-service-card').forEach(c => c.classList.remove('active')); e.currentTarget.classList.add('active'); }}>
                <img className="evolve-service-img" src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&q=80" alt="Smart Energy" onError={(e) => { e.currentTarget.className = 'evolve-service-img img-green'; e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; }} />
                <div className="evolve-service-body">
                  <div className="evolve-service-icon">
                    <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  </div>
                  <h4>Smart Energy Products</h4>
                  <p>Cutting-edge smart devices and systems that intelligently manage your energy usage in real time.</p>
                </div>
              </div>

              <div className="evolve-service-card" onClick={(e) => { document.querySelectorAll('.evolve-service-card').forEach(c => c.classList.remove('active')); e.currentTarget.classList.add('active'); }}>
                <img className="evolve-service-img" src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80" alt="Solar Installation" onError={(e) => { e.currentTarget.className = 'evolve-service-img img-solar'; e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; }} />
                <div className="evolve-service-body">
                  <div className="evolve-service-icon">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                  </div>
                  <h4>Solar Panel Installation</h4>
                  <p>Professional solar panel installation for residential and commercial properties with full warranties.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── WHY US ── */}
        <div style={{ backgroundColor: '#FAF7F0', width: '100%' }}>
          <section id="why" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <ScrollAnimation as="h2" direction="up" style={{ fontSize: '30px', fontWeight: 700, color: '#1b1c1c', textAlign: 'center', marginBottom: '56px' }}>
              Why Choose Us?
            </ScrollAnimation>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>

              {/* Left points */}
              <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '320px' }}>
                {[
                  { n: '01', t: 'Verified Sustainability', d: 'Every pickup tracked on The Living Ledger — immutable proof of your environmental impact.' },
                  { n: '02', t: 'Certified Partners', d: 'Global network of R2 and e-Stewards certified processing facilities.' },
                ].map(p => (
                  <div key={p.n} className="why-point" style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 300, color: '#ccc', flexShrink: 0 }}>{p.n}</span>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1b1c1c', marginBottom: '6px' }}>{p.t}</h4>
                      <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.5 }}>{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Center image */}
              <div id="why-center-img" style={{ flex: '0 0 auto', width: '260px', height: '360px', borderRadius: '100px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
                <img className="parallax-img" src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=600&auto=format&fit=crop" style={{ width: '100%', height: '115%', objectFit: 'cover' }} alt="Recycling professional" />
              </div>

              {/* Right points */}
              <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '320px' }}>
                {[
                  { n: '03', t: 'Secure Chain of Custody', d: 'End-to-end tracking from loading dock to final destruction — data never compromised.' },
                  { n: '04', t: 'Real-time Impact', d: 'ESG metrics update instantly on your dashboard as materials are processed.' },
                ].map(p => (
                  <div key={p.n} className="why-point" style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ fontSize: '30px', fontWeight: 300, color: '#ccc', flexShrink: 0 }}>{p.n}</span>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1b1c1c', marginBottom: '6px' }}>{p.t}</h4>
                      <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.5 }}>{p.d}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>

        {/* ── FAQ ── */}
        <div style={{ backgroundColor: '#F3EDE3', width: '100%' }}>
          <section id="faq" style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center' }}>
            <div style={{ flex: '1 1 360px', height: '460px', borderRadius: '20px', overflow: 'hidden' }}>
              <img className="parallax-img" src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop" style={{ width: '100%', height: '115%', objectFit: 'cover' }} alt="Sustainability" />
            </div>
            <div style={{ flex: '1 1 360px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1b1c1c', marginBottom: '36px' }}>Frequently Asked Questions</h2>
              <FaqAccordion />
            </div>
          </section>
        </div>

        {/* ── CTA ── */}
        <div className="evolve-vars" style={{ width: '100%' }}>
          <style>{`
            .evolve-cta {
              padding: 80px 60px;
              background: white;
              font-family: 'DM Sans', sans-serif;
            }
            .evolve-cta-box {
              background: var(--green-pale); border-radius: 28px;
              display: grid; grid-template-columns: 1fr 1fr;
              align-items: center; overflow: hidden;
              min-height: 280px; position: relative;
              max-width: 1400px; margin: 0 auto;
            }
            .evolve-cta-content { padding: 60px; }
            .evolve-cta-content h2 {
              font-family: 'Syne', sans-serif; font-weight: 800;
              font-size: 2rem; color: var(--green-deep);
              line-height: 1.15; margin-bottom: 24px;
              margin-top: 0;
            }
            .evolve-cta-content h2 em { color: var(--green-accent); font-style: normal; }
            .evolve-btn-green {
              display: inline-flex; align-items: center; gap: 10px;
              background: var(--green-mid); color: white;
              padding: 14px 30px; border-radius: 100px;
              font-family: 'Syne', sans-serif; font-weight: 600;
              font-size: 0.85rem; letter-spacing: 0.05em;
              text-decoration: none; transition: all 0.3s;
              border: none; cursor: pointer;
            }
            .evolve-btn-green:hover { background: var(--green-deep); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(74,124,47,0.3); }
            .evolve-cta-img { height: 100%; overflow: hidden; min-height: 280px; }
            .evolve-cta-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
          `}</style>
          <section id="cta" className="evolve-cta">
            <div className="evolve-cta-box evolve-reveal">
              <div className="evolve-cta-content">
                <h2>Ready to make the switch?<br />Let's talk about how you can power your future with <em>green energy.</em></h2>
                <Link href="/login" className="evolve-btn-green">
                  Get Started
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
              <div className="evolve-cta-img" style={{ height: '300px', alignSelf: 'center', margin: '20px', borderRadius: '20px', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&q=80" alt="Green plants" onError={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg,#a5d6a7,#1b5e20)' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <div className="evolve-vars">
        <style>{`
          .evolve-footer {
            background: var(--dark); color: white;
            padding: 64px 60px 40px;
            position: relative; overflow: hidden;
            font-family: 'DM Sans', sans-serif;
          }
          .evolve-footer-top {
            display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
            gap: 48px; padding-bottom: 48px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            margin-bottom: 32px;
            position: relative;
            z-index: 10;
          }
          .evolve-footer-brand .evolve-logo { color: white; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.25rem; text-decoration: none; }
          .evolve-footer-brand .evolve-logo-icon { width: 34px; height: 34px; background: var(--green-mid); border-radius: 8px; display: grid; place-items: center; }
          .evolve-footer-brand .evolve-logo-icon svg { width: 18px; height: 18px; fill: white; }
          .evolve-footer-brand p { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.65; max-width: 200px; margin: 0; }
          .evolve-footer-social { display: flex; gap: 10px; margin-top: 20px; }
          .evolve-footer-social a {
            width: 36px; height: 36px; background: rgba(255,255,255,0.07);
            border-radius: 50%; display: grid; place-items: center;
            transition: background 0.25s; text-decoration: none;
          }
          .evolve-footer-social a:hover { background: var(--green-mid); }
          .evolve-footer-social a svg { width: 14px; height: 14px; fill: white; }

          .evolve-footer-col h5 {
            font-family: 'Syne', sans-serif; font-weight: 700;
            font-size: 0.75rem; letter-spacing: 0.1em;
            text-transform: uppercase; color: rgba(255,255,255,0.35);
            margin-bottom: 16px; margin-top: 0;
          }
          .evolve-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; margin: 0; }
          .evolve-footer-col ul a {
            font-size: 0.85rem; color: rgba(255,255,255,0.6);
            text-decoration: none; transition: color 0.2s;
          }
          .evolve-footer-col ul a:hover { color: white; }

          .evolve-footer-bottom {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.78rem; color: rgba(255,255,255,0.3);
            position: relative;
            z-index: 10;
          }
        `}</style>
        <footer className="evolve-footer">
          <div className="evolve-footer-top">
            <div className="evolve-footer-brand">
              <Link href="#hero" className="evolve-logo">
                <div className="evolve-logo-icon">
                  <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" /></svg>
                </div>
                Evolve
              </Link>
              <p>Discover clean, affordable, and renewable power for your home and business.</p>
              <div className="evolve-footer-social">
                <Link href="#">
                  <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </Link>
                <Link href="#">
                  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path fill="white" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>
                </Link>
                <Link href="#">
                  <svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
                </Link>
              </div>
            </div>

            <div className="evolve-footer-col">
              <h5>Navigation</h5>
              <ul>
                <li><Link href="#hero">Home</Link></li>
                <li><Link href="#about">About Us</Link></li>
                <li><Link href="#services">Our Service</Link></li>
                <li><Link href="#faq">FAQ</Link></li>
              </ul>
            </div>

            <div className="evolve-footer-col">
              <h5>Services</h5>
              <ul>
                <li><Link href="#">Energy Audit</Link></li>
                <li><Link href="#">Smart Products</Link></li>
                <li><Link href="#">Solar Panel</Link></li>
                <li><Link href="#">EV Charging</Link></li>
              </ul>
            </div>

            <div className="evolve-footer-col">
              <h5>Other</h5>
              <ul>
                <li><Link href="#">Career</Link></li>
                <li><Link href="#">Contact Us</Link></li>
                <li><Link href="#">Help</Link></li>
                <li><Link href="#">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="evolve-footer-bottom">
            <span>© 2025 Evolve. All rights reserved.</span>
            <span>Powering a greener tomorrow.</span>
          </div>

          {/* Big background wordmark with parallax */}
          <div id="footer-evolve" style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontSize: '22vw', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 0.7, textAlign: 'center', letterSpacing: '-0.02em', pointerEvents: 'none', userSelect: 'none' }}>
            EVOLVE
          </div>
        </footer>
      </div>

    </div>
  )
}

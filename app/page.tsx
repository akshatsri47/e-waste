import Link from 'next/link'
import LandingAnimations, { AnimatedStat, FaqAccordion, HeroStatPulse } from '@/components/LandingAnimations'
import ScrollAnimation from '@/components/ScrollAnimation'
import GsapAnimations from '@/components/GsapAnimations'
import Preloader from '@/components/Preloader'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0ec', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%' }}>
      <Preloader />
      <LandingAnimations />
      <GsapAnimations />

      {/* ── NAV ── */}
      <nav id="landing-nav" style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        backgroundColor: 'rgba(240,240,236,0.88)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          height: '68px', padding: '0 40px', maxWidth: '1400px', margin: '0 auto'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 14C4 8.477 8.477 4 14 4s10 4.477 10 10-4.477 10-10 10S4 19.523 4 14z" fill="#3a5c3a"/>
              <path d="M10 14l3 3 5-6" stroke="#b3f1c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#1b1c1c', letterSpacing: '-0.01em' }}>GLOBAL</span>
          </div>

          {/* Center links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {['Services ▾', 'Projects', 'Contacts', 'About Us ▾'].map(l => (
              <span key={l} style={{ fontSize: '14px', color: '#444', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>

          {/* CTA */}
          <Link href="/login" className="btn-magnetic" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            border: '1.5px solid #3a5c3a', borderRadius: '9999px',
            padding: '9px 20px', fontSize: '13px', fontWeight: 600,
            color: '#1b1c1c', textDecoration: 'none', backgroundColor: 'transparent'
          }}>
            GET STARTED
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: '#3a5c3a', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px'
            }}>↗</span>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main style={{ paddingTop: '68px' }}>
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '56px 40px 64px',
          position: 'relative'
        }}>

          {/* TOP-LEFT: Headline + CTA */}
          <div style={{ paddingTop: '16px', paddingRight: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {/* Badge */}
            <div id="hero-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: '#3a5c3a', fontWeight: 500 }}>⚡ Energy Development</span>
            </div>

            {/* Headline — each line wrapped for SplitText overflow clip */}
            <div style={{ overflow: 'hidden', marginBottom: '48px' }}>
              <h1 id="hero-headline" style={{
                fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
                fontWeight: 700, color: '#111', lineHeight: 1.0,
                letterSpacing: '-0.03em', margin: 0, textTransform: 'uppercase'
              }}>
                RESPONSIBLE<br />E-WASTE<br />DISPOSAL
              </h1>
            </div>

            {/* Pill CTA */}
            <Link id="hero-cta-btn" href="/login" className="btn-magnetic btn-arrow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              border: '1.5px solid rgba(0,0,0,0.18)', borderRadius: '9999px',
              padding: '10px 10px 10px 28px', fontSize: '12px', fontWeight: 700,
              color: '#1b1c1c', textDecoration: 'none', backgroundColor: 'transparent',
              letterSpacing: '0.06em', alignSelf: 'flex-start'
            }}>
              GET STARTED
              <span style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#b3f1c2', color: '#16512e',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>→</span>
            </Link>
          </div>

          {/* TOP-RIGHT: Overlapping images + stat card */}
          <div style={{ position: 'relative', height: '420px', marginLeft: '16px' }}>
            {/* Floating Stat Card */}
            <div id="hero-stat-card" style={{
              position: 'absolute', top: '12px', left: '0px', zIndex: 20,
              backgroundColor: '#fff', borderRadius: '20px', padding: '24px 28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.09)', width: '210px'
            }}>
              <HeroStatPulse />
              <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', lineHeight: 1.5 }}>
                Data destruction guarantee for all enterprise hardware
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #b3f1c2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a5c3a', fontSize: '16px' }}>↻</div>
              </div>
            </div>

            {/* Back image */}
            <div id="hero-back-img" style={{
              position: 'absolute', top: '0', right: '0',
              width: '62%', height: '72%',
              borderRadius: '22px', overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.10)'
            }}>
              <img
                className="parallax-img"
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=900&auto=format&fit=crop"
                style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center' }}
                alt="Wind turbines"
              />
            </div>

            {/* Front image */}
            <div id="hero-front-img" style={{
              position: 'absolute', bottom: '0', right: '6%',
              width: '48%', height: '55%',
              borderRadius: '22px', overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(0,0,0,0.13)', zIndex: 10
            }}>
              <img
                className="parallax-img"
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=700&auto=format&fit=crop"
                style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center' }}
                alt="E-waste recycling"
              />
            </div>

            {/* Social pills */}
            <div style={{
              position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 30
            }}>
              {['tw', 'fb', 'ig'].map(s => (
                <div key={s} className="hero-social-pill" style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 700, color: '#555', cursor: 'pointer'
                }}>{s}</div>
              ))}
            </div>
          </div>

          {/* BOTTOM-LEFT: Green card */}
          <div id="hero-green-card" style={{
            marginTop: '32px', backgroundColor: '#3a5c3a', borderRadius: '22px',
            padding: '36px 32px', display: 'flex', alignItems: 'center', gap: '20px',
            position: 'relative', overflow: 'hidden', marginRight: '16px'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px', textTransform: 'uppercase', lineHeight: 1.3 }}>
                BRING YOUR<br />ESG GOALS TO LIFE
              </h3>
              <p style={{ fontSize: '13px', color: '#a8d5b5', lineHeight: 1.6, maxWidth: '260px' }}>
                Delivering reliable and innovative recycling solutions that power sustainable corporate operations.
              </p>
            </div>
            <div style={{
              position: 'absolute', right: '24px', bottom: '0',
              width: '120px', height: '140px',
              borderRadius: '60px 60px 0 0', overflow: 'hidden'
            }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                alt="Professional"
              />
            </div>
            <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', width: '160px', height: '160px', backgroundColor: '#5c8c5c', borderRadius: '50%', filter: 'blur(40px)', zIndex: 1 }} />
          </div>

          {/* BOTTOM-RIGHT: Description */}
          <div id="hero-desc" style={{ marginTop: '32px', paddingLeft: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.65, marginBottom: '24px', maxWidth: '380px' }}>
              Join us in building smarter asset lifecycles that reduce e-waste and ensure secure hardware disposal for generations to come.
            </p>
            <Link href="#services" style={{
              fontSize: '13px', fontWeight: 700, color: '#3a5c3a',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              borderBottom: '2px solid #b3f1c2', paddingBottom: '3px',
              textDecoration: 'none', alignSelf: 'flex-start'
            }}>
              LEARN MORE
            </Link>
          </div>

        </section>

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
          <section id="stats-section" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ maxWidth: '720px', margin: '0 auto 56px', fontSize: '17px', color: '#555', lineHeight: 1.65 }}>
              We are a network of sustainability experts and logistics professionals dedicated to transforming corporate hardware disposal with certified, compliant, and transparent e-waste solutions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '64px' }}>
              {([
                { value: 2400, suffix: 'k+', label: 'Tons CO2 Offset', delay: 0.2 },
                { value: 500,  suffix: '+',  label: 'Certified Facilities', delay: 0.3 },
                { value: 100,  suffix: '%',  label: 'Data Security', delay: 0.4 },
                { value: 99,   suffix: '%',  label: 'Landfill Diversion', delay: 0.5 },
              ] as const).map(s => (
                <AnimatedStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={s.delay} />
              ))}
            </div>
          </section>
        </div>

        {/* ── SERVICES ── */}
        <div id="services" style={{ backgroundColor: '#3E5F3E', width: '100%' }}>
          <section id="services-pin" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center' }}>
            <ScrollAnimation direction="right" style={{ flex: '1 1 280px', maxWidth: '360px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#FAF7F0', marginBottom: '14px' }}>Our Services</h2>
              <p style={{ color: '#C2A27C', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
                End-to-end e-waste management solutions — secure, certified, and measurable.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['←', '→'].map((a, i) => (
                  <button key={i} className="btn-magnetic" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: i === 1 ? '#fff' : '#888', cursor: 'pointer', fontSize: '18px' }}>{a}</button>
                ))}
              </div>
            </ScrollAnimation>

            <div id="services-scroll-row" style={{ flex: '2 1 560px', display: 'flex', gap: '20px', overflowX: 'hidden', paddingBottom: '8px' }}>
              {[
                { icon: '🚚', title: 'Global Bulk\nPickup',       bg: '#FAF7F0', titleColor: '#1b1c1c', img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=600&auto=format&fit=crop' },
                { icon: '📋', title: 'ESG Compliance\nReports',   bg: '#7A9A3A', titleColor: '#FAF7F0', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop' },
                { icon: '🔒', title: 'Secure Data\nDestruction',  bg: '#FAF7F0', titleColor: '#1b1c1c', img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=600&auto=format&fit=crop' },
              ].map(card => (
                <div key={card.title} className="service-card" style={{
                  minWidth: '260px', backgroundColor: card.bg, borderRadius: '20px',
                  padding: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  cursor: 'default', transformStyle: 'preserve-3d',
                }}>
                  <div style={{ fontSize: '22px' }}>{card.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: card.titleColor, whiteSpace: 'pre-line' }}>{card.title}</h3>
                  <div style={{ height: '140px', borderRadius: '14px', overflow: 'hidden', marginTop: 'auto' }}>
                    <img className="parallax-img" src={card.img} style={{ width: '100%', height: '115%', objectFit: 'cover' }} alt={card.title} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── WHY US ── */}
        <div style={{ backgroundColor: '#FAF7F0', width: '100%' }}>
          <section style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <ScrollAnimation as="h2" direction="up" style={{ fontSize: '30px', fontWeight: 700, color: '#1b1c1c', textAlign: 'center', marginBottom: '56px' }}>
              Why Choose Us?
            </ScrollAnimation>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>

              {/* Left points */}
              <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '320px' }}>
                {[
                  { n: '01', t: 'Verified Sustainability', d: 'Every pickup tracked on The Living Ledger — immutable proof of your environmental impact.' },
                  { n: '02', t: 'Certified Partners',      d: 'Global network of R2 and e-Stewards certified processing facilities.' },
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
                  { n: '04', t: 'Real-time Impact',        d: 'ESG metrics update instantly on your dashboard as materials are processed.' },
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
          <section id="faq-section" style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '56px', alignItems: 'center' }}>
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
        <div style={{ backgroundColor: '#7A9A3A', width: '100%' }}>
          <section style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div id="cta-card" style={{ borderRadius: '28px', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', overflow: 'hidden', backgroundColor: '#3E5F3E' }}>
              <div style={{ flex: '1 1 360px', padding: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '30px', fontWeight: 600, color: '#FAF7F0', marginBottom: '14px', lineHeight: 1.2 }}>
                  Ready to transform your<br />hardware lifecycle?
                </h2>
                <p style={{ fontSize: '16px', color: '#C2A27C', marginBottom: '36px', maxWidth: '360px', lineHeight: 1.55 }}>
                  Let's talk about how you can securely manage your e-waste and track your impact.
                </p>
                <Link href="/login" className="btn-magnetic" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  backgroundColor: '#7A9A3A', color: '#FAF7F0', borderRadius: '9999px',
                  padding: '14px 28px', fontSize: '15px', fontWeight: 700, border: 'none',
                  cursor: 'pointer', textDecoration: 'none', alignSelf: 'flex-start'
                }}>
                  Get Started <span style={{ fontSize: '18px' }}>↗</span>
                </Link>
              </div>
              <div style={{ flex: '1 1 360px', minHeight: '360px', position: 'relative', overflow: 'hidden' }}>
                <img className="parallax-img" src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop" style={{ width: '100%', height: '115%', objectFit: 'cover', borderTopLeftRadius: '90px', objectPosition: 'center' }} alt="Plant wall" />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#FAF7F0', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '48px', marginBottom: '80px' }}>
            <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
              {[
                { title: 'Company',  links: ['Home', 'About Us', 'Our Process', 'FAQ'] },
                { title: 'Services', links: ['Global Pickup', 'ESG Reports', 'Data Destruction', 'IT Compliance'] },
                { title: 'Legal',    links: ['Terms', 'Certifications', 'Help', 'Privacy Policy'] },
              ].map(col => (
                <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1b1c1c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{col.title}</h4>
                  {col.links.map(l => <a key={l} href="#" style={{ fontSize: '13px', color: '#777', textDecoration: 'none' }}>{l}</a>)}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3a5c3a' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>recycling</span>
                <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>Project Evolve</span>
              </div>
              <p style={{ fontSize: '13px', color: '#777', maxWidth: '240px', lineHeight: 1.5 }}>
                Secure, efficient, and certified e-waste solutions for your business.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['In', 'Tw'].map(s => (
                  <button key={s} className="btn-magnetic" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#e2fadb', color: '#316944', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Big background wordmark with parallax */}
        <div id="footer-evolve" style={{ fontSize: '22vw', fontWeight: 900, color: '#E8DDD0', lineHeight: 0.7, textAlign: 'center', letterSpacing: '-0.02em', pointerEvents: 'none', userSelect: 'none' }}>
          EVOLVE
        </div>
      </footer>

    </div>
  )
}

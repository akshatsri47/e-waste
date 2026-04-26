import Link from 'next/link'
import ScrollAnimation from '@/components/ScrollAnimation'
import LandingAnimations, { AnimatedStat, FaqAccordion, HeroStatPulse } from '@/components/LandingAnimations'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3EDE3', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%' }}>
      <LandingAnimations />

      {/* Top Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(190, 201, 190, 0.2)' }} className="nav-animate">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', padding: '0 48px', maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#006036', letterSpacing: '-0.05em' }}>Project Evolve</span>
            <div style={{ display: 'none', gap: '32px', '@media (min-width: 768px)': { display: 'flex' } } as any}>
              <span style={{ color: '#006036', fontWeight: 700, borderBottom: '2px solid #006036', paddingBottom: '4px', cursor: 'pointer' }}>Solutions</span>
              <span style={{ color: '#6f7a70', fontWeight: 500, cursor: 'pointer' }}>Platform</span>
              <span style={{ color: '#6f7a70', fontWeight: 500, cursor: 'pointer' }}>Resources</span>
              <span style={{ color: '#6f7a70', fontWeight: 500, cursor: 'pointer' }}>Pricing</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/login" style={{ color: '#006036', fontWeight: 600, padding: '8px 16px', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/login" style={{ background: 'linear-gradient(135deg, #006036, #1a7a4a)', color: '#ffffff', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,96,54,0.2)' }} className="btn-glow" data-cursor-expand="true">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>

        {/* Hero Section based on 'hero section (landing page)' screen */}
        <section style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>

            {/* Top Left: Headline & CTA */}
            <div id="hero-cta-area" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', zIndex: 10, paddingTop: '32px' }}>
              <div id="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#316944', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>recycling</span>
                <span>Enterprise Grade E-Waste</span>
              </div>

              <h1 id="hero-headline" style={{ fontSize: 'clamp(3.5rem, 5vw, 5.5rem)', fontWeight: 500, color: '#00210f', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '48px', textTransform: 'uppercase' }}>
                RESPONSIBLE<br />E-WASTE<br />DISPOSAL
              </h1>

              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(111, 122, 112, 0.4)', borderRadius: '9999px', padding: '8px 8px 8px 32px', fontSize: '14px', fontWeight: 600, color: '#1b1c1c', backgroundColor: 'transparent', textDecoration: 'none' }} className="btn-glow btn-arrow" data-cursor-expand="true">
                  REQUEST AUDIT
                  <span style={{ backgroundColor: '#b3f1c2', color: '#16512e', borderRadius: '50%', width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined arrow-icon" style={{ fontSize: '20px', transform: 'rotate(-45deg)' }}>arrow_forward</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Top Right: Images & Stats Card */}
            <div style={{ flex: '1 1 500px', position: 'relative', height: '600px', minWidth: '320px', zIndex: 10 }} className="animate-fade">
              {/* Back Image (Smaller, Left) */}
              <div id="hero-back-img" style={{ position: 'absolute', top: 0, left: '5%', width: '45%', height: '75%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 48px -12px rgba(27,28,28,0.1)' }}>
                <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Sustainable environmental impact" />
              </div>

              {/* Front Image (Larger, Right) */}
              <div id="hero-front-img" style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', height: '85%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 64px -16px rgba(27,28,28,0.15)' }}>
                <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="E-waste recycling" />
              </div>

              {/* Floating Stat Card */}
              <div id="hero-stat-card" style={{ position: 'absolute', top: '15%', left: '-5%', backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px -10px rgba(27,28,28,0.08)', width: '260px', zIndex: 20 }}>
                <HeroStatPulse />
                <p style={{ fontSize: '14px', color: '#6f7a70', marginTop: '16px', lineHeight: 1.5 }}>
                  Data destruction guarantee for all enterprise hardware
                </p>
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ border: '1px solid #b3f1c2', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#316944' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sync</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginTop: '64px' }} className="animate-fade">

            {/* Bottom Left: Green Card */}
            <div className="card-3d" style={{ flex: '1 1 400px', backgroundColor: '#9bf6ba', borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{ fontSize: '24px', fontWeight: 500, color: '#00210f', marginBottom: '16px', textTransform: 'uppercase' }}>
                  BRING YOUR<br />ESG GOALS TO LIFE
                </h3>
                <p style={{ fontSize: '14px', color: '#00522e', lineHeight: 1.6, maxWidth: '85%' }}>
                  Delivering reliable and innovative recycling solutions that power sustainable corporate operations.
                </p>
              </div>

              {/* Decorative element simulating the 'breaking out' image */}
              <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '200px', height: '200px', backgroundColor: '#80d9a0', borderRadius: '50%', filter: 'blur(30px)', zIndex: 1 }}></div>
            </div>

            {/* Bottom Right: Description Text */}
            <div style={{ flex: '1 1 500px', paddingLeft: '16px' }}>
              <p style={{ fontSize: '18px', color: '#3f4941', lineHeight: 1.6, marginBottom: '24px', maxWidth: '440px' }}>
                Join us in building smarter asset lifecycles that reduce e-waste and ensure secure hardware disposal for generations to come.
              </p>
              <Link href="#platform" style={{ fontSize: '14px', fontWeight: 600, color: '#316944', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #b3f1c2', paddingBottom: '4px', textDecoration: 'none' }}>
                LEARN MORE
              </Link>
            </div>

          </div>
        </section>

        {/* Intro & Stats Section */}
        <div style={{ backgroundColor: '#F3EDE3', width: '100%' }}>
        <section style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto', textAlign: 'center' }}>
          <ScrollAnimation as="p" direction="up" style={{ maxWidth: '800px', margin: '0 auto 64px auto', fontSize: '18px', color: '#3f4941', lineHeight: 1.6, fontWeight: 500 }}>
            We are a network of sustainability experts, logistics professionals, and innovators dedicated to transforming corporate hardware disposal. With a commitment to transparency and compliance, we provide secure, efficient, and certified e-waste solutions to enterprises and communities. Our mission is to maximize resource recovery and accelerate the shift towards a circular economy.
          </ScrollAnimation>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '64px', alignItems: 'center' }}>
            <ScrollAnimation delay={0} direction="up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatedStat value={2400} suffix="k+" label="Tons CO2 Offset" delay={0.2} />
            </ScrollAnimation>
            <ScrollAnimation delay={0.1} direction="up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatedStat value={500} suffix="+" label="Certified Facilities" delay={0.3} />
            </ScrollAnimation>
            <ScrollAnimation delay={0.2} direction="up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatedStat value={100} suffix="%" label="Data Security" delay={0.4} />
            </ScrollAnimation>
            <ScrollAnimation delay={0.3} direction="up" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatedStat value={99} suffix="%" label="Landfill Diversion" delay={0.5} />
            </ScrollAnimation>
          </div>
        </section>
        </div>

        {/* Our Services Section */}
        <div style={{ backgroundColor: '#3E5F3E', width: '100%' }}>
        <section style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}>

          {/* Left Text Box */}
          <ScrollAnimation direction="right" style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#FAF7F0', marginBottom: '16px' }}>Our Services</h2>
            <p style={{ color: '#C2A27C', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
              Discover end-to-end e-waste management solutions designed to secure your data, optimize your hardware lifecycle, and ensure measurable environmental impact.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #d1dbd2', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8a29e', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #d1dbd2', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b1c1c', cursor: 'pointer' }} className="btn-glow">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </ScrollAnimation>

          {/* Right Cards */}
          <div style={{ flex: '2 1 600px', display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', paddingRight: '16px' }}>

            {/* Card 1 */}
            <ScrollAnimation delay={0.1} direction="left" className="card-3d blur-reveal-init is-visible" style={{ minWidth: '280px', backgroundColor: '#FAF7F0', borderRadius: '24px', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00210f', color: '#9bf6ba', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>local_shipping</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c' }}>Global Bulk<br />Pickup</h3>
              <div className="img-zoom-wrap" style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', marginTop: 'auto' }}>
                <img src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=600&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bulk pickup logistics" />
              </div>
            </ScrollAnimation>

            {/* Card 2 */}
            <ScrollAnimation delay={0.2} direction="left" className="card-3d blur-reveal-init is-visible" style={{ minWidth: '280px', backgroundColor: '#7A9A3A', borderRadius: '24px', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00210f', color: '#9bf6ba', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>description</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FAF7F0' }}>ESG Compliance<br />Reports</h3>
              <div className="img-zoom-wrap" style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', marginTop: 'auto' }}>
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="ESG Reporting" />
              </div>
            </ScrollAnimation>

            {/* Card 3 */}
            <ScrollAnimation delay={0.3} direction="left" className="card-3d blur-reveal-init is-visible" style={{ minWidth: '280px', backgroundColor: '#FAF7F0', borderRadius: '24px', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#00210f', color: '#9bf6ba', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>security</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1b1c1c' }}>Secure Data<br />Destruction</h3>
              <div className="img-zoom-wrap" style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', marginTop: 'auto' }}>
                <img src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=600&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Data destruction" />
              </div>
            </ScrollAnimation>

          </div>
        </section>
        </div>

        {/* Why Choose Us Section */}
        <div style={{ backgroundColor: '#FAF7F0', width: '100%' }}>
        <section style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto' }}>
          <ScrollAnimation as="h2" direction="up" style={{ fontSize: '32px', fontWeight: 600, color: '#1b1c1c', textAlign: 'center', marginBottom: '64px' }}>Why Choose Us?</ScrollAnimation>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>

            {/* Left Side Points */}
            <ScrollAnimation direction="right" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '64px', maxWidth: '350px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 300, color: '#a8a29e' }}>01</span>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>Verified Sustainability</h4>
                  <p style={{ color: '#6f7a70', fontSize: '14px', lineHeight: 1.5 }}>Every pickup is tracked on The Living Ledger, providing immutable proof of your environmental impact and carbon offset.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 300, color: '#a8a29e' }}>02</span>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>Certified Partners</h4>
                  <p style={{ color: '#6f7a70', fontSize: '14px', lineHeight: 1.5 }}>Our global network consists exclusively of R2 and e-Stewards certified processing facilities.</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Center Image */}
            <ScrollAnimation direction="none" startScale={0.8} duration={1} style={{ flex: '0 0 auto', width: '300px', height: '400px', borderRadius: '120px', overflow: 'hidden', position: 'relative', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
              <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=600&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Recycling professional" />
            </ScrollAnimation>

            {/* Right Side Points */}
            <ScrollAnimation direction="left" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '64px', maxWidth: '350px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 300, color: '#a8a29e' }}>03</span>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>Secure Chain of Custody</h4>
                  <p style={{ color: '#6f7a70', fontSize: '14px', lineHeight: 1.5 }}>End-to-end tracking from your loading dock to final destruction, ensuring your data is never compromised.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ fontSize: '36px', fontWeight: 300, color: '#a8a29e' }}>04</span>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1b1c1c', marginBottom: '8px' }}>Real-time Impact</h4>
                  <p style={{ color: '#6f7a70', fontSize: '14px', lineHeight: 1.5 }}>Watch your ESG metrics update instantly on your dashboard as materials are processed and recovered.</p>
                </div>
              </div>
            </ScrollAnimation>

          </div>
        </section>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: '#F3EDE3', width: '100%' }}>
        <section style={{ paddingTop: '96px', paddingBottom: '96px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}>

          <ScrollAnimation direction="right" style={{ flex: '1 1 400px', height: '500px', borderRadius: '24px', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Sustainability growth" />
          </ScrollAnimation>

          <ScrollAnimation delay={0.2} direction="up" style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#1b1c1c', marginBottom: '40px' }}>Frequently Asked Questions</h2>
            <FaqAccordion />
          </ScrollAnimation>
        </section>
        </div>

        {/* CTA Banner */}
        <div style={{ backgroundColor: '#7A9A3A', width: '100%' }}>
        <section style={{ padding: '48px', maxWidth: '1440px', margin: '0 auto' }}>
          <ScrollAnimation direction="none" startScale={0.95} duration={1} style={{ borderRadius: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', overflow: 'hidden', backgroundColor: '#3E5F3E' }}>

            <div style={{ flex: '1 1 400px', padding: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 500, color: '#FAF7F0', marginBottom: '16px', lineHeight: 1.2 }}>Ready to transform your<br />hardware lifecycle?</h2>
              <p style={{ fontSize: '18px', color: '#C2A27C', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.5 }}>Let's talk about how you can securely manage your e-waste and track your impact.</p>
              <div>
                <button style={{ backgroundColor: '#7A9A3A', color: '#FAF7F0', borderRadius: '9999px', padding: '16px 32px', fontSize: '16px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }} className="btn-glow btn-arrow" data-cursor-expand="true">
                  Contact Us <span className="material-symbols-outlined arrow-icon" style={{ fontSize: '20px' }}>arrow_outward</span>
                </button>
              </div>
            </div>

            <div style={{ flex: '1 1 400px', minHeight: '400px', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '100px' }} alt="Plant wall" />
            </div>

          </ScrollAnimation>
        </section>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#FAF7F0', paddingTop: '96px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 10 }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '64px', marginBottom: '96px' }}>

            <div style={{ display: 'flex', gap: '96px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1b1c1c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Company</h4>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Home</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">About Us</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Our Process</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">FAQ</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1b1c1c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Services</h4>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Global Pickup</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">ESG Reports</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Data Destruction</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">IT Compliance</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1b1c1c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Legal</h4>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Terms</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Certifications</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Help</a>
                <a href="#" style={{ fontSize: '14px', color: '#6f7a70', textDecoration: 'none' }} data-cursor-expand="true">Privacy Policy</a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#316944' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>recycling</span>
                <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Project Evolve</span>
              </div>
              <p style={{ fontSize: '14px', color: '#6f7a70', maxWidth: '280px', lineHeight: 1.5 }}>
                Secure, efficient, and certified e-waste solutions for your business.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2fadb', color: '#316944', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }} className="btn-glow" data-cursor-expand="true">
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>In</span>
                </button>
                <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2fadb', color: '#316944', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }} className="btn-glow" data-cursor-expand="true">
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Tw</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Huge Background Text */}
        <div style={{ fontSize: '22vw', fontWeight: 900, color: '#E8DDD0', lineHeight: 0.7, textAlign: 'center', letterSpacing: '-0.02em', pointerEvents: 'none', userSelect: 'none' }}>
          EVOLVE
        </div>
      </footer>

    </div>
  )
}

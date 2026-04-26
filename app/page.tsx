import { createClient } from '@/utils/supbase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = !!user

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fbf9f8', color: '#1b1c1c', fontFamily: '"Inter", sans-serif', width: '100%' }}>
      
      {/* Top Navigation */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(190, 201, 190, 0.2)' }} className="animate-fade">
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
            {isLoggedIn ? (
              <Link href="/dashboard" style={{ background: 'linear-gradient(135deg, #006036, #1a7a4a)', color: '#ffffff', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,96,54,0.2)' }} className="hover-lift">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ color: '#006036', fontWeight: 600, padding: '8px 16px', textDecoration: 'none' }}>Sign In</Link>
                <Link href="/login" style={{ background: 'linear-gradient(135deg, #006036, #1a7a4a)', color: '#ffffff', padding: '10px 24px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,96,54,0.2)' }} className="hover-lift">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ paddingTop: '80px', flexGrow: 1 }}>
        
        {/* Hero Section */}
        <section style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 500px', zIndex: 10 }} className="animate-slide">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', backgroundColor: '#f5f3f3', color: '#006036', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(190, 201, 190, 0.4)', marginBottom: '32px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
              <span>Enterprise Grade E-Waste Management</span>
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, color: '#1b1c1c', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '32px' }}>
              Responsible <br/>E-Waste Disposal <span style={{ color: '#006036' }}>at Scale</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#3f4941', lineHeight: 1.6, maxWidth: '600px', marginBottom: '40px' }}>
              Transform your corporate hardware lifecycle with verified, compliant, and sustainable recycling. Track your impact through The Living Ledger.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link href={isLoggedIn ? "/dashboard/new" : "/login"} style={{ background: 'linear-gradient(135deg, #006036, #1a7a4a)', color: '#ffffff', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,96,54,0.25)' }} className="hover-lift">
                Request Audit <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </Link>
              <Link href="#platform" style={{ backgroundColor: '#b3f1c2', color: '#16512e', padding: '16px 32px', borderRadius: '12px', fontWeight: 600, fontSize: '18px', textDecoration: 'none' }} className="hover-lift">
                View Platform
              </Link>
            </div>
          </div>
          
          <div style={{ flex: '1 1 500px', position: 'relative', height: '600px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 32px 64px -16px rgba(27,28,28,0.15)' }} className="animate-fade">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKcQbX_BwI7wsISIv88ikTxEmUyCaGAzoOIeI7slxZByLbkAE2kLK7qSqHYblrlzDglS4USI4vfmWOiEgB2dVuG-5EtfIbdd1wN1Yosz-FXnjsGN3PF7_RQu1hyvsA45MiizkznLWCvmcbAvHWgBvPk1W-j6o0hb2bYhq6YfqbCM3Q9bOrT_XVLbcIcLr9hK0ys-rk-nLgO3Z-yYerCPfIwFgweBjjI6HMEurY2p8zUYMPoIs70uuWD39MF7A3kBvYzmpGmKNJ4do" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Server room representing sustainable technology infrastructure" />
            
            <div style={{ position: 'absolute', bottom: '48px', left: '48px', backgroundColor: 'rgba(245, 243, 243, 0.85)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(190, 201, 190, 0.4)', maxWidth: '280px' }} className="hover-lift">
              <p style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#3f4941', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Carbon Offset</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '36px', fontFamily: '"Roboto Mono", monospace', fontWeight: 800, color: '#006036' }}>2.4M</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#3f4941' }}>tons</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section style={{ backgroundColor: '#f5f3f3', padding: '64px 0', borderTop: '1px solid rgba(190, 201, 190, 0.2)', borderBottom: '1px solid rgba(190, 201, 190, 0.2)' }} className="animate-fade">
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '32px' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontFamily: '"Roboto Mono", monospace', fontWeight: 800, color: '#1b1c1c', marginBottom: '8px' }}>99.9%</span>
                <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>Data Destruction Guarantee</span>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontFamily: '"Roboto Mono", monospace', fontWeight: 800, color: '#1b1c1c', marginBottom: '8px' }}>500+</span>
                <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>Certified Facilities Globally</span>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontFamily: '"Roboto Mono", monospace', fontWeight: 800, color: '#1b1c1c', marginBottom: '8px' }}>0%</span>
                <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>Landfill Contribution</span>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', fontFamily: '"Roboto Mono", monospace', fontWeight: 800, color: '#006036', marginBottom: '8px' }}>ESG</span>
                <span style={{ fontSize: '14px', color: '#3f4941', fontWeight: 600 }}>Automated Reporting</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="platform" style={{ paddingTop: '128px', paddingBottom: '128px', paddingLeft: '48px', paddingRight: '48px', maxWidth: '1440px', margin: '0 auto' }} className="animate-fade">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px auto' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#1b1c1c', marginBottom: '16px', letterSpacing: '-0.02em' }}>Complete Lifecycle Management</h2>
            <p style={{ fontSize: '18px', color: '#3f4941', lineHeight: 1.6 }}>Our enterprise solutions integrate seamlessly into your operations, providing end-to-end visibility and compliance.</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
            
            {/* Feature 1: Bulk Pickup */}
            <div style={{ flex: '2 1 600px', backgroundColor: '#e4e2e2', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden' }} className="hover-lift">
              <div style={{ position: 'relative', zIndex: 10, maxWidth: '60%', minWidth: '280px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#006036', marginBottom: '24px' }}>local_shipping</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#1b1c1c', marginBottom: '16px' }}>Global Bulk Pickup</h3>
                <p style={{ color: '#3f4941', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>Schedule secure logistics for massive hardware decommission projects. We handle chain-of-custody documentation from dock to processing facility.</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#006036', fontWeight: 700, cursor: 'pointer' }}>
                  Explore Logistics <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </span>
              </div>
              <div style={{ position: 'absolute', right: 0, bottom: 0, width: '50%', height: '100%', backgroundColor: '#fbf9f8', borderTopLeftRadius: '100px', opacity: 0.6 }}></div>
            </div>

            {/* Feature 2: Compliance */}
            <div style={{ flex: '1 1 300px', backgroundColor: '#f5f3f3', borderRadius: '24px', padding: '48px', border: '1px solid rgba(190, 201, 190, 0.4)', display: 'flex', flexDirection: 'column' }} className="hover-lift">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#006033', marginBottom: '24px' }}>description</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1b1c1c', marginBottom: '16px' }}>ESG Compliance Reports</h3>
              <p style={{ color: '#3f4941', fontSize: '16px', lineHeight: 1.6, marginBottom: 'auto' }}>Automated, audit-ready reporting that maps directly to global sustainability frameworks.</p>
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(190, 201, 190, 0.4)' }}>
                <span style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: '#006036', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certified Integration</span>
              </div>
            </div>

            {/* Feature 3: Certified Network */}
            <div style={{ flex: '1 1 300px', backgroundColor: '#f5f3f3', borderRadius: '24px', padding: '48px', border: '1px solid rgba(190, 201, 190, 0.4)' }} className="hover-lift">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#316944', marginBottom: '24px' }}>hub</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1b1c1c', marginBottom: '16px' }}>Certified Network</h3>
              <p style={{ color: '#3f4941', fontSize: '16px', lineHeight: 1.6 }}>Access our vetted global network of R2 and e-Stewards certified processing partners.</p>
            </div>

            {/* Feature 4: The Living Ledger */}
            <div style={{ flex: '2 1 600px', backgroundColor: '#006036', color: '#ffffff', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden' }} className="hover-lift">
              <div style={{ position: 'relative', zIndex: 10, maxWidth: '70%', minWidth: '280px' }}>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Powered by The Living Ledger</h3>
                <p style={{ color: '#80d9a0', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>Watch your sustainability impact grow in real-time. Our proprietary tracking system turns static disposal receipts into interactive ESG assets.</p>
                <button style={{ backgroundColor: '#ffffff', color: '#006036', padding: '16px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  View Live Demo
                </button>
              </div>
              <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '300px', height: '300px', backgroundColor: '#1a7a4a', borderRadius: '50%', filter: 'blur(40px)', zIndex: 1 }}></div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#fafaf9', padding: '48px', borderTop: '1px solid rgba(0,96,54,0.1)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
          <div style={{ fontSize: '12px', fontFamily: '"Roboto Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#006036', fontWeight: 600 }}>
            © 2024 Project Evolve. Carbon Neutral Enterprise.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '12px', fontFamily: '"Roboto Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>ESG Transparency</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>API Docs</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

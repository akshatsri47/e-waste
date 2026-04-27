'use client'

import { createClient } from '@/utils/supbase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'

type Tab = 'user' | 'admin'
type Mode = 'signin' | 'signup'

function LoginContent() {
  const supabase = createClient()
  const router = useRouter()
  const params = useSearchParams()
  const error = params.get('error')

  const [tab, setTab] = useState<Tab>('user')
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })

        if (signUpErr) throw signUpErr

        if (data.user && !data.session) {
          setSuccessMsg('Check your email to confirm your account, then sign in.')
          setMode('signin')
          setLoading(false)
          return
        }

        if (data.user) {
          const isAdminSignup = tab === 'admin'
          await supabase.from('users').upsert({
            id: data.user.id,
            email: data.user.email,
            name: name || data.user.email?.split('@')[0] || 'User',
            is_admin: isAdminSignup,
            total_points: 0,
          }, { onConflict: 'id', ignoreDuplicates: true })
          router.push(isAdminSignup ? '/admin' : '/dashboard')
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInErr) throw signInErr

        if (data.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', data.user.id)
            .single()

          if (tab === 'admin' && !profile?.is_admin) {
            await supabase.auth.signOut()
            throw new Error('This account does not have admin privileges.')
          }

          router.push(profile?.is_admin ? '/admin' : '/dashboard')
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      if (message.includes('Invalid login credentials')) {
        setFormError('Incorrect email or password.')
      } else if (message.includes('Email not confirmed')) {
        setFormError('Please confirm your email before signing in.')
      } else if (message.includes('already registered')) {
        setFormError('An account with this email already exists. Sign in instead.')
      } else {
        setFormError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = tab === 'admin'

  const theme = isAdmin ? {
    primary: '#1a2410',
    accent: '#7a9e4e',
    bgImg: 'url(https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2000&auto=format&fit=crop)',
    cardBg: 'rgba(26, 36, 16, 0.85)',
    textMain: '#ffffff',
    textMuted: 'rgba(255,255,255,0.6)',
    inputBg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)'
  } : {
    primary: '#2d4a1e',
    accent: '#6db33f',
    bgImg: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop)',
    cardBg: 'rgba(250, 247, 240, 0.92)',
    textMain: '#1a2410',
    textMuted: '#6b7a5e',
    inputBg: '#ffffff',
    border: 'rgba(74,124,47,0.15)'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: theme.bgImg,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      fontFamily: '"DM Sans", sans-serif',
      transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .premium-input {
          width: 100%; padding: 14px 18px;
          background: ${theme.inputBg};
          border: 1.5px solid ${theme.border};
          border-radius: 12px; color: ${theme.textMain};
          font-size: 14px; transition: all 0.3s;
          outline: none; box-sizing: border-box;
          font-family: inherit;
        }
        .premium-input:focus {
          border-color: ${theme.accent};
          box-shadow: 0 0 0 4px ${isAdmin ? 'rgba(122,158,78,0.2)' : 'rgba(109,179,63,0.15)'};
        }
        .premium-input::placeholder { color: ${theme.textMuted}; opacity: 0.7; }
        
        .social-btn:hover { background: ${isAdmin ? 'rgba(255,255,255,0.1)' : '#f2f4f0'} !important; }
        
        .toggle-btn { transition: all 0.3s ease; }
        .toggle-btn:hover { transform: translateY(-1px); }
        .toggle-btn.active { background: ${theme.primary} !important; color: white !important; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
      `}</style>
      
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: isAdmin ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', transition: 'all 0.6s' }} />

      <div style={{
        position: 'relative', zIndex: 10,
        background: theme.cardBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '24px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
        padding: '48px 40px',
        width: '100%', maxWidth: '440px',
        border: `1px solid ${theme.border}`,
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: theme.accent, borderRadius: '10px', display: 'grid', placeItems: 'center', boxShadow: `0 8px 20px ${theme.accent}40` }}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '24px', color: theme.textMain }}>Evolve</span>
          </Link>
          <h1 style={{ fontFamily: '"Syne", sans-serif', fontSize: '26px', fontWeight: 700, color: theme.textMain, marginTop: '24px', marginBottom: '8px' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Join the Movement'}
          </h1>
          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0, fontWeight: 400 }}>
            {isAdmin ? 'Access your administrative dashboard.' : 'Turn your e-waste into real-world rewards.'}
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display: 'flex', background: isAdmin ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
          borderRadius: '100px', padding: '6px', marginBottom: '32px'
        }}>
          {(['user', 'admin'] as Tab[]).map(t => (
            <button
              key={t} onClick={() => { setTab(t); setFormError(''); setSuccessMsg(''); setMode('signin') }}
              className={`toggle-btn ${tab === t ? 'active' : ''}`}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: '100px',
                fontSize: '14px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
                background: 'transparent', color: theme.textMuted, cursor: 'pointer',
              }}
            >
              {t === 'user' ? 'Individual' : 'Administrator'}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {(error || formError) && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{formError || 'Authentication failed.'}</span>
          </div>
        )}
        {successMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <input className="premium-input" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <input className="premium-input" type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <input className="premium-input" type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'signup' ? 6 : 1} />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', border: 'none', borderRadius: '100px',
              background: theme.primary, color: '#fff', fontSize: '15px', fontWeight: 600,
              fontFamily: '"Syne", sans-serif', letterSpacing: '0.02em', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: `0 8px 24px ${theme.primary}40`, transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            {loading ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : null}
            {loading ? 'Processing...' : mode === 'signup' ? 'Create Account' : `Sign In as ${isAdmin ? 'Admin' : 'User'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '14px', color: theme.textMuted }}>{mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}</span>
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setFormError(''); setSuccessMsg('') }}
            style={{ background: 'none', border: 'none', padding: 0, color: theme.accent, fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
          <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Or continue with</span>
          <div style={{ flex: 1, height: 1, background: theme.border }} />
        </div>

        <button
          className="social-btn" onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '14px', border: `1.5px solid ${theme.border}`, borderRadius: '100px',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: theme.textMain,
            fontFamily: '"DM Sans", sans-serif', transition: 'all 0.3s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.2-8 2.2-6.1 0-11.3-4.1-13.1-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z" />
            <path fill="#FBBC05" d="M10.9 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7v-6.2H2.7C1 16.5 0 20.1 0 24s1 7.5 2.7 10.9l8.2-6.2z" />
            <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.8 0 6.7 5.2 2.7 13.1l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
          </svg>
          Google
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
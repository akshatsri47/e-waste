'use client'

import { createClient } from '@/utils/supbase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

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
        // Sign up new user
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })

        if (signUpErr) throw signUpErr

        if (data.user && !data.session) {
          // Email confirmation required
          setSuccessMsg('Check your email to confirm your account, then sign in.')
          setMode('signin')
          setLoading(false)
          return
        }

        // Auto-signed in — sync to users table then redirect
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
        // Sign in
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInErr) throw signInErr

        if (data.user) {
          // Check role in users table
          const { data: profile } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', data.user.id)
            .single()

          // For admin tab — must be admin
          if (tab === 'admin' && !profile?.is_admin) {
            await supabase.auth.signOut()
            throw new Error('This account does not have admin privileges.')
          }

          router.push(profile?.is_admin ? '/admin' : '/dashboard')
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      // Friendly error messages
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

  const primaryColor = isAdmin ? '#7C3AED' : 'var(--color-primary)'
  const primaryGrad = isAdmin
    ? 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)'
    : 'linear-gradient(135deg, #0F4C2A 0%, #1A7A4A 40%, #2DB56C 100%)'
  const accentShadow = isAdmin
    ? 'rgba(124,58,237,0.3)'
    : 'rgba(26,122,74,0.3)'

  return (
    <div style={{
      minHeight: '100vh',
      background: primaryGrad,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px',
        background: 'rgba(255,255,255,0.06)', borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '350px', height: '350px',
        background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade" style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        padding: '40px 36px 36px',
        width: '100%',
        maxWidth: '440px',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 60, height: 60,
          background: `linear-gradient(135deg, ${isAdmin ? '#7C3AED' : 'var(--color-primary)'}, ${isAdmin ? '#A78BFA' : 'var(--color-primary-light)'})`,
          borderRadius: 'var(--radius-md)',
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${accentShadow}`,
          transition: 'all 0.4s ease',
        }}>
          {isAdmin ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.16 9 11.36C17.25 22.16 21 17.25 21 12V7l-9-5z" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="rgba(255,255,255,0.2)" />
              <path d="M10 16l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 8l-2 4M10 8l2 4M16 6v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          )}
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '4px' }}>
          Welcome to EcoRecycle
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginBottom: '24px', lineHeight: 1.5 }}>
          {isAdmin ? 'Admin portal — manage pickups & users.' : 'Schedule pickups, earn eco-points, help the planet.'}
        </p>

        {/* User / Admin toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          marginBottom: '24px',
          border: '1.5px solid var(--color-neutral-100)',
        }}>
          {(['user', 'admin'] as Tab[]).map(t => (
            <button
              key={t}
              id={`tab-${t}`}
              onClick={() => { setTab(t); setFormError(''); setSuccessMsg(''); setMode('signin') }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-family)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: tab === t
                  ? (t === 'admin' ? '#7C3AED' : 'var(--color-primary)')
                  : 'transparent',
                color: tab === t ? '#fff' : 'var(--color-neutral-500)',
                boxShadow: tab === t ? `0 2px 8px ${accentShadow}` : 'none',
              }}
            >
              {t === 'user' ? '👤 User' : '🛡️ Admin'}
            </button>
          ))}
        </div>

        {/* Error / Success banners */}
        {(error || formError) && (
          <div style={{
            background: '#FEE2E2', color: '#991B1B',
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            fontSize: '13px', marginBottom: '16px', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span>⚠️</span>
            {formError || 'Authentication failed. Please try again.'}
          </div>
        )}
        {successMsg && (
          <div style={{
            background: '#D1FAE5', color: '#065F46',
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            fontSize: '13px', marginBottom: '16px', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span>✅</span>{successMsg}
          </div>
        )}

        {/* Email/Password form */}
        <form onSubmit={handleEmailAuth} style={{ textAlign: 'left' }}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label className="label" htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                className="input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label className="label" htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label" htmlFor="password-input">Password</label>
            <input
              id="password-input"
              className="input"
              type="password"
              placeholder={mode === 'signup' ? 'Min 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? 6 : 1}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            id="email-auth-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              background: isAdmin
                ? 'linear-gradient(135deg, #7C3AED, #A78BFA)'
                : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'var(--font-family)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 16px ${accentShadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
              </>
            ) : (
              mode === 'signup' ? 'Create Account' : `Sign In as ${tab === 'admin' ? 'Admin' : 'User'}`
            )}
          </button>
        </form>

        {/* Toggle sign-in / sign-up */}
        <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-neutral-500)', textAlign: 'center' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            id="toggle-mode-btn"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setFormError(''); setSuccessMsg('') }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: isAdmin ? '#7C3AED' : 'var(--color-primary)', fontWeight: 600, fontSize: '13px',
              fontFamily: 'var(--font-family)',
            }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-100)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-300)', fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-neutral-100)' }} />
        </div>

        {/* Google OAuth */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '13px 20px',
            border: '1.5px solid var(--color-neutral-100)',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            cursor: 'pointer', transition: 'all 0.2s ease',
            fontSize: '14px', fontWeight: 600,
            color: 'var(--color-neutral-900)',
            boxShadow: 'var(--shadow-sm)',
            fontFamily: 'var(--font-family)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = 'var(--color-neutral-50)'
            el.style.boxShadow = 'var(--shadow-md)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background = 'var(--color-surface)'
            el.style.boxShadow = 'var(--shadow-sm)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z" />
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.2-8 2.2-6.1 0-11.3-4.1-13.1-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z" />
            <path fill="#FBBC05" d="M10.9 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7v-6.2H2.7C1 16.5 0 20.1 0 24s1 7.5 2.7 10.9l8.2-6.2z" />
            <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.4 0 24 0 14.8 0 6.7 5.2 2.7 13.1l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" />
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '20px', fontSize: '11px', color: 'var(--color-neutral-300)', lineHeight: 1.6, textAlign: 'center' }}>
          By signing in you agree to our terms of service.
        </p>

        {/* Stats row */}
        <div style={{
          marginTop: '20px', paddingTop: '20px',
          borderTop: '1px solid var(--color-neutral-100)',
          display: 'flex', justifyContent: 'space-around',
        }}>
          {[
            { val: '2.4T', label: 'CO₂ Saved' },
            { val: '18K', label: 'Items Recycled' },
            { val: '5K+', label: 'Users' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: primaryColor, transition: 'color 0.4s' }}>{s.val}</div>
              <div style={{ fontSize: '10px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
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
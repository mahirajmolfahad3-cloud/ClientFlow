'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ─── Sage + Slate tokens ──────────────────────────────────────────────────────
const C = {
  sage:      '#7c9e8f',
  sageDark:  '#5a7d6e',
  sageDeep:  '#3d5c50',
  sageLight: '#eef4f1',
  sageMid:   '#c2d9d0',
  slate950:  '#0c1117',
  slate900:  '#111827',
  slate700:  '#374151',
  slate600:  '#4b5563',
  slate500:  '#6b7280',
  slate400:  '#9ca3af',
  slate300:  '#d1d5db',
  slate200:  '#e5e7eb',
  slate100:  '#f3f4f6',
  slate50:   '#f9fafb',
  white:     '#ffffff',
  red50:     '#fef2f2',
  red200:    '#fecaca',
  red700:    '#b91c1c',
}

const font = `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${font}; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-input {
    width: 100%;
    border: 1.5px solid ${C.slate200};
    background: ${C.white};
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: ${font};
    color: ${C.slate900};
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .login-input::placeholder { color: ${C.slate400}; }
  .login-input:focus {
    border-color: ${C.sage};
    box-shadow: 0 0 0 3px ${C.sageLight};
  }
  .login-input:disabled { opacity: .55; cursor: not-allowed; }

  .btn-sage {
    width: 100%;
    background: ${C.sage};
    color: ${C.white};
    border: none;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 600;
    font-family: ${font};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background .18s, transform .15s, box-shadow .18s;
  }
  .btn-sage:hover:not(:disabled) {
    background: ${C.sageDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124,158,143,.3);
  }
  .btn-sage:active:not(:disabled) { transform: translateY(0); }
  .btn-sage:disabled { opacity: .6; cursor: not-allowed; }

  .btn-outline {
    width: 100%;
    background: ${C.white};
    color: ${C.slate700};
    border: 1.5px solid ${C.slate300};
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 600;
    font-family: ${font};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: border-color .18s, background .18s, color .18s;
  }
  .btn-outline:hover:not(:disabled) {
    border-color: ${C.sage};
    color: ${C.sage};
    background: ${C.sageLight};
  }
  .btn-outline:disabled { opacity: .6; cursor: not-allowed; }

  @media (min-width: 1024px) {
    .left-panel      { display: flex !important; }
    .mobile-logo     { display: none !important; }
  }
`

const stats = [
  { n: '1,234+', l: 'Freelancers' },
  { n: '$5k+',   l: 'Revenue managed' },
  { n: '98%',    l: 'Satisfaction' },
  { n: '5 ★',   l: 'Average rating' },
]

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } =
      await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const { data } = await supabase.auth.getSession()
    if (data.session) window.location.href = '/dashboard'
  }

  async function handleDemoLogin() {
    setError('')
    setLoading(true)

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: 'demo@clientflow.com',
        password: '2939189mahirajmol',
      })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        background: C.slate50, fontFamily: font,
      }}>

        {/* ── LEFT PANEL ──────────────────────────────────────────────── */}
        <div
          className="left-panel"
          style={{
            display: 'none',
            width: '50%', flexShrink: 0,
            flexDirection: 'column', justifyContent: 'space-between',
            padding: '48px 52px',
            background: C.slate950,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Glow blobs */}
          <div style={{
            position: 'absolute', top: -100, left: -100,
            width: 360, height: 360,
            background: `${C.sage}18`,
            borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -80, right: -80,
            width: 300, height: 300,
            background: `${C.sageDeep}22`,
            borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          {/* Logo */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', position: 'relative', zIndex: 1,
          }}>
            <div style={{
              width: 34, height: 34, background: C.sage,
              borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>CF</span>
            </div>
            <span style={{ color: C.white, fontWeight: 800, fontSize: 18, letterSpacing: '-.03em' }}>
              ClientFlow
            </span>
          </Link>

          {/* Main copy */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              color: C.white, fontSize: 36, fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-.04em', marginBottom: 18,
            }}>
              Welcome back to<br />your client hub
            </h2>
            <p style={{ color: C.slate400, fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
              Everything you need to run your freelance business, organised and ready when you are.
            </p>
          </div>

          {/* Stats grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            position: 'relative', zIndex: 1,
          }}>
            {stats.map(({ n, l }) => (
              <div key={l} style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12, padding: '16px 18px',
              }}>
                <p style={{ color: C.white, fontSize: 20, fontWeight: 800, marginBottom: 3 }}>{n}</p>
                <p style={{ color: C.slate400, fontSize: 13 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px',
        }}>
          <div style={{
            width: '100%', maxWidth: 420,
            animation: 'fadeUp .45s ease both',
          }}>

            {/* Mobile logo */}
            <div className="mobile-logo" style={{
              display: 'flex', justifyContent: 'center', marginBottom: 28,
            }}>
              <Link href="/" style={{
                display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              }}>
                <div style={{
                  width: 30, height: 30, background: C.sage,
                  borderRadius: 8, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>CF</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, color: C.slate900, letterSpacing: '-.02em' }}>
                  ClientFlow
                </span>
              </Link>
            </div>

            {/* Card */}
            <div style={{
              background: C.white,
              border: `1px solid ${C.slate200}`,
              borderRadius: 16,
              padding: '32px 28px',
              boxShadow: '0 4px 24px rgba(15,23,42,.07)',
            }}>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{
                  fontSize: 24, fontWeight: 800,
                  color: C.slate900, letterSpacing: '-.03em', marginBottom: 4,
                }}>
                  Sign in
                </h1>
                <p style={{ fontSize: 14, color: C.slate500 }}>
                  Welcome back to ClientFlow
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: C.red50, border: `1px solid ${C.red200}`,
                  color: C.red700, fontSize: 13, borderRadius: 9,
                  padding: '10px 14px', marginBottom: 20,
                }}>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600,
                    color: C.slate700, marginBottom: 6,
                  }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="login-input"
                  />
                </div>

                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: 6,
                  }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.slate700 }}>
                      Password
                    </label>
                    <Link href="/forgot-password" style={{
                      fontSize: 12, color: C.sage,
                      textDecoration: 'none', fontWeight: 500,
                    }}>
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="login-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <button type="submit" disabled={loading} className="btn-sage">
                    {loading && (
                      <div style={{
                        width: 15, height: 15,
                        border: '2px solid rgba(255,255,255,.4)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin .7s linear infinite',
                      }} />
                    )}
                    {loading ? 'Signing in…' : 'Sign in'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="btn-outline"
                  >
                    Try demo mode
                  </button>
                </div>

              </form>

              {/* Footer */}
              <p style={{
                textAlign: 'center', fontSize: 13,
                color: C.slate500, marginTop: 22,
              }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{
                  color: C.sage, fontWeight: 600, textDecoration: 'none',
                }}>
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

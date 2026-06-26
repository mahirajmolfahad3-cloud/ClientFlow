'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    if (data.session) {
      window.location.href = '/dashboard'
    }
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-indigo-50 to-white">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 p-12 flex-col justify-between">

        {/* glow effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-400/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-violet-400/10 blur-3xl rounded-full"></div>

        {/* logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group">
          <div className="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center
                          group-hover:scale-105 transition">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">
            ClientFlow
          </span>
        </Link>

        {/* content */}
        <div className="space-y-6 relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight tracking-tight">
            Welcome back to your client hub
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Everything you need to run your freelance business, organized and ready when you are.
          </p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {[
            ['100+', 'Freelancers'],
            ['5k+', 'Projects tracked'],
            ['98.9%', 'Satisfaction'],
            ['5★', 'Average rating']
          ].map(([n, l]) => (
            <div
              key={l}
              className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-4
                         hover:bg-white/15 transition"
            >
              <p className="text-white text-xl font-bold">{n}</p>
              <p className="text-indigo-100 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          {/* CARD */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100
                          shadow-xl rounded-3xl p-8 space-y-7
                          hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">

            {/* header */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Sign in
              </h1>
              <p className="text-gray-500 text-sm">
                Welcome back to ClientFlow
              </p>
            </div>

            {/* error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 animate-pulse">
                {error}
              </div>
            )}

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  disabled={loading}
                  className="w-full border border-gray-200 bg-white rounded-2xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-4 focus:ring-indigo-100
                             focus:border-indigo-500 transition"
                />
              </div>

              {/* password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  className="w-full border border-gray-200 bg-white rounded-2xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-4 focus:ring-indigo-100
                             focus:border-indigo-500 transition"
                />
              </div>

              {/* button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700
                           text-white rounded-2xl py-3 text-sm font-semibold
                           hover:from-indigo-700 hover:via-violet-700 hover:to-indigo-800
                           active:scale-[0.98] transition-all duration-200
                           disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full border-2 border-indigo-100 text-indigo-600 rounded-2xl py-3
                          text-sm font-semibold hover:bg-indigo-50
                          transition-all duration-200 flex items-center justify-center gap-2"
              >
                Try Demo Account
              </button>              
            </form>

            {/* footer */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
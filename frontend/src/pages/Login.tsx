import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  BookOpen
} from 'lucide-react'

interface LoginFormData {
  registrationId: string
  password: string
}

type LoginMode = 'student' | 'admin'

const HERO_IMAGE = '/vignan-campus.png'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    registrationId: '',
    password: ''
  })
  const [loginMode, setLoginMode] = useState<LoginMode>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.registrationId || !formData.password) {
      setError('Please fill in all fields')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: loginMode === 'student' ? formData.registrationId : undefined,
          adminId: loginMode === 'admin' ? formData.registrationId : undefined,
          password: formData.password,
          role: loginMode
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect by role
        navigate(data.user?.role === 'admin' ? '/admin' : '/')
      } else {
        setError(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl float-slow" />
      <div className="absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl float-slow" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-[68.75rem] min-h-[520px] overflow-hidden rounded-[22px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl auth-grid">
          <div className="grid lg:grid-cols-2">
            <div className="bg-slate-900/80 p-6 lg:p-7">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  University Smart Portal
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-slate-300">Secure student access</span>
                </div>

                <h1 className="mt-6 text-4xl font-display leading-tight text-white">
                  AI Student Support
                  <span className="block text-slate-300">System</span>
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  24/7 assistance for admissions, academics, finance, campus services, and counseling with protected portal access.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setLoginMode('student')}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      loginMode === 'student'
                        ? 'border-cyan-300/60 bg-cyan-500/15 text-white'
                        : 'border-white/10 bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    Student Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode('admin')}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      loginMode === 'admin'
                        ? 'border-rose-300/60 bg-rose-500/15 text-white'
                        : 'border-white/10 bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    Admin Login
                  </button>
                </div>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-cyan-300" />
                      <p className="text-sm text-slate-200">Student-first workflow</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Registration-number based sign in with guided support modules.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-rose-300" />
                      <p className="text-sm text-slate-200">Protected portal access</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">JWT secured sessions and encrypted student records.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 text-slate-900 lg:p-7">
              <div className="fade-up">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
                  {loginMode === 'student' ? 'Student Login' : 'Admin Login'}
                </p>
                <h2 className="mt-3 text-3xl font-display text-slate-900">
                  {loginMode === 'student' ? 'Welcome back' : 'Admin access'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {loginMode === 'student'
                    ? 'Sign in with your registration ID and password to access academic, financial, and AI support tools.'
                    : 'Sign in with your admin ID and password to manage student services and system settings.'}
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                      <span className="text-sm text-rose-700">{error}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="registrationId" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {loginMode === 'student' ? 'Registration ID' : 'Admin ID'}
                    </label>
                    <div className="relative mt-2">
                      <input
                          id="registrationId"
                          name="registrationId"
                          type="text"
                        required
                          value={formData.registrationId}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          placeholder={loginMode === 'student' ? 'ST2024001' : 'ADMIN-001'}
                      />
                        <GraduationCap className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 transition hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-200"
                      />
                      Remember me
                    </label>
                    <a href="#" className="text-slate-500 hover:text-rose-500">
                      Forgot password
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Signing In...' : 'Login'}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Need access? Contact your department admin.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

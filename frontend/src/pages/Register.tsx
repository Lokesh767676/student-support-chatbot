import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Lock,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  BookOpen
} from 'lucide-react'

interface RegisterFormData {
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
  studentId: string
  program: string
  year: string
  gpa: string
}

const HERO_IMAGE = '/vignan-campus.png'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    program: '',
    year: '',
    gpa: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const programs = [
    'Computer Science',
    'Business Administration', 
    'Engineering',
    'Arts & Design',
    'Science',
    'Medicine',
    'Law',
    'Education'
  ]

  const years = ['1', '2', '3', '4', '5', '6']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.password || !formData.confirmPassword || !formData.studentId || !formData.program || !formData.year) {
      setError('Please fill in all required fields')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (formData.gpa && (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 10.0)) {
      setError('GPA must be between 0.0 and 10.0')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          studentId: formData.studentId,
          program: formData.program,
          year: parseInt(formData.year),
          gpa: formData.gpa ? parseFloat(formData.gpa) : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
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
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl auth-grid">
          <div className="grid lg:grid-cols-2">
            <div className="bg-slate-900/80 p-10 lg:p-12">
              <div className="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  University Smart Portal
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-slate-300">Join the smart campus experience</span>
                </div>

                <h1 className="mt-6 text-4xl font-display leading-tight text-white">
                  Create your
                  <span className="block text-slate-300">student profile</span>
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  Unlock AI assistance, smart workflows, and centralized support with a single secure account.
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-cyan-300" />
                      <p className="text-sm text-slate-200">Guided onboarding</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Tell us your program details and we tailor the support modules.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-rose-300" />
                      <p className="text-sm text-slate-200">Secure data</p>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Verified credentials with protected student records.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-10 text-slate-900 lg:p-12">
              <div className="fade-up">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">Student Registration</p>
                <h2 className="mt-3 text-3xl font-display text-slate-900">Create your account</h2>
                <p className="mt-2 text-sm text-slate-500">Fill in your student details to activate the portal.</p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                      <span className="text-sm text-rose-700">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm text-emerald-700">{success}</span>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        First Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          placeholder="John"
                        />
                        <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Last Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          placeholder="Doe"
                        />
                        <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="studentId" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Student ID
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        placeholder="ST2024001"
                      />
                      <GraduationCap className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="program" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Program
                      </label>
                      <select
                        id="program"
                        name="program"
                        required
                        value={formData.program}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="">Select Program</option>
                        {programs.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Year
                      </label>
                      <select
                        id="year"
                        name="year"
                        required
                        value={formData.year}
                        onChange={handleInputChange}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>Year {year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gpa" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Current GPA (Optional)
                    </label>
                    <input
                      id="gpa"
                      name="gpa"
                      type="text"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      placeholder="3.5"
                    />
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

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Confirm Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 transition hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-rose-500 hover:text-rose-600">
                      Sign in here
                    </Link>
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

export default Register

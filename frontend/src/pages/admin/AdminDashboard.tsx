import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  DollarSign,
  Building,
  Heart,
  Briefcase,
  Share2,
  HelpCircle,
  Users
} from 'lucide-react'
import Modal from '../../components/Modal'

const ADMIN_MODULES = [
  {
    id: 'admission',
    title: 'Admissions',
    description: 'Approve applications, update program info, and review eligibility data.',
    icon: GraduationCap,
    accent: 'bg-blue-500'
  },
  {
    id: 'academic',
    title: 'Academics',
    description: 'Manage course registrations, calendars, and academic resources.',
    icon: BookOpen,
    accent: 'bg-emerald-500'
  },
  {
    id: 'financial',
    title: 'Financial Aid',
    description: 'Control scholarships, payment plans, and student financial requests.',
    icon: DollarSign,
    accent: 'bg-amber-500'
  },
  {
    id: 'campus',
    title: 'Campus Services',
    description: 'Oversee hostel applications, transport updates, and campus requests.',
    icon: Building,
    accent: 'bg-violet-500'
  },
  {
    id: 'mental-health',
    title: 'Wellbeing',
    description: 'Coordinate counseling requests and resource access approvals.',
    icon: Heart,
    accent: 'bg-rose-500'
  },
  {
    id: 'career',
    title: 'Career Support',
    description: 'Track resume reviews, mock interviews, and internship pipelines.',
    icon: Briefcase,
    accent: 'bg-indigo-500'
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Schedule announcements and moderate student-facing posts.',
    icon: Share2,
    accent: 'bg-sky-500'
  },
  {
    id: 'ai-faqs',
    title: 'AI FAQs',
    description: 'Curate AI-generated FAQs and publish verified answers.',
    icon: HelpCircle,
    accent: 'bg-slate-600'
  }
]

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const [showStudents, setShowStudents] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentsError, setStudentsError] = useState('')

  const loadStudents = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setStudentsLoading(true)
      setStudentsError('')
      const response = await fetch(`${apiBaseUrl}/admin/students?status=active`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to load students')
      }

      const data = await response.json()
      setStudents(data.students || [])
    } catch (error) {
      setStudentsError('Unable to load active students')
    } finally {
      setStudentsLoading(false)
    }
  }

  const openStudentsModal = () => {
    setShowStudents(true)
    loadStudents()
  }

  const toggleStudentStatus = async (studentId: string, isActive: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update student')
      }

      setStudents((prev) => prev.map((student) => (
        student._id === studentId ? { ...student, isActive } : student
      )))
    } catch (error) {
      setStudentsError('Unable to update student status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Control Center</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor student activity, approve requests, and manage every support module.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openStudentsModal}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
            >
              <Users className="h-4 w-4" />
              View active students
            </button>
            <button
              onClick={() => navigate('/admin/modules?status=pending')}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <ClipboardCheck className="h-4 w-4" />
              Review pending approvals
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Manage modules</h2>
          <p className="mt-2 text-sm text-gray-600">
            Each module controls the data students see and the requests they submit.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {ADMIN_MODULES.map((module) => {
              const Icon = module.icon
              return (
                <Link
                  key={module.id}
                  to={`/admin/${module.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl ${module.accent} p-3 text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Open</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-gray-800">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {showStudents && (
        <Modal title="Active students" onClose={() => setShowStudents(false)}>
          {studentsError && (
            <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {studentsError}
            </div>
          )}
          {studentsLoading ? (
            <div className="text-sm text-gray-500">Loading students...</div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student._id} className="rounded-lg border border-gray-200 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{student.studentId} • {student.program}</p>
                    </div>
                    <button
                      onClick={() => toggleStudentStatus(student._id, !student.isActive)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      {student.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
              {!students.length && (
                <div className="text-sm text-gray-500">No active students found.</div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard

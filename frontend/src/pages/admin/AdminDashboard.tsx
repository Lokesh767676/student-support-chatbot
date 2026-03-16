import React from 'react'
import { Link } from 'react-router-dom'
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
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              <Users className="h-4 w-4" />
              View active students
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
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
    </div>
  )
}

export default AdminDashboard

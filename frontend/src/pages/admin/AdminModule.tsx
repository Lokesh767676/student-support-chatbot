import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  GraduationCap,
  BookOpen,
  DollarSign,
  Building,
  Heart,
  Briefcase,
  Share2,
  HelpCircle,
  ClipboardCheck,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react'

const MODULE_CONFIG: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  admission: {
    title: 'Admissions Module',
    description: 'Review applications, set eligibility rules, and publish program updates.',
    icon: GraduationCap
  },
  academic: {
    title: 'Academic Module',
    description: 'Approve course registrations and maintain academic calendars.',
    icon: BookOpen
  },
  financial: {
    title: 'Financial Module',
    description: 'Approve scholarships, payment plans, and fee adjustments.',
    icon: DollarSign
  },
  campus: {
    title: 'Campus Module',
    description: 'Manage hostel requests, transportation updates, and campus services.',
    icon: Building
  },
  'mental-health': {
    title: 'Mental Health Module',
    description: 'Handle counseling appointments and wellbeing resource access.',
    icon: Heart
  },
  career: {
    title: 'Career Module',
    description: 'Review resume feedback requests and mock interview bookings.',
    icon: Briefcase
  },
  'social-media': {
    title: 'Social Media Module',
    description: 'Schedule announcements and moderate student-facing content.',
    icon: Share2
  },
  'ai-faqs': {
    title: 'AI FAQs Module',
    description: 'Approve AI-generated answers before students see them.',
    icon: HelpCircle
  }
}

const AdminModule: React.FC = () => {
  const { moduleId } = useParams()
  const config = moduleId ? MODULE_CONFIG[moduleId] : null

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Module not found.</p>
          <Link to="/admin" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to admin dashboard
          </Link>
        </div>
      </div>
    )
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin" className="inline-flex items-center text-sm font-semibold text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to admin dashboard
        </Link>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gray-900 p-3 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{config.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{config.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                <FileSpreadsheet className="h-4 w-4" />
                Export data
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                <ClipboardCheck className="h-4 w-4" />
                Review requests
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Pending student requests</h2>
            <p className="mt-2 text-sm text-gray-600">
              Incoming submissions from students appear here for review and approval.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
              No requests loaded. Connect the backend to display live submissions.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Published data controls</h2>
            <p className="mt-2 text-sm text-gray-600">
              Update the content students can see, and push announcements instantly.
            </p>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Update module content
              </button>
              <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Publish announcement
              </button>
              <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Configure access rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminModule

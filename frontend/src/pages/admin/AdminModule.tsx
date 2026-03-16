import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  ArrowLeft,
  Megaphone,
  Settings
} from 'lucide-react'
import Modal from '../../components/Modal'

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

const STATUS_OPTIONS: Record<string, string[]> = {
  admission: ['submitted', 'under-review', 'accepted', 'rejected'],
  academic: ['submitted', 'approved', 'rejected'],
  'financial-scholarship': ['submitted', 'reviewing', 'approved', 'rejected'],
  'financial-payment': ['submitted', 'approved', 'rejected'],
  'campus-hostel': ['submitted', 'approved', 'rejected'],
  'campus-map': ['submitted', 'completed', 'rejected'],
  'mental-appointment': ['submitted', 'scheduled', 'completed', 'cancelled'],
  'mental-group': ['submitted', 'approved', 'rejected'],
  'mental-resource': ['submitted', 'approved', 'rejected'],
  'career-resume': ['submitted', 'reviewing', 'completed'],
  'career-mock': ['submitted', 'scheduled', 'completed', 'cancelled']
}

interface ModuleDetails {
  title: string
  description: string
  isActive?: boolean
  visibility?: string
  announcements?: Array<{ title: string; message: string; createdAt: string }>
}

interface ModuleRequest {
  id: string
  collection: string
  title: string
  subtitle: string
  status: string
  submittedAt: string
  details: Record<string, string>
}

const AdminModule: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const { moduleId } = useParams()
  const config = moduleId ? MODULE_CONFIG[moduleId] : null
  const requestSectionRef = useRef<HTMLDivElement>(null)

  const [moduleDetails, setModuleDetails] = useState<ModuleDetails | null>(null)
  const [requests, setRequests] = useState<ModuleRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isActive: true,
    visibility: 'both'
  })
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: ''
  })

  const Icon = config?.icon

  const fetchModuleDetails = async () => {
    if (!moduleId) return
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch module details')
      }

      const data = await response.json()
      setModuleDetails(data.module)
      setEditForm({
        title: data.module.title,
        description: data.module.description,
        isActive: data.module.isActive,
        visibility: data.module.visibility
      })
    } catch (err) {
      setError('Unable to load module details')
    }
  }

  const fetchRequests = async (statusValue = statusFilter) => {
    if (!moduleId) return
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${apiBaseUrl}/admin/requests/${moduleId}?status=${statusValue}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch requests')
      }

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError('Unable to load module requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModuleDetails()
    fetchRequests()
  }, [moduleId])

  const handleExport = () => {
    if (!requests.length) return

    const header = ['Title', 'Subtitle', 'Status', 'Submitted At', 'Collection']
    const rows = requests.map((request) => [
      request.title,
      request.subtitle,
      request.status,
      new Date(request.submittedAt).toLocaleString(),
      request.collection
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${moduleId}-requests.csv`
    link.click()
  }

  const handleReviewRequests = () => {
    setStatusFilter('pending')
    fetchRequests('pending')
    requestSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUpdateStatus = async (request: ModuleRequest, status: string) => {
    const token = localStorage.getItem('token')
    if (!token || !moduleId) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/requests/${moduleId}/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          collection: request.collection,
          status
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setRequests((prev) =>
        prev.map((item) => (item.id === request.id ? { ...item, status } : item))
      )
    } catch (err) {
      setError('Unable to update request status')
    }
  }

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleId) return
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) {
        throw new Error('Failed to update module')
      }

      const data = await response.json()
      setModuleDetails(data.module)
      setShowEditModal(false)
    } catch (err) {
      setError('Unable to update module settings')
    }
  }

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moduleId) return
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/modules/${moduleId}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(announcementForm)
      })

      if (!response.ok) {
        throw new Error('Failed to publish announcement')
      }

      const data = await response.json()
      setModuleDetails(data.module)
      setAnnouncementForm({ title: '', message: '' })
      setShowAnnouncementModal(false)
    } catch (err) {
      setError('Unable to publish announcement')
    }
  }

  const statusOptionsForRequest = useMemo(() => {
    const mapping: Record<string, string[]> = { ...STATUS_OPTIONS }
    if (moduleId && mapping[moduleId]) {
      return mapping[moduleId]
    }
    return []
  }, [moduleId])

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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/admin/modules" className="inline-flex items-center text-sm font-semibold text-blue-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to modules
        </Link>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gray-900 p-3 text-white">
                {Icon && <Icon className="h-6 w-6" />}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{moduleDetails?.title || config.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{moduleDetails?.description || config.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export data
              </button>
              <button
                onClick={handleReviewRequests}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
              >
                <ClipboardCheck className="h-4 w-4" />
                Review requests
              </button>
            </div>
          </div>

          {moduleDetails && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className={`rounded-full px-2 py-1 ${moduleDetails.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {moduleDetails.isActive ? 'Active' : 'Paused'}
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{moduleDetails.visibility}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div ref={requestSectionRef} className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pending student requests</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Incoming submissions from students appear here for review and approval.
                </p>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  fetchRequests(e.target.value)
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="all">All</option>
              </select>
            </div>

            {loading ? (
              <div className="mt-4 text-sm text-gray-500">Loading requests...</div>
            ) : requests.length ? (
              <div className="mt-4 space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{request.title}</h3>
                        <p className="text-xs text-gray-500">{request.subtitle}</p>
                      </div>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-600">
                        {request.status}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Submitted: {new Date(request.submittedAt).toLocaleString()}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <select
                        value={request.status}
                        onChange={(e) => handleUpdateStatus(request, e.target.value)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                      >
                        {(STATUS_OPTIONS[request.collection] || statusOptionsForRequest).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-400">{request.collection}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                No requests loaded. Try adjusting the filter or check back later.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Published data controls</h2>
            <p className="mt-2 text-sm text-gray-600">
              Update the content students can see, and push announcements instantly.
            </p>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <Settings className="h-4 w-4" />
                Update module content
              </button>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <Megaphone className="h-4 w-4" />
                Publish announcement
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                <Settings className="h-4 w-4" />
                Configure access rules
              </button>
            </div>

            {moduleDetails?.announcements?.length ? (
              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                Latest announcement: {moduleDetails.announcements[moduleDetails.announcements.length - 1].title}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showEditModal && (
        <Modal title="Update module" onClose={() => setShowEditModal(false)}>
          <form className="space-y-4" onSubmit={handleSaveModule}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="moduleActive"
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="moduleActive" className="text-sm text-gray-700">Active for users</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <select
                value={editForm.visibility}
                onChange={(e) => setEditForm((prev) => ({ ...prev, visibility: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="both">Students and admins</option>
                <option value="students">Students only</option>
                <option value="admins">Admins only</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {showAnnouncementModal && (
        <Modal title="Publish announcement" onClose={() => setShowAnnouncementModal(false)}>
          <form className="space-y-4" onSubmit={handlePublishAnnouncement}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={4}
                required
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Publish
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminModule

import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Settings, Eye, EyeOff, Pencil, Megaphone, ArrowRight } from 'lucide-react'
import Modal from '../../components/Modal'

interface ModuleConfig {
  _id: string
  moduleId: string
  title: string
  description: string
  isActive: boolean
  visibility: 'students' | 'admins' | 'both'
  announcements?: Array<{ title: string; message: string; createdAt: string }>
}

const AdminModules: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const location = useLocation()
  const statusFilter = useMemo(() => new URLSearchParams(location.search).get('status') || 'all', [location.search])

  const [modules, setModules] = useState<ModuleConfig[]>([])
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    isActive: true,
    visibility: 'both' as ModuleConfig['visibility']
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: ''
  })

  const loadModules = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${apiBaseUrl}/admin/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to load modules')
      }

      const data = await response.json()
      setModules(data.modules || [])
    } catch (err) {
      setError('Unable to load module configuration')
    } finally {
      setLoading(false)
    }
  }

  const loadPendingCounts = async (moduleList: ModuleConfig[]) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const counts: Record<string, number> = {}
    await Promise.all(
      moduleList.map(async (module) => {
        try {
          const response = await fetch(`${apiBaseUrl}/admin/requests/${module.moduleId}?status=pending`, {
            headers: { Authorization: `Bearer ${token}` }
          })

          if (!response.ok) {
            counts[module.moduleId] = 0
            return
          }

          const data = await response.json()
          counts[module.moduleId] = (data.requests || []).length
        } catch {
          counts[module.moduleId] = 0
        }
      })
    )

    setPendingCounts(counts)
  }

  useEffect(() => {
    loadModules()
  }, [])

  useEffect(() => {
    if (modules.length) {
      loadPendingCounts(modules)
    }
  }, [modules])

  const openEditModal = (module: ModuleConfig) => {
    setSelectedModule(module)
    setEditForm({
      title: module.title,
      description: module.description,
      isActive: module.isActive,
      visibility: module.visibility
    })
    setShowEditModal(true)
  }

  const openAnnouncementModal = (module: ModuleConfig) => {
    setSelectedModule(module)
    setAnnouncementForm({ title: '', message: '' })
    setShowAnnouncementModal(true)
  }

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModule) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/modules/${selectedModule.moduleId}`, {
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
      setModules((prev) =>
        prev.map((module) => (module.moduleId === selectedModule.moduleId ? data.module : module))
      )
      setShowEditModal(false)
    } catch (err) {
      setError('Unable to update module settings')
    }
  }

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModule) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${apiBaseUrl}/admin/modules/${selectedModule.moduleId}/announcements`, {
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
      setModules((prev) =>
        prev.map((module) => (module.moduleId === selectedModule.moduleId ? data.module : module))
      )
      setShowAnnouncementModal(false)
    } catch (err) {
      setError('Unable to publish announcement')
    }
  }

  const filteredModules = statusFilter === 'pending'
    ? modules.filter((module) => (pendingCounts[module.moduleId] || 0) > 0)
    : modules

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Module Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update module settings, publish announcements, and review pending requests.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Settings className="h-4 w-4" />
            Admin tools
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-sm text-gray-500">Loading modules...</div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {filteredModules.map((module) => (
              <div key={module.moduleId} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{module.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{module.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      module.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {module.isActive ? 'Active' : 'Paused'}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {module.visibility}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    {module.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {module.isActive ? 'Visible' : 'Hidden'}
                  </div>
                  <div>Pending: {pendingCounts[module.moduleId] || 0}</div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => openEditModal(module)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit module
                  </button>
                  <button
                    onClick={() => openAnnouncementModal(module)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700"
                  >
                    <Megaphone className="h-4 w-4" />
                    Announcement
                  </button>
                  <Link
                    to={`/admin/${module.moduleId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Review requests
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {module.announcements && module.announcements.length > 0 && (
                  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    Latest announcement: {module.announcements[module.announcements.length - 1].title}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditModal && selectedModule && (
        <Modal title={`Edit ${selectedModule.title}`} onClose={() => setShowEditModal(false)}>
          <form className="space-y-4" onSubmit={handleUpdateModule}>
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
                id="isActive"
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active for users</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <select
                value={editForm.visibility}
                onChange={(e) => setEditForm((prev) => ({ ...prev, visibility: e.target.value as ModuleConfig['visibility'] }))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="both">Students and admins</option>
                <option value="students">Students only</option>
                <option value="admins">Admins only</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Save changes
            </button>
          </form>
        </Modal>
      )}

      {showAnnouncementModal && selectedModule && (
        <Modal title={`Announcement for ${selectedModule.title}`} onClose={() => setShowAnnouncementModal(false)}>
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
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Publish announcement
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminModules

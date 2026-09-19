import { useEffect, useState } from 'react'
import api from '../api/client'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmModal from '../components/common/ConfirmModal'
import {
  DocumentTextIcon, PlusIcon, TrashIcon,
  StarIcon, CheckBadgeIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ResumesPage() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', version: '', tags: '', isDefault: false })
  const [saving, setSaving] = useState(false)

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes')
      setResumes(res.data)
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResumes() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const params = new URLSearchParams()
      params.set('name', form.name)
      if (form.description) params.set('description', form.description)
      if (form.version) params.set('version', form.version)
      if (form.tags) params.set('tags', form.tags)
      params.set('isDefault', String(form.isDefault))
      await api.post(`/resumes?${params.toString()}`)
      toast.success('Resume added')
      setShowForm(false)
      setForm({ name: '', description: '', version: '', tags: '', isDefault: false })
      fetchResumes()
    } catch {
      toast.error('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/resumes/${deleteTarget.id}`)
      toast.success('Resume deleted')
      setDeleteTarget(null)
      fetchResumes()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/resumes/${id}/default`)
      toast.success('Default resume updated')
      fetchResumes()
    } catch {
      toast.error('Failed to update')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="h-64" />

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resumes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your resume versions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusIcon className="w-4 h-4" /> Add Resume
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">New Resume</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" placeholder="e.g. Software Engineer v3"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Version</label>
              <input className="input" type="number" placeholder="3"
                value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input className="input" placeholder="Tailored for backend roles…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Tags</label>
              <input className="input" placeholder="backend, java, senior (comma-separated)"
                value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" id="isDefault" className="w-4 h-4 accent-blue-600"
                checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
              <label htmlFor="isDefault" className="text-sm text-slate-700">Set as default resume</label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate} disabled={saving}>
              <CheckIcon className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Resume'}
            </button>
          </div>
        </div>
      )}

      {/* Resume list */}
      {resumes.length === 0 ? (
        <div className="card p-12 text-center">
          <DocumentTextIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700">No resumes yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Add your resume versions to track which one you used for each application.
          </p>
          <button className="btn-primary mx-auto" onClick={() => setShowForm(true)}>
            <PlusIcon className="w-4 h-4" /> Add your first resume
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map(resume => (
            <div key={resume.id} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{resume.name}</p>
                  {resume.isDefault && (
                    <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1">
                      <StarSolid className="w-3 h-3" /> Default
                    </span>
                  )}
                  {resume.version && (
                    <span className="badge bg-slate-100 text-slate-600">v{resume.version}</span>
                  )}
                </div>
                {resume.description && <p className="text-sm text-slate-500 mt-0.5">{resume.description}</p>}
                {resume.tags && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {resume.tags.split(',').map(t => (
                      <span key={t} className="badge bg-blue-50 text-blue-600 text-xs">{t.trim()}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">Added {format(new Date(resume.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!resume.isDefault && (
                  <button
                    onClick={() => handleSetDefault(resume.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Set as default"
                  >
                    <StarIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(resume)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Resume"
        message={`Delete "${deleteTarget?.name}"? Any applications linked to this resume will lose the reference.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

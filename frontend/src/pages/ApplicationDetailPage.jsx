import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { applicationsApi } from '../api/applications'
import api from '../api/client'
import ApplicationForm from '../components/applications/ApplicationForm'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmModal from '../components/common/ConfirmModal'
import {
  ArrowLeftIcon, PencilSquareIcon, TrashIcon,
  LinkIcon, MapPinIcon, CurrencyDollarIcon,
  CalendarIcon, UserIcon, EnvelopeIcon,
  DocumentTextIcon, BuildingOfficeIcon, PlusIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const STAGE_TYPES = ['PHONE_SCREEN','TECHNICAL','BEHAVIORAL','SYSTEM_DESIGN','TAKE_HOME','PANEL','HR','FINAL','OTHER']
const STAGE_RESULTS = ['PENDING','PASSED','FAILED','CANCELLED','NO_SHOW']

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showStageForm, setShowStageForm] = useState(false)
  const [stageForm, setStageForm] = useState({ stageName: '', stageType: 'PHONE_SCREEN', result: 'PENDING', notes: '', meetingLink: '' })

  const fetchApp = async () => {
    try {
      const [appData, stagesData] = await Promise.all([
        applicationsApi.getOne(id),
        api.get(`/applications/${id}/stages`).then(r => r.data).catch(() => []),
      ])
      setApp(appData)
      setStages(stagesData)
    } catch {
      toast.error('Application not found')
      navigate('/applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApp() }, [id])

  const handleUpdate = async (data) => {
    setIsSubmitting(true)
    try {
      const updated = await applicationsApi.update(id, {
        ...data,
        resumeId: data.resumeId || null,
        salaryMin: data.salaryMin || null,
        salaryMax: data.salaryMax || null,
      })
      setApp(updated)
      setEditing(false)
      toast.success('Application updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await applicationsApi.delete(id)
      toast.success('Application deleted')
      navigate('/applications')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleAddStage = async () => {
    try {
      await api.post(`/applications/${id}/stages`, stageForm)
      toast.success('Interview stage added')
      setShowStageForm(false)
      setStageForm({ stageName: '', stageType: 'PHONE_SCREEN', result: 'PENDING', notes: '', meetingLink: '' })
      fetchApp()
    } catch {
      toast.error('Failed to add stage')
    }
  }

  const handleDeleteStage = async (stageId) => {
    try {
      await api.delete(`/applications/${id}/stages/${stageId}`)
      fetchApp()
      toast.success('Stage removed')
    } catch {
      toast.error('Failed to remove stage')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="h-64" />
  if (!app) return null

  if (editing) {
    return (
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(false)} className="btn-secondary py-1.5 px-3">
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Edit Application</h1>
        </div>
        <ApplicationForm
          defaultValues={{
            ...app,
            appliedDate: app.appliedDate?.split('T')[0],
            followUpDate: app.followUpDate?.split('T')[0],
            interviewDate: app.interviewDate?.split('T')[0],
            offerDate: app.offerDate?.split('T')[0],
          }}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  const salary = app.salaryMin || app.salaryMax
    ? `${app.currency || 'USD'} ${fmtSalary(app.salaryMin)} – ${fmtSalary(app.salaryMax)}`
    : null

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link to="/applications" className="btn-secondary py-1.5 px-3 mt-1">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{app.jobTitle}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="text-slate-500 mt-0.5">{app.companyName}{app.location ? ` · ${app.location}` : ''}{app.remote ? ' · Remote' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <PencilSquareIcon className="w-4 h-4" /> Edit
          </button>
          <button onClick={() => setShowDelete(true)} className="btn-danger">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5 space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Details</h2>
          {app.jobUrl && <DetailRow icon={LinkIcon} label="Job URL" value={<a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">View posting</a>} />}
          {salary && <DetailRow icon={CurrencyDollarIcon} label="Salary" value={salary} />}
          {app.source && <DetailRow icon={BuildingOfficeIcon} label="Source" value={app.source} />}
          {app.referral && <DetailRow icon={UserIcon} label="Referral" value={app.referral} />}
          {app.contactName && <DetailRow icon={UserIcon} label="Contact" value={app.contactName} />}
          {app.contactEmail && <DetailRow icon={EnvelopeIcon} label="Contact Email" value={app.contactEmail} />}
          {app.resumeName && <DetailRow icon={DocumentTextIcon} label="Resume" value={app.resumeName} />}
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Timeline</h2>
          {app.appliedDate && <DetailRow icon={CalendarIcon} label="Applied" value={fmt(app.appliedDate)} />}
          {app.followUpDate && <DetailRow icon={CalendarIcon} label="Follow-up" value={fmt(app.followUpDate)} />}
          {app.interviewDate && <DetailRow icon={CalendarIcon} label="Interview" value={fmt(app.interviewDate)} />}
          {app.offerDate && <DetailRow icon={CalendarIcon} label="Offer" value={fmt(app.offerDate)} />}
          <DetailRow icon={CalendarIcon} label="Added" value={fmt(app.createdAt)} />
        </div>
      </div>

      {/* Notes */}
      {app.notes && (
        <div className="card p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{app.notes}</p>
        </div>
      )}

      {/* Job Description */}
      {app.jobDescription && (
        <div className="card p-5">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Job Description</h2>
          <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-6">{app.jobDescription}</p>
        </div>
      )}

      {/* Interview Stages */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Interview Stages</h2>
          <button onClick={() => setShowStageForm(!showStageForm)} className="btn-secondary text-xs py-1 px-3">
            <PlusIcon className="w-3.5 h-3.5" /> Add Stage
          </button>
        </div>

        {showStageForm && (
          <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Stage Name</label>
                <input className="input text-sm" placeholder="e.g. First Technical Round" value={stageForm.stageName}
                  onChange={e => setStageForm(f => ({ ...f, stageName: e.target.value }))} />
              </div>
              <div>
                <label className="label text-xs">Stage Type</label>
                <select className="input text-sm" value={stageForm.stageType}
                  onChange={e => setStageForm(f => ({ ...f, stageType: e.target.value }))}>
                  {STAGE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs">Result</label>
                <select className="input text-sm" value={stageForm.result}
                  onChange={e => setStageForm(f => ({ ...f, result: e.target.value }))}>
                  {STAGE_RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-xs">Meeting Link</label>
                <input className="input text-sm" placeholder="https://meet.google.com/..." value={stageForm.meetingLink}
                  onChange={e => setStageForm(f => ({ ...f, meetingLink: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label text-xs">Notes</label>
              <textarea className="input text-sm h-20 resize-none" placeholder="Questions asked, feedback…" value={stageForm.notes}
                onChange={e => setStageForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowStageForm(false)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
              <button onClick={handleAddStage} className="btn-primary text-xs py-1.5 px-3">
                <CheckIcon className="w-3.5 h-3.5" /> Save Stage
              </button>
            </div>
          </div>
        )}

        {stages.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No interview stages recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {stages.map(stage => (
              <div key={stage.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-800">{stage.stageName}</span>
                    <span className="badge bg-slate-200 text-slate-600">{stage.stageType?.replace(/_/g, ' ')}</span>
                    <ResultBadge result={stage.result} />
                  </div>
                  {stage.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{stage.notes}</p>}
                </div>
                <button onClick={() => handleDeleteStage(stage.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded flex-shrink-0">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Application"
        message={`Delete "${app.jobTitle}" at ${app.companyName}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="text-xs text-slate-400 block">{label}</span>
        <span className="text-sm text-slate-700">{value}</span>
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  const colors = {
    PENDING: 'bg-slate-100 text-slate-500',
    PASSED: 'bg-emerald-100 text-emerald-700',
    FAILED: 'bg-red-100 text-red-600',
    CANCELLED: 'bg-orange-100 text-orange-600',
    NO_SHOW: 'bg-amber-100 text-amber-700',
  }
  return <span className={`badge ${colors[result] ?? 'bg-slate-100 text-slate-500'}`}>{result}</span>
}

function fmt(date) {
  if (!date) return '—'
  try { return format(new Date(date), 'MMM d, yyyy') } catch { return date }
}

function fmtSalary(n) {
  if (!n) return '?'
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n)
}

import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { applicationsApi } from '../api/applications'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Pagination from '../components/common/Pagination'
import ConfirmModal from '../components/common/ConfirmModal'
import {
  PlusIcon, MagnifyingGlassIcon, BuildingOfficeIcon,
  MapPinIcon, CurrencyDollarIcon, TrashIcon, PencilSquareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'PHONE_SCREEN', label: 'Phone Screen' },
  { value: 'TECHNICAL_INTERVIEW', label: 'Technical Interview' },
  { value: 'ONSITE_INTERVIEW', label: 'Onsite Interview' },
  { value: 'OFFER_RECEIVED', label: 'Offer Received' },
  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
]

export default function ApplicationsPage() {
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await applicationsApi.getAll({
        search: search || undefined,
        status: status || undefined,
        page,
        size: 12,
        sortBy: 'createdAt',
        sortDir: 'desc',
      })
      setData(res)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  // debounce search
  useEffect(() => { setPage(0) }, [search, status])

  const handleDelete = async () => {
    try {
      await applicationsApi.delete(deleteTarget.id)
      toast.success('Application deleted')
      setDeleteTarget(null)
      fetchApplications()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data.totalElements} total applications</p>
        </div>
        <Link to="/applications/new" className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search company or job title…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-52"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : data.content.length === 0 ? (
        <EmptyState search={search} status={status} />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.content.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                onDelete={() => setDeleteTarget(app)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Application"
        message={`Delete the application for ${deleteTarget?.jobTitle} at ${deleteTarget?.companyName}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function ApplicationCard({ app, onDelete }) {
  const salary = app.salaryMin || app.salaryMax
    ? `${app.currency || '$'}${formatSalary(app.salaryMin)} – ${formatSalary(app.salaryMax)}`
    : null

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0 uppercase">
            {app.companyName[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{app.companyName}</p>
            <p className="text-sm text-slate-500 truncate">{app.jobTitle}</p>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {app.location && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5" />
            {app.location}{app.remote ? ' · Remote' : ''}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <CurrencyDollarIcon className="w-3.5 h-3.5" />
            {salary}
          </span>
        )}
        {app.source && (
          <span className="flex items-center gap-1">
            <BuildingOfficeIcon className="w-3.5 h-3.5" />
            {app.source}
          </span>
        )}
      </div>

      {app.appliedDate && (
        <p className="text-xs text-slate-400">Applied {format(new Date(app.appliedDate), 'MMM d, yyyy')}</p>
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Link
          to={`/applications/${app.id}`}
          className="btn-secondary flex-1 justify-center text-xs py-1.5"
        >
          <PencilSquareIcon className="w-3.5 h-3.5" />
          View & Edit
        </Link>
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function EmptyState({ search, status }) {
  return (
    <div className="card p-12 text-center">
      <BuildingOfficeIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      {search || status ? (
        <>
          <h3 className="font-semibold text-slate-700">No results found</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter.</p>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-slate-700">No applications yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add your first job application to get started.</p>
          <Link to="/applications/new" className="btn-primary mx-auto">
            <PlusIcon className="w-4 h-4" /> Add Application
          </Link>
        </>
      )}
    </div>
  )
}

function formatSalary(n) {
  if (!n) return '?'
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n
}

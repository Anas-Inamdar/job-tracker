import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { applicationsApi } from '../../api/applications'
import api from '../../api/client'

const STATUS_OPTIONS = [
  'WISHLIST','APPLIED','PHONE_SCREEN','TECHNICAL_INTERVIEW',
  'ONSITE_INTERVIEW','OFFER_RECEIVED','OFFER_ACCEPTED',
  'OFFER_DECLINED','REJECTED','WITHDRAWN'
]

const STATUS_LABELS = {
  WISHLIST: 'Wishlist', APPLIED: 'Applied', PHONE_SCREEN: 'Phone Screen',
  TECHNICAL_INTERVIEW: 'Technical Interview', ONSITE_INTERVIEW: 'Onsite Interview',
  OFFER_RECEIVED: 'Offer Received', OFFER_ACCEPTED: 'Offer Accepted',
  OFFER_DECLINED: 'Offer Declined', REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn'
}

export default function ApplicationForm({ defaultValues, onSubmit, isSubmitting }) {
  const [resumes, setResumes] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    api.get('/resumes').then(r => setResumes(r.data)).catch(() => {})
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Job Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name *</label>
            <input className="input" placeholder="Acme Corp" {...register('companyName', { required: 'Required' })} />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
          </div>
          <div>
            <label className="label">Job Title *</label>
            <input className="input" placeholder="Software Engineer" {...register('jobTitle', { required: 'Required' })} />
            {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
          </div>
          <div>
            <label className="label">Job URL</label>
            <input className="input" type="url" placeholder="https://..." {...register('jobUrl')} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" {...register('status')}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" placeholder="New York, NY" {...register('location')} />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="remote" className="w-4 h-4 accent-blue-600" {...register('remote')} />
            <label htmlFor="remote" className="text-sm font-medium text-slate-700">Remote position</label>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Compensation</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Min Salary</label>
            <input className="input" type="number" placeholder="80000" {...register('salaryMin', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="label">Max Salary</label>
            <input className="input" type="number" placeholder="120000" {...register('salaryMax', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="label">Currency</label>
            <input className="input" placeholder="USD" {...register('currency')} />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Timeline</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'appliedDate', label: 'Applied Date' },
            { name: 'followUpDate', label: 'Follow-up Date' },
            { name: 'interviewDate', label: 'Interview Date' },
            { name: 'offerDate', label: 'Offer Date' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input type="date" className="input" {...register(name)} />
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Source */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Contact & Source</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Source</label>
            <input className="input" placeholder="LinkedIn, Referral, Company Site…" {...register('source')} />
          </div>
          <div>
            <label className="label">Referral</label>
            <input className="input" placeholder="Person who referred you" {...register('referral')} />
          </div>
          <div>
            <label className="label">Contact Name</label>
            <input className="input" placeholder="Recruiter name" {...register('contactName')} />
          </div>
          <div>
            <label className="label">Contact Email</label>
            <input type="email" className="input" placeholder="recruiter@company.com" {...register('contactEmail')} />
          </div>
        </div>
      </div>

      {/* Resume & Notes */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Details</h2>
        {resumes.length > 0 && (
          <div>
            <label className="label">Resume Used</label>
            <select className="input" {...register('resumeId', { valueAsNumber: true })}>
              <option value="">— None —</option>
              {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="label">Job Description</label>
          <textarea className="input h-28 resize-none" placeholder="Paste the job description…" {...register('jobDescription')} />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input h-24 resize-none" placeholder="Personal notes, key points, interview prep…" {...register('notes')} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-6 py-2.5" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save Application'}
        </button>
      </div>
    </form>
  )
}

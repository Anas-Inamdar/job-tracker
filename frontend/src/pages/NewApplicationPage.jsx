import { useNavigate, Link } from 'react-router-dom'
import { applicationsApi } from '../api/applications'
import ApplicationForm from '../components/applications/ApplicationForm'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function NewApplicationPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const created = await applicationsApi.create({
        ...data,
        status: data.status || 'WISHLIST',
        resumeId: data.resumeId || null,
        salaryMin: data.salaryMin || null,
        salaryMax: data.salaryMax || null,
      })
      toast.success('Application added!')
      navigate(`/applications/${created.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/applications" className="btn-secondary py-1.5 px-3">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
          <p className="text-slate-500 text-sm">Track a new job opportunity</p>
        </div>
      </div>

      <ApplicationForm
        defaultValues={{ status: 'WISHLIST', currency: 'USD' }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="btn-secondary px-2 py-1.5"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>
      <span className="text-sm text-slate-600">
        Page {page + 1} of {totalPages}
      </span>
      <button
        className="btn-secondary px-2 py-1.5"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

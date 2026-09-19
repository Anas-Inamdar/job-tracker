const STATUS_CONFIG = {
  WISHLIST:           { label: 'Wishlist',            color: 'bg-slate-100 text-slate-600' },
  APPLIED:            { label: 'Applied',             color: 'bg-blue-100 text-blue-700' },
  PHONE_SCREEN:       { label: 'Phone Screen',        color: 'bg-purple-100 text-purple-700' },
  TECHNICAL_INTERVIEW:{ label: 'Technical',           color: 'bg-indigo-100 text-indigo-700' },
  ONSITE_INTERVIEW:   { label: 'Onsite',              color: 'bg-violet-100 text-violet-700' },
  OFFER_RECEIVED:     { label: 'Offer Received',      color: 'bg-amber-100 text-amber-700' },
  OFFER_ACCEPTED:     { label: 'Offer Accepted',      color: 'bg-emerald-100 text-emerald-700' },
  OFFER_DECLINED:     { label: 'Offer Declined',      color: 'bg-orange-100 text-orange-700' },
  REJECTED:           { label: 'Rejected',            color: 'bg-red-100 text-red-600' },
  WITHDRAWN:          { label: 'Withdrawn',           color: 'bg-slate-100 text-slate-500' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`badge ${cfg.color}`}>{cfg.label}</span>
  )
}

export { STATUS_CONFIG }

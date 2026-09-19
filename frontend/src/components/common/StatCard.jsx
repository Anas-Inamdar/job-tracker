export default function StatCard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-600 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    red:   'bg-red-50 text-red-600 ring-red-100',
    purple:'bg-purple-50 text-purple-600 ring-purple-100',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

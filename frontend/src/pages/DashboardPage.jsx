import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationsApi } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/common/StatCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatusBadge from '../components/common/StatusBadge'
import {
  BriefcaseIcon, ChartBarIcon, TrophyIcon,
  XCircleIcon, ClockIcon, PlusIcon
} from '@heroicons/react/24/outline'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { format } from 'date-fns'

const PIE_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#64748b','#06b6d4','#ec4899','#84cc16','#f97316']

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      applicationsApi.getDashboard(),
      applicationsApi.getFollowUps(),
    ]).then(([s, f]) => {
      setStats(s)
      setFollowUps(f)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" className="h-64" />

  const barData = stats?.statusBreakdown
    ? Object.entries(stats.statusBreakdown).map(([key, val]) => ({
        name: key.replace(/_/g, ' '),
        count: val
      }))
    : []

  const pieData = barData.filter(d => d.count > 0)

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {getGreeting()}, {user?.firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's your job search overview</p>
        </div>
        <Link to="/applications/new" className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          Add Application
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats?.totalApplications ?? 0} icon={BriefcaseIcon} color="blue" />
        <StatCard label="In Progress" value={stats?.activeApplications ?? 0} icon={ChartBarIcon} color="purple" />
        <StatCard label="Offers Received" value={stats?.offersReceived ?? 0} icon={TrophyIcon} color="green" />
        <StatCard label="Rejections" value={stats?.rejections ?? 0} icon={XCircleIcon} color="red" />
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Response Rate', value: `${stats?.responseRate ?? 0}%`, desc: 'of applications got responses' },
          { label: 'Interview Rate', value: `${stats?.interviewRate ?? 0}%`, desc: 'of applied got interviews' },
          { label: 'Offer Rate', value: `${stats?.offerRate ?? 0}%`, desc: 'of interviews led to offers' },
        ].map(({ label, value, desc }) => (
          <div key={label} className="card p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications by Status</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Status Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      {/* Follow-ups */}
      {followUps.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-700">Pending Follow-ups ({followUps.length})</h2>
          </div>
          <div className="space-y-2">
            {followUps.slice(0, 5).map(app => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{app.companyName}</p>
                  <p className="text-xs text-slate-500">{app.jobTitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  {app.followUpDate && (
                    <span className="text-xs text-amber-600 font-medium">
                      Due {format(new Date(app.followUpDate), 'MMM d')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats?.totalApplications === 0 && (
        <div className="card p-12 text-center">
          <BriefcaseIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700">No applications yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Start tracking your job search by adding your first application.</p>
          <Link to="/applications/new" className="btn-primary mx-auto">
            <PlusIcon className="w-4 h-4" /> Add your first application
          </Link>
        </div>
      )}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
      No data yet
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

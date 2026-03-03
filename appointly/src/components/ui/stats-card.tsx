import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

export function StatsCard({ title, value, icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn(
      'bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white font-mono">{value}</p>
          {trend && (
            <p className={cn(
              'mt-1 text-xs',
              trendUp ? 'text-emerald-400' : 'text-red-400'
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-2.5 bg-slate-800/50 rounded-lg text-slate-400">
          {icon}
        </div>
      </div>
    </div>
  )
}

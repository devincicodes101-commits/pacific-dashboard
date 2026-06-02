import { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  target?: number;
  rawValue?: number;
  accent?: string; // tailwind gradient e.g. 'from-blue-500 to-blue-600'
  higherIsBetter?: boolean;
}

export default function KpiCard({
  label,
  value,
  icon,
  target,
  rawValue,
  accent = 'from-slate-500 to-slate-600',
  higherIsBetter = true,
}: KpiCardProps) {
  const hasProgress = typeof target === 'number' && typeof rawValue === 'number' && target > 0;
  const pct = hasProgress ? Math.min(Math.round((rawValue! / target) * 100), 999) : 0;

  const onTrack = higherIsBetter ? pct >= 90 : pct <= 110;
  const close = higherIsBetter ? pct >= 60 : pct <= 140;
  const barColor = onTrack ? 'bg-emerald-500' : close ? 'bg-amber-500' : 'bg-rose-500';
  const pctColor = onTrack ? 'text-emerald-600' : close ? 'text-amber-600' : 'text-rose-500';

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-sm`}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>

      {hasProgress && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Target</span>
            <span className={`font-semibold ${pctColor}`}>{pct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

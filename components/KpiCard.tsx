import { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  target?: number;
  rawValue?: number;
  accent?: string; // tailwind gradient e.g. 'from-blue-500 to-cyan-400'
  higherIsBetter?: boolean;
}

export default function KpiCard({
  label,
  value,
  icon,
  target,
  rawValue,
  accent = 'from-blue-500 to-cyan-400',
  higherIsBetter = true,
}: KpiCardProps) {
  const hasProgress = typeof target === 'number' && typeof rawValue === 'number' && target > 0;
  const pct = hasProgress ? Math.min(Math.round((rawValue! / target) * 100), 999) : 0;

  const onTrack = higherIsBetter ? pct >= 90 : pct <= 110;
  const close = higherIsBetter ? pct >= 60 : pct <= 140;
  const barColor = onTrack ? 'from-emerald-400 to-teal-400' : close ? 'from-amber-400 to-orange-400' : 'from-rose-500 to-red-500';
  const pctColor = onTrack ? 'text-emerald-400' : close ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="relative rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-white/[0.07] hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>

      {hasProgress && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Target</span>
            <span className={`font-semibold ${pctColor}`}>{pct}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

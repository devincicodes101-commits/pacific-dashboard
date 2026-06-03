import { ReactNode } from 'react';
import Sparkline from './Sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  target?: number;
  rawValue?: number;
  accent?: string;       // hex for top strip + tinted icon
  trend?: number[];      // monthly series for the sparkline
  higherIsBetter?: boolean;
}

export default function KpiCard({
  label,
  value,
  icon,
  target,
  rawValue,
  accent = '#5B8DEF',
  trend,
  higherIsBetter = true,
}: KpiCardProps) {
  const hasProgress = typeof target === 'number' && typeof rawValue === 'number' && target > 0;
  const pct = hasProgress ? Math.min(Math.round((rawValue! / target) * 100), 999) : 0;

  const onTrack = higherIsBetter ? pct >= 90 : pct <= 110;
  const close = higherIsBetter ? pct >= 60 : pct <= 140;
  const statusColor = onTrack ? '#4FB286' : close ? '#F5A623' : '#FF6B4A';

  const hasTrend = Array.isArray(trend) && trend.length > 1;

  return (
    <div className="relative overflow-hidden rounded-xl2 bg-surface border border-line shadow-card transition-shadow hover:shadow-md p-6">
      {/* Colored top accent */}
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />

      <div className="flex items-start justify-between mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}1A`, color: accent }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="text-[28px] leading-none font-bold text-ink tabular-nums">{value}</p>
        {hasProgress && (
          <span
            className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold tabular-nums leading-none"
            style={{ background: `${statusColor}1A`, color: statusColor }}
          >
            {pct}% of target
          </span>
        )}
      </div>

      {hasTrend && (
        <div className="mt-4 -mb-1">
          <Sparkline data={trend!} color={accent} height={40} />
        </div>
      )}
    </div>
  );
}

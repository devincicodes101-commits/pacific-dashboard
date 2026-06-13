import { ReactNode } from 'react';
import Sparkline from './Sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: string;        // hex for the tinted icon
  trend?: number[];       // series for the sparkline
  delta?: number | null;  // % change vs previous period
}

const IconUp = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 14 12 8 18 14" /></svg>
);
const IconDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 10 12 16 18 10" /></svg>
);

export default function KpiCard({ label, value, icon, accent = '#C8A97E', trend, delta }: KpiCardProps) {
  const hasTrend = Array.isArray(trend) && trend.length > 1;
  const hasDelta = typeof delta === 'number' && isFinite(delta);
  const up = hasDelta && delta! >= 0;
  const deltaColor = !hasDelta ? '#9CA3AF' : up ? '#7E9A7E' : '#BC8A78';

  return (
    <div className="rounded-xl2 bg-surface border border-line shadow-card transition-shadow hover:shadow-lift p-6">
      <div className="flex items-start justify-between mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}1F`, color: accent }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="text-[30px] leading-none font-semibold text-ink tabular-nums tracking-tight">{value}</p>
        {hasDelta && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold tabular-nums leading-none mb-0.5" style={{ color: deltaColor }}>
            {up ? <IconUp /> : <IconDown />}
            {Math.abs(delta!).toFixed(1)}%
          </span>
        )}
      </div>

      {hasTrend && (
        <div className="mt-5 -mb-1">
          <Sparkline data={trend!} color={accent} height={36} />
        </div>
      )}
    </div>
  );
}

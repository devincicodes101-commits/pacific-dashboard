import { ReactNode } from 'react';
import Sparkline from './Sparkline';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent?: string;    // hex for top strip + tinted icon
  trend?: number[];   // monthly series for the sparkline
}

export default function KpiCard({ label, value, icon, accent = '#5B8DEF', trend }: KpiCardProps) {
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

      <p className="text-[28px] leading-none font-bold text-ink tabular-nums">{value}</p>

      {hasTrend && (
        <div className="mt-4 -mb-1">
          <Sparkline data={trend!} color={accent} height={40} />
        </div>
      )}
    </div>
  );
}

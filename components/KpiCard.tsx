import { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  target?: number;
  rawValue?: number;
  accent?: string; // hex for tinted icon wrapper
  higherIsBetter?: boolean;
}

const SEGMENTS = 16;

export default function KpiCard({
  label,
  value,
  icon,
  target,
  rawValue,
  accent = '#5B8DEF',
  higherIsBetter = true,
}: KpiCardProps) {
  const hasProgress = typeof target === 'number' && typeof rawValue === 'number' && target > 0;
  const pct = hasProgress ? Math.min(Math.round((rawValue! / target) * 100), 999) : 0;
  const filled = hasProgress ? Math.round((Math.min(pct, 100) / 100) * SEGMENTS) : 0;

  const onTrack = higherIsBetter ? pct >= 90 : pct <= 110;
  const close = higherIsBetter ? pct >= 60 : pct <= 140;
  const statusColor = onTrack ? '#4FB286' : close ? '#F5A623' : '#FF6B4A';

  return (
    <div className="rounded-xl2 bg-surface border border-line shadow-card p-6">
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

      {hasProgress && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-ink-muted font-medium">Target</span>
            <span className="font-bold tabular-nums" style={{ color: statusColor }}>{pct}%</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: i < filled ? statusColor : '#EEF1F5' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

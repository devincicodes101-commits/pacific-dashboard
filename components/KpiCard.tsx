import { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  target?: number;
  rawValue?: number;
  accent?: string; // hex for icon + segments
  higherIsBetter?: boolean;
}

const SEGMENTS = 16;

export default function KpiCard({
  label,
  value,
  icon,
  target,
  rawValue,
  accent = '#00F2FE',
  higherIsBetter = true,
}: KpiCardProps) {
  const hasProgress = typeof target === 'number' && typeof rawValue === 'number' && target > 0;
  const pct = hasProgress ? Math.min(Math.round((rawValue! / target) * 100), 999) : 0;
  const filled = hasProgress ? Math.round((Math.min(pct, 100) / 100) * SEGMENTS) : 0;

  const onTrack = higherIsBetter ? pct >= 90 : pct <= 110;
  const close = higherIsBetter ? pct >= 60 : pct <= 140;
  const statusColor = onTrack ? '#00FF87' : close ? '#FFB020' : '#FF007F';

  return (
    <div className="rounded-xl2 bg-plum border border-plum-border p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0B071E]"
          style={{ background: accent }}
        >
          {icon}
        </div>
      </div>

      <p className="text-[26px] leading-none font-bold text-white tabular-nums">{value}</p>

      {hasProgress && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-muted">Target</span>
            <span className="font-semibold tabular-nums" style={{ color: statusColor }}>{pct}%</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: i < filled ? statusColor : '#241A47' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

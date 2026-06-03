interface RadialGaugeProps {
  label: string;
  centerValue: string;
  pct: number; // 0-100+ progress to target
  color: string; // hex
  caption?: string;
}

export default function RadialGauge({ label, centerValue, pct, color, caption }: RadialGaugeProps) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(pct, 100));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 bg-surface border border-line shadow-card p-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-5 text-center">{label}</p>
      <div className="relative">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={r} fill="none" stroke="#EEF1F5" strokeWidth="12" />
          <circle
            cx="74"
            cy="74"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 74 74)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-ink tabular-nums">{centerValue}</span>
          <span className="text-[11px] font-semibold tabular-nums" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      </div>
      {caption && <p className="text-xs text-ink-muted mt-4 text-center font-medium">{caption}</p>}
    </div>
  );
}

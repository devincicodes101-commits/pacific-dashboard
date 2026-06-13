interface RadialGaugeProps {
  label: string;
  centerValue: string;
  pct: number; // 0-100 ring fill
  color: string; // hex
  caption?: string;
}

export default function RadialGauge({ label, centerValue, pct, color, caption }: RadialGaugeProps) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(pct, 100));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 bg-surface border border-line shadow-card transition-shadow hover:shadow-lift p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-6 text-center">{label}</p>
      <div className="relative">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <circle cx="74" cy="74" r={r} fill="none" stroke="#F0EBE2" strokeWidth="11" />
          <circle
            cx="74"
            cy="74"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 74 74)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-ink tabular-nums tracking-tight">{centerValue}</span>
        </div>
      </div>
      {caption && <p className="text-xs text-ink-muted mt-5 text-center font-medium">{caption}</p>}
    </div>
  );
}

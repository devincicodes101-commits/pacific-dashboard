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
  const gradId = `g-${label.replace(/\s+/g, '')}`;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 bg-plum border border-plum-border p-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4 text-center">{label}</p>
      <div className="relative">
        <svg width="148" height="148" viewBox="0 0 148 148">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <circle cx="74" cy="74" r={r} fill="none" stroke="#241A47" strokeWidth="11" />
          <circle
            cx="74"
            cy="74"
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 74 74)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{centerValue}</span>
          <span className="text-[11px] font-medium" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      </div>
      {caption && <p className="text-xs text-muted mt-3 text-center">{caption}</p>}
    </div>
  );
}

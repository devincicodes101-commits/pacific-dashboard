interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

// Tiny, dependency-free trend line. Stretches to container width via
// preserveAspectRatio="none"; stroke stays crisp with non-scaling-stroke.
export default function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const n = data.length;
  if (!n) return null;

  const w = 100;
  const pad = 3;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const stepX = n > 1 ? w / (n - 1) : 0;

  const pts = data.map((v, i) => {
    const x = n > 1 ? i * stepX : w / 2;
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p}`).join(' ');
  const area = `${line} L${w},${height} L0,${height} Z`;
  const gradId = `sl-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" width="100%" height={height} className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

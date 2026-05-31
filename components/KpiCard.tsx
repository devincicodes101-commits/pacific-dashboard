interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: 'default' | 'green' | 'red' | 'yellow';
}

const colorMap = {
  default: 'border-slate-200',
  green: 'border-green-400',
  red: 'border-red-400',
  yellow: 'border-yellow-400',
};

export default function KpiCard({ label, value, sub, color = 'default' }: KpiCardProps) {
  return (
    <div className={`bg-white rounded-xl p-5 border-t-4 shadow-sm ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

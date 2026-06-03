interface Row {
  name: string;
  sent: number;
  converted: number;
  conversionRate: number;
  convertedDollars: number;
  avgSale: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PALETTE = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-purple-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-fuchsia-500 to-pink-400',
  'from-sky-500 to-indigo-400',
  'from-rose-500 to-red-400',
  'from-lime-500 to-green-400',
];

// Deterministic colour per name so each rep keeps the same avatar colour.
const avatarColor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export default function SalespersonTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-slate-400 text-sm">No data</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {['Salesperson', 'Sent', 'Converted', 'Conv. Rate', 'Converted $', 'Avg Sale'].map((h, i) => (
              <th
                key={h}
                className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white shadow-md ${avatarColor(r.name)}`}>
                    {initials(r.name)}
                  </div>
                  <span className="font-semibold text-slate-100">{r.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-slate-300 tabular-nums">{r.sent}</td>
              <td className="py-3 px-4 text-right text-slate-300 tabular-nums">{r.converted}</td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`font-semibold ${r.conversionRate >= 34 ? 'text-emerald-400' : r.conversionRate >= 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {r.conversionRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-slate-300 tabular-nums">{fmt(r.convertedDollars)}</td>
              <td className="py-3 px-4 text-right text-slate-300 tabular-nums">{fmt(r.avgSale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

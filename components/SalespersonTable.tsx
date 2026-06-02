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

const initials = (name: string) => name.slice(0, 2).toUpperCase();

const AVATAR_COLORS: Record<string, string> = {
  Ross: 'bg-blue-100 text-blue-700',
  Matt: 'bg-violet-100 text-violet-700',
  Cody: 'bg-amber-100 text-amber-700',
  Office: 'bg-slate-100 text-slate-600',
};

export default function SalespersonTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-slate-400 text-sm">No data</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
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
            <tr key={r.name} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${AVATAR_COLORS[r.name] || 'bg-slate-100 text-slate-600'}`}>
                    {initials(r.name)}
                  </div>
                  <span className="font-semibold text-slate-700">{r.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{r.sent}</td>
              <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{r.converted}</td>
              <td className="py-3 px-4 text-right tabular-nums">
                <span className={`font-semibold ${r.conversionRate >= 34 ? 'text-emerald-600' : r.conversionRate >= 20 ? 'text-amber-600' : 'text-rose-500'}`}>
                  {r.conversionRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{fmt(r.convertedDollars)}</td>
              <td className="py-3 px-4 text-right text-slate-600 tabular-nums">{fmt(r.avgSale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

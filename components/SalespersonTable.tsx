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

export default function SalespersonTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-slate-400 text-sm">No data</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['Salesperson', 'Quotes Sent', 'Converted', 'Conv. Rate', 'Converted $', 'Avg Sale'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4 font-semibold text-slate-700">{r.name}</td>
              <td className="py-3 px-4 text-slate-600">{r.sent}</td>
              <td className="py-3 px-4 text-slate-600">{r.converted}</td>
              <td className="py-3 px-4">
                <span className={`font-semibold ${r.conversionRate >= 34 ? 'text-green-600' : r.conversionRate >= 20 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {r.conversionRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4 text-slate-600">{fmt(r.convertedDollars)}</td>
              <td className="py-3 px-4 text-slate-600">{fmt(r.avgSale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

const PALETTE = ['#00F2FE', '#FF007F', '#00FF87', '#7551ff', '#FFB020', '#3b82f6', '#f472b6', '#22d3ee'];
const avatarColor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export default function SalespersonTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-muted text-sm">No data</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-plum-border">
            {['Salesperson', 'Sent', 'Converted', 'Conv. Rate', 'Converted $', 'Avg Sale'].map((h, i) => (
              <th
                key={h}
                className={`py-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-plum-border/50 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-[#0B071E] shrink-0"
                    style={{ background: avatarColor(r.name) }}
                  >
                    {initials(r.name)}
                  </div>
                  <span className="font-medium text-white whitespace-nowrap">{r.name}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-right text-muted tabular-nums">{r.sent}</td>
              <td className="py-3 px-3 text-right text-muted tabular-nums">{r.converted}</td>
              <td className="py-3 px-3 text-right tabular-nums">
                <span
                  className="font-semibold"
                  style={{ color: r.conversionRate >= 34 ? '#00FF87' : r.conversionRate >= 20 ? '#FFB020' : '#FF007F' }}
                >
                  {r.conversionRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-3 text-right text-muted tabular-nums">{fmt(r.convertedDollars)}</td>
              <td className="py-3 px-3 text-right text-muted tabular-nums">{fmt(r.avgSale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

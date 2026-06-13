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

// Restrained, desaturated palette — gold + muted tones (no brightness).
const PALETTE = ['#C8A97E', '#8A8F98', '#7E9A7E', '#9A8F86', '#A88A6E', '#8F8AA0', '#9CA88F', '#B58E7C'];
const avatarColor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export default function SalespersonTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-ink-muted text-sm">No data</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            {['Salesperson', 'Sent', 'Converted', 'Conv. Rate', 'Converted $', 'Avg Sale'].map((h, i) => (
              <th
                key={h}
                className={`py-4 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted ${i === 0 ? 'text-left' : 'text-right'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const c = avatarColor(r.name);
            return (
              <tr key={r.name} className="border-b border-line/70 hover:bg-canvas transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ background: `${c}24`, color: c }}
                    >
                      {initials(r.name)}
                    </div>
                    <span className="font-medium text-ink whitespace-nowrap">{r.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-ink-soft tabular-nums">{r.sent}</td>
                <td className="py-4 px-4 text-right text-ink-soft tabular-nums">{r.converted}</td>
                <td className="py-4 px-4 text-right tabular-nums">
                  <span
                    className="font-semibold"
                    style={{ color: r.conversionRate >= 34 ? '#7E9A7E' : r.conversionRate >= 20 ? '#C8A97E' : '#BC8A78' }}
                  >
                    {r.conversionRate.toFixed(1)}%
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-ink-soft tabular-nums">{fmt(r.convertedDollars)}</td>
                <td className="py-4 px-4 text-right text-ink-soft tabular-nums">{fmt(r.avgSale)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

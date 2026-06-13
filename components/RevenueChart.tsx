'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

interface Point {
  month: string;
  revenue: number;
  converted: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

// Renders an emphasized dot only on the currently-selected period; invisible elsewhere.
function makeActiveDot(color: string, active: string) {
  const Dot = (props: { cx?: number; cy?: number; index?: number; payload?: Point }) => {
    const { cx, cy, index, payload } = props;
    if (cx == null || cy == null || !payload || payload.month !== active) {
      return <circle key={index} cx={cx} cy={cy} r={0} fill="none" />;
    }
    return (
      <g key={index}>
        <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.16} />
        <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="#fff" strokeWidth={2} />
      </g>
    );
  };
  return Dot;
}

export default function RevenueChart({ data, activePeriod }: { data: Point[]; activePeriod?: string }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A97E" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#C8A97E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A8F98" stopOpacity={0.14} />
            <stop offset="100%" stopColor="#8A8F98" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#EFEAE1" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={6} />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => fmt(v)}
          contentStyle={{ borderRadius: 12, border: '1px solid #ECE7DF', background: '#FFFFFF', color: '#2D2D2D', fontSize: 13, boxShadow: '0 6px 24px rgba(45,45,45,0.08)' }}
          labelStyle={{ color: '#9CA3AF', fontWeight: 600 }}
          cursor={{ stroke: '#E3DDD2' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#6B7280', paddingTop: 8 }} iconType="circle" />
        {activePeriod ? <ReferenceLine x={activePeriod} stroke="#DDD5C8" strokeDasharray="4 4" /> : null}
        <Area type="monotone" dataKey="revenue" name="Payments Collected" stroke="#C8A97E" strokeWidth={2.5} fill="url(#rev)" dot={makeActiveDot('#C8A97E', activePeriod || '')} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="converted" name="Quotes Converted $" stroke="#8A8F98" strokeWidth={2.5} fill="url(#conv)" dot={makeActiveDot('#8A8F98', activePeriod || '')} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

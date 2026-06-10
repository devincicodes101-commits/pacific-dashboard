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
            <stop offset="0%" stopColor="#5B8DEF" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#5B8DEF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B4A" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#FF6B4A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#EEF1F5" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} dy={6} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => fmt(v)}
          contentStyle={{ borderRadius: 12, border: '1px solid #E8ECF1', background: '#FFFFFF', color: '#1E293B', fontSize: 13, boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}
          labelStyle={{ color: '#94A3B8', fontWeight: 600 }}
          cursor={{ stroke: '#E2E8F0' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#64748B', paddingTop: 8 }} iconType="circle" />
        {activePeriod ? <ReferenceLine x={activePeriod} stroke="#CBD5E1" strokeDasharray="4 4" /> : null}
        <Area type="monotone" dataKey="revenue" name="Payments Collected" stroke="#5B8DEF" strokeWidth={2.5} fill="url(#rev)" dot={makeActiveDot('#5B8DEF', activePeriod || '')} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="converted" name="Quotes Converted $" stroke="#FF6B4A" strokeWidth={2.5} fill="url(#conv)" dot={makeActiveDot('#FF6B4A', activePeriod || '')} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Point {
  month: string;
  revenue: number;
  converted: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#21d4fd" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#21d4fd" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7551ff" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#7551ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8b95b5' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#8b95b5' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => fmt(v)}
          contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0f1535', color: '#fff', fontSize: 13 }}
          labelStyle={{ color: '#a0aec0' }}
        />
        <Area type="monotone" dataKey="revenue" name="Revenue Produced" stroke="#21d4fd" strokeWidth={2.5} fill="url(#rev)" />
        <Area type="monotone" dataKey="converted" name="Quotes Converted $" stroke="#7551ff" strokeWidth={2.5} fill="url(#conv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

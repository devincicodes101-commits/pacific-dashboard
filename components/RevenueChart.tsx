'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Point {
  month: string;
  revenue: number;
  converted: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#00F2FE" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF007F" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#FF007F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#241A47" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B86B8' }} axisLine={false} tickLine={false} dy={6} />
        <YAxis
          tick={{ fontSize: 11, fill: '#8B86B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => fmt(v)}
          contentStyle={{ borderRadius: 12, border: '1px solid #2A2150', background: '#160E33', color: '#fff', fontSize: 13 }}
          labelStyle={{ color: '#8B86B8' }}
          cursor={{ stroke: '#2A2150' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8B86B8', paddingTop: 8 }} iconType="circle" />
        <Area type="monotone" dataKey="revenue" name="Revenue Produced" stroke="#00F2FE" strokeWidth={2.5} fill="url(#rev)" />
        <Area type="monotone" dataKey="converted" name="Quotes Converted $" stroke="#FF007F" strokeWidth={2.5} fill="url(#conv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

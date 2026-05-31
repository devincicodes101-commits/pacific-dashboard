'use client';

import { useEffect, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import SalespersonTable from '@/components/SalespersonTable';

const PERIODS = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
];

function getPeriodDates(period: string): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === 'this_month') {
    return {
      from: new Date(y, m, 1).toISOString().slice(0, 10),
      to: new Date(y, m + 1, 0).toISOString().slice(0, 10),
    };
  }
  if (period === 'last_month') {
    return {
      from: new Date(y, m - 1, 1).toISOString().slice(0, 10),
      to: new Date(y, m, 0).toISOString().slice(0, 10),
    };
  }
  if (period === 'this_year') {
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  if (period === 'last_year') {
    return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31` };
  }
  return { from: `${y}-01-01`, to: new Date().toISOString().slice(0, 10) };
}

interface KpiData {
  newLeads: number;
  newRequests: number;
  quotesSent: number;
  quotesConverted: number;
  conversionRate: number;
  convertedDollars: number;
  avgSale: number;
  bySalesperson: {
    name: string;
    sent: number;
    converted: number;
    conversionRate: number;
    convertedDollars: number;
    avgSale: number;
  }[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const [period, setPeriod] = useState('this_month');
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const { from, to } = getPeriodDates(period);
    setLoading(true);
    setError('');
    fetch(`/api/kpis?from=${from}&to=${to}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pacific Heat Pumps</h1>
          <p className="text-xs text-slate-400 mt-0.5">Sales & Marketing Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-400">Updated {lastUpdated}</span>
          )}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  period === p.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
        ) : data ? (
          <>
            {/* Row 1 — Lead & Request KPIs */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Marketing</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="New Leads" value={String(data.newLeads)} />
                <KpiCard label="New Requests" value={String(data.newRequests)} />
                <KpiCard label="Quotes Sent" value={String(data.quotesSent)} />
                <KpiCard label="Quotes Converted" value={String(data.quotesConverted)} />
              </div>
            </section>

            {/* Row 2 — Sales KPIs */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Sales</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard
                  label="Quote Conversion Rate"
                  value={`${data.conversionRate}%`}
                  color={data.conversionRate >= 34 ? 'green' : data.conversionRate >= 20 ? 'yellow' : 'red'}
                />
                <KpiCard
                  label="Quotes Converted $"
                  value={fmt(data.convertedDollars)}
                  color="green"
                />
                <KpiCard
                  label="Average Sale Value"
                  value={fmt(data.avgSale)}
                />
              </div>
            </section>

            {/* Salesperson Breakdown */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4">By Salesperson</h2>
              <SalespersonTable rows={data.bySalesperson} />
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

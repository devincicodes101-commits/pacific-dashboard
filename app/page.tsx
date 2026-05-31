'use client';

import { useEffect, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import SalespersonTable from '@/components/SalespersonTable';

interface DashboardData {
  months: string[];
  revenueProduced: Record<string, number>;
  cashCollected: Record<string, number>;
  newLeads: Record<string, number>;
  newRequests: Record<string, number>;
  quotesSent: { total: Record<string, number>; byPerson: Record<string, Record<string, number>> };
  quotesConverted: { total: Record<string, number>; byPerson: Record<string, Record<string, number>> };
  conversionRate: { total: Record<string, number>; byPerson: Record<string, Record<string, number>> };
  convertedDollars: { total: Record<string, number>; byPerson: Record<string, Record<string, number>> };
  avgSale: { total: Record<string, number>; byPerson: Record<string, Record<string, number>> };
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat('en-CA').format(n);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    fetch('/api/kpis')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.months?.length) setMonth(d.months[d.months.length - 1]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const salespeople = ['Ross', 'Matt', 'Cody', 'Office'];

  const tableRows = data ? salespeople.map(sp => ({
    name: sp,
    sent: data.quotesSent.byPerson[sp]?.[month] ?? 0,
    converted: data.quotesConverted.byPerson[sp]?.[month] ?? 0,
    conversionRate: data.conversionRate.byPerson[sp]?.[month] ?? 0,
    convertedDollars: data.convertedDollars.byPerson[sp]?.[month] ?? 0,
    avgSale: data.avgSale.byPerson[sp]?.[month] ?? 0,
  })) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pacific Heat Pumps</h1>
          <p className="text-xs text-slate-400 mt-0.5">Sales & Marketing Dashboard</p>
        </div>
        {data?.months?.length ? (
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {data.months.map(m => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  month === m ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
        ) : data && month ? (
          <>
            {/* Revenue & Cash */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Finance</h2>
              <div className="grid grid-cols-2 gap-4">
                <KpiCard label="Revenue Produced" value={fmtCurrency(data.revenueProduced[month] ?? 0)} color="green" />
                <KpiCard label="Cash Collected" value={fmtCurrency(data.cashCollected[month] ?? 0)} color="green" />
              </div>
            </section>

            {/* Marketing */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Marketing</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard label="New Leads" value={fmtNum(data.newLeads[month] ?? 0)} />
                <KpiCard label="New Requests" value={fmtNum(data.newRequests[month] ?? 0)} />
                <KpiCard label="Quotes Sent" value={fmtNum(data.quotesSent.total[month] ?? 0)} />
                <KpiCard label="Quotes Converted" value={fmtNum(data.quotesConverted.total[month] ?? 0)} />
              </div>
            </section>

            {/* Sales */}
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Sales</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard
                  label="Quote Conversion Rate"
                  value={`${(data.conversionRate.total[month] ?? 0).toFixed(1)}%`}
                  color={(data.conversionRate.total[month] ?? 0) >= 34 ? 'green' : (data.conversionRate.total[month] ?? 0) >= 20 ? 'yellow' : 'red'}
                />
                <KpiCard label="Quotes Converted $" value={fmtCurrency(data.convertedDollars.total[month] ?? 0)} color="green" />
                <KpiCard label="Average Sale Value" value={fmtCurrency(data.avgSale.total[month] ?? 0)} />
              </div>
            </section>

            {/* Monthly Trend */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-6">Revenue Trend</h2>
              <div className="flex items-end gap-3 h-32">
                {data.months.map(m => {
                  const max = Math.max(...data.months.map(x => data.revenueProduced[x] ?? 0), 1);
                  const h = Math.round(((data.revenueProduced[m] ?? 0) / max) * 100);
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-400">{fmtCurrency(data.revenueProduced[m] ?? 0)}</span>
                      <div
                        className={`w-full rounded-t-md transition-all ${m === month ? 'bg-blue-600' : 'bg-blue-200'}`}
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-xs font-medium text-slate-500">{m}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Salesperson Table */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-700 mb-4">By Salesperson — {month}</h2>
              <SalespersonTable rows={tableRows} />
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

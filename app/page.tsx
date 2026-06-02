'use client';

import { useEffect, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import SalespersonTable from '@/components/SalespersonTable';
import RevenueChart from '@/components/RevenueChart';
import { supabase } from '@/lib/supabase';
import { TARGETS } from '@/lib/targets';
import {
  IconRevenue, IconCash, IconLeads, IconRequests,
  IconSent, IconConverted, IconRate, IconDollars, IconAvg,
} from '@/components/icons';

interface MonthMap { [m: string]: number }
interface Grouped { total: MonthMap; byPerson: Record<string, MonthMap> }

interface DashboardData {
  months: string[];
  revenueProduced: MonthMap;
  cashCollected: MonthMap;
  newLeads: MonthMap;
  newRequests: MonthMap;
  quotesSent: Grouped;
  quotesConverted: Grouped;
  conversionRate: Grouped;
  convertedDollars: Grouped;
  avgSale: Grouped;
  _source?: string;
  _syncedAt?: string;
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-CA').format(Math.round(n));

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [live, setLive] = useState(false);

  const loadKpis = () => {
    fetch('/api/kpis')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.months?.length) setMonth((prev) => prev || d.months[d.months.length - 1]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadKpis();

    // Polling fallback — keeps data fresh even if realtime isn't configured.
    const poll = setInterval(loadKpis, 60000);

    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | undefined;
    if (supabase) {
      channel = supabase
        .channel('kpi_snapshots')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'kpi_snapshots' }, () => loadKpis())
        .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    }

    return () => {
      clearInterval(poll);
      if (channel) supabase?.removeChannel(channel);
    };
  }, []);

  const salespeople = ['Ross', 'Matt', 'Cody', 'Office'];
  const v = (m: MonthMap | undefined) => (m && month ? m[month] ?? 0 : 0);

  const tableRows = data
    ? salespeople.map((sp) => ({
        name: sp,
        sent: data.quotesSent.byPerson[sp]?.[month] ?? 0,
        converted: data.quotesConverted.byPerson[sp]?.[month] ?? 0,
        conversionRate: data.conversionRate.byPerson[sp]?.[month] ?? 0,
        convertedDollars: data.convertedDollars.byPerson[sp]?.[month] ?? 0,
        avgSale: data.avgSale.byPerson[sp]?.[month] ?? 0,
      }))
    : [];

  const chartData = data
    ? data.months.map((m) => ({
        month: m,
        revenue: data.revenueProduced[m] ?? 0,
        converted: data.convertedDollars.total[m] ?? 0,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Pacific Heat Pumps</h1>
              <p className="text-xs text-slate-400">Sales &amp; Marketing Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              {live ? 'Live' : 'Auto-refresh'}
            </div>
            {data?.months?.length ? (
              <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
                {data.months.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonth(m)}
                    className={`px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      month === m ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
        ) : data && month ? (
          <>
            {/* Finance */}
            <SectionLabel>Finance</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <KpiCard label="Revenue Produced" value={fmtCurrency(v(data.revenueProduced))} rawValue={v(data.revenueProduced)} target={TARGETS.revenueProduced} icon={<IconRevenue />} accent="from-emerald-500 to-emerald-600" />
              <KpiCard label="Cash Collected" value={fmtCurrency(v(data.cashCollected))} rawValue={v(data.cashCollected)} target={TARGETS.cashCollected} icon={<IconCash />} accent="from-teal-500 to-teal-600" />
            </div>

            {/* Marketing */}
            <SectionLabel>Marketing</SectionLabel>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <KpiCard label="New Leads" value={fmtNum(v(data.newLeads))} rawValue={v(data.newLeads)} target={TARGETS.newLeads} icon={<IconLeads />} accent="from-blue-500 to-blue-600" />
              <KpiCard label="New Requests" value={fmtNum(v(data.newRequests))} rawValue={v(data.newRequests)} target={TARGETS.newRequests} icon={<IconRequests />} accent="from-indigo-500 to-indigo-600" />
              <KpiCard label="Quotes Sent" value={fmtNum(v(data.quotesSent.total))} rawValue={v(data.quotesSent.total)} target={TARGETS.quotesSent} icon={<IconSent />} accent="from-sky-500 to-sky-600" />
              <KpiCard label="Quotes Converted" value={fmtNum(v(data.quotesConverted.total))} rawValue={v(data.quotesConverted.total)} target={TARGETS.quotesConverted} icon={<IconConverted />} accent="from-cyan-500 to-cyan-600" />
            </div>

            {/* Sales */}
            <SectionLabel>Sales</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <KpiCard label="Conversion Rate" value={`${v(data.conversionRate.total).toFixed(1)}%`} rawValue={v(data.conversionRate.total)} target={TARGETS.conversionRate} icon={<IconRate />} accent="from-violet-500 to-violet-600" />
              <KpiCard label="Quotes Converted $" value={fmtCurrency(v(data.convertedDollars.total))} rawValue={v(data.convertedDollars.total)} target={TARGETS.convertedDollars} icon={<IconDollars />} accent="from-fuchsia-500 to-fuchsia-600" />
              <KpiCard label="Average Sale Value" value={fmtCurrency(v(data.avgSale.total))} rawValue={v(data.avgSale.total)} target={TARGETS.avgSale} icon={<IconAvg />} accent="from-purple-500 to-purple-600" />
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">Revenue Trend</h2>
                <RevenueChart data={chartData} />
              </div>
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-sm font-bold text-slate-700 mb-4">By Salesperson — {month}</h2>
                <SalespersonTable rows={tableRows} />
              </div>
            </div>

            <p className="text-center text-xs text-slate-300 mt-8">
              {data._source === 'supabase'
                ? `Synced from Jobber + QuickBooks${data._syncedAt ? ` · ${new Date(data._syncedAt).toLocaleString()}` : ''}`
                : 'Source: KPI sheet (awaiting live sync)'}
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{children}</h2>;
}

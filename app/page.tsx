'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import KpiCard from '@/components/KpiCard';
import RadialGauge from '@/components/RadialGauge';
import SalespersonTable from '@/components/SalespersonTable';
import RevenueChart from '@/components/RevenueChart';
import { supabase } from '@/lib/supabase';
import {
  IconRevenue, IconLeads, IconRequests,
  IconSent, IconConverted,
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
const fmtCompact = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${Math.round(n)}`);

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

  const v = (m: MonthMap | undefined) => (m && month ? m[month] ?? 0 : 0);

  const tableRows = data
    ? Object.keys(data.quotesSent.byPerson)
        .map((sp) => ({
          name: sp,
          sent: data.quotesSent.byPerson[sp]?.[month] ?? 0,
          converted: data.quotesConverted.byPerson[sp]?.[month] ?? 0,
          conversionRate: data.conversionRate.byPerson[sp]?.[month] ?? 0,
          convertedDollars: data.convertedDollars.byPerson[sp]?.[month] ?? 0,
          avgSale: data.avgSale.byPerson[sp]?.[month] ?? 0,
        }))
        .filter((r) => r.sent > 0 || r.converted > 0 || r.convertedDollars > 0)
        .sort((a, b) => b.sent - a.sent || b.convertedDollars - a.convertedDollars)
    : [];

  const chartData = data
    ? data.months.map((m) => ({ month: m, revenue: data.revenueProduced[m] ?? 0, converted: data.convertedDollars.total[m] ?? 0 }))
    : [];

  const series = (m: MonthMap) => (data ? data.months.map((mm) => m[mm] ?? 0) : []);

  // Ring fill for the $ gauges: this month relative to the year's peak month (no external target).
  const peakPct = (m: MonthMap) => {
    if (!data) return 0;
    const max = Math.max(...data.months.map((mm) => m[mm] ?? 0), 1);
    return ((m[month] ?? 0) / max) * 100;
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar months={data?.months ?? []} month={month} setMonth={setMonth} live={live} />

        <main className="px-6 lg:px-8 py-8 max-w-[1500px] mx-auto">
          {error && (
            <div className="mb-6 bg-coral-soft border border-coral/30 text-coral-dark rounded-xl2 px-4 py-3 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-ink-muted">Loading…</div>
          ) : data && month ? (
            <div className="space-y-8">
              {/* Finance */}
              <section>
                <SectionLabel>Finance</SectionLabel>
                <div className="grid grid-cols-1">
                  <KpiCard label="Payments Collected" value={fmtCurrency(v(data.revenueProduced))} icon={<IconRevenue />} accent="#4FB286" trend={series(data.revenueProduced)} />
                </div>
              </section>

              {/* Marketing */}
              <section>
                <SectionLabel>Marketing</SectionLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <KpiCard label="New Leads" value={fmtNum(v(data.newLeads))} icon={<IconLeads />} accent="#5B8DEF" trend={series(data.newLeads)} />
                  <KpiCard label="New Requests" value={fmtNum(v(data.newRequests))} icon={<IconRequests />} accent="#8B7FD6" trend={series(data.newRequests)} />
                  <KpiCard label="Quotes Sent" value={fmtNum(v(data.quotesSent.total))} icon={<IconSent />} accent="#F5A623" trend={series(data.quotesSent.total)} />
                  <KpiCard label="Quotes Converted" value={fmtNum(v(data.quotesConverted.total))} icon={<IconConverted />} accent="#4FB286" trend={series(data.quotesConverted.total)} />
                </div>
              </section>

              {/* Sales — radial gauges */}
              <section id="analytics" className="scroll-mt-24">
                <SectionLabel>Sales Performance</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <RadialGauge
                    label="Conversion Rate"
                    centerValue={`${v(data.conversionRate.total).toFixed(1)}%`}
                    pct={Math.min(v(data.conversionRate.total), 100)}
                    color="#5B8DEF"
                  />
                  <RadialGauge
                    label="Quotes Converted $"
                    centerValue={fmtCompact(v(data.convertedDollars.total))}
                    pct={peakPct(data.convertedDollars.total)}
                    color="#FF6B4A"
                  />
                  <RadialGauge
                    label="Average Sale Value"
                    centerValue={fmtCompact(v(data.avgSale.total))}
                    pct={peakPct(data.avgSale.total)}
                    color="#4FB286"
                  />
                </div>
              </section>

              {/* Revenue trend — full width */}
              <section id="trend" className="rounded-xl2 bg-surface border border-line shadow-card p-6 scroll-mt-24">
                <h2 className="text-sm font-bold text-ink mb-5">Revenue Trend</h2>
                <RevenueChart data={chartData} />
              </section>

              {/* By Salesperson — its own full-width box, no horizontal scroll */}
              <section id="salespeople" className="rounded-xl2 bg-surface border border-line shadow-card p-6 scroll-mt-24">
                <h2 className="text-sm font-bold text-ink mb-5">By Salesperson — {month}</h2>
                <SalespersonTable rows={tableRows} />
              </section>

              <p className="text-center text-xs text-ink-muted pt-2">
                {data._source === 'jobber'
                  ? `Synced from Jobber + QuickBooks${data._syncedAt ? ` · ${new Date(data._syncedAt).toLocaleString()}` : ''}`
                  : 'Awaiting first sync from Jobber…'}
              </p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-1 h-3.5 rounded-full bg-coral" />
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-ink-soft">{children}</h2>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import KpiCard from '@/components/KpiCard';
import RadialGauge from '@/components/RadialGauge';
import SalespersonTable from '@/components/SalespersonTable';
import RevenueChart from '@/components/RevenueChart';
import { supabase } from '@/lib/supabase';
import { TARGETS } from '@/lib/targets';
import {
  IconRevenue, IconCash, IconLeads, IconRequests,
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
const pctOf = (val: number, target: number) => (target > 0 ? Math.min((val / target) * 100, 100) : 0);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <KpiCard label="Revenue Produced" value={fmtCurrency(v(data.revenueProduced))} rawValue={v(data.revenueProduced)} target={TARGETS.revenueProduced} icon={<IconRevenue />} accent="#4FB286" />
                  <KpiCard label="Cash Collected" value={fmtCurrency(v(data.cashCollected))} rawValue={v(data.cashCollected)} target={TARGETS.cashCollected} icon={<IconCash />} accent="#5B8DEF" />
                </div>
              </section>

              {/* Marketing */}
              <section>
                <SectionLabel>Marketing</SectionLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <KpiCard label="New Leads" value={fmtNum(v(data.newLeads))} rawValue={v(data.newLeads)} target={TARGETS.newLeads} icon={<IconLeads />} accent="#5B8DEF" />
                  <KpiCard label="New Requests" value={fmtNum(v(data.newRequests))} rawValue={v(data.newRequests)} target={TARGETS.newRequests} icon={<IconRequests />} accent="#8B7FD6" />
                  <KpiCard label="Quotes Sent" value={fmtNum(v(data.quotesSent.total))} rawValue={v(data.quotesSent.total)} target={TARGETS.quotesSent} icon={<IconSent />} accent="#F5A623" />
                  <KpiCard label="Quotes Converted" value={fmtNum(v(data.quotesConverted.total))} rawValue={v(data.quotesConverted.total)} target={TARGETS.quotesConverted} icon={<IconConverted />} accent="#4FB286" />
                </div>
              </section>

              {/* Sales — radial gauges */}
              <section id="analytics" className="scroll-mt-24">
                <SectionLabel>Sales Performance</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <RadialGauge
                    label="Conversion Rate"
                    centerValue={`${v(data.conversionRate.total).toFixed(1)}%`}
                    pct={pctOf(v(data.conversionRate.total), TARGETS.conversionRate)}
                    color="#5B8DEF"
                    caption={`Target ${TARGETS.conversionRate}%`}
                  />
                  <RadialGauge
                    label="Quotes Converted $"
                    centerValue={fmtCompact(v(data.convertedDollars.total))}
                    pct={pctOf(v(data.convertedDollars.total), TARGETS.convertedDollars)}
                    color="#FF6B4A"
                    caption={`Target ${fmtCompact(TARGETS.convertedDollars)}`}
                  />
                  <RadialGauge
                    label="Average Sale Value"
                    centerValue={fmtCompact(v(data.avgSale.total))}
                    pct={pctOf(v(data.avgSale.total), TARGETS.avgSale)}
                    color="#4FB286"
                    caption={`Target ${fmtCompact(TARGETS.avgSale)}`}
                  />
                </div>
              </section>

              {/* Chart + table */}
              <section id="trend" className="grid grid-cols-1 xl:grid-cols-5 gap-5 scroll-mt-24">
                <div className="xl:col-span-3 rounded-xl2 bg-surface border border-line shadow-card p-6">
                  <h2 className="text-sm font-bold text-ink mb-5">Revenue Trend</h2>
                  <RevenueChart data={chartData} />
                </div>
                <div id="salespeople" className="xl:col-span-2 rounded-xl2 bg-surface border border-line shadow-card p-6 scroll-mt-24">
                  <h2 className="text-sm font-bold text-ink mb-5">By Salesperson — {month}</h2>
                  <SalespersonTable rows={tableRows} />
                </div>
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
  return <h2 className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-4">{children}</h2>;
}

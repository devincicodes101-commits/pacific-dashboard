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

interface ViewBlock {
  revenueProduced: MonthMap;
  cashCollected: MonthMap;
  newLeads: MonthMap;
  newRequests: MonthMap;
  quotesSent: Grouped;
  quotesConverted: Grouped;
  conversionRate: Grouped;
  convertedDollars: Grouped;
  avgSale: Grouped;
}

interface DashboardData extends ViewBlock {
  months: string[];
  weeks?: string[];
  weekly?: ViewBlock;
  _source?: string;
  _syncedAt?: string;
}

type Mode = 'month' | 'week';

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-CA').format(Math.round(n));
const fmtCompact = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${Math.round(n)}`);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('month');
  const [period, setPeriod] = useState('');
  const [live, setLive] = useState(false);

  const loadKpis = () => {
    fetch('/api/kpis')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.months?.length) setPeriod((prev) => prev || d.months[d.months.length - 1]);
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

  // Which period labels + metric block are active for the chosen mode.
  const periods: string[] = (mode === 'week' ? data?.weeks : data?.months) ?? [];
  const view: ViewBlock | null = data ? (mode === 'week' && data.weekly ? data.weekly : data) : null;
  const weekAvailable = !!data?.weeks?.length && !!data?.weekly;

  const changeMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    const ps = (m === 'week' ? data?.weeks : data?.months) ?? [];
    setPeriod(ps[ps.length - 1] ?? '');
  };

  const v = (m: MonthMap | undefined) => (m && period ? m[period] ?? 0 : 0);
  const series = (m: MonthMap | undefined) => (m ? periods.map((p) => m[p] ?? 0) : []);
  const peakPct = (m: MonthMap | undefined) => {
    if (!m || !periods.length) return 0;
    const max = Math.max(...periods.map((p) => m[p] ?? 0), 1);
    return ((m[period] ?? 0) / max) * 100;
  };

  const tableRows = view
    ? Object.keys(view.quotesSent.byPerson)
        .map((sp) => ({
          name: sp,
          sent: view.quotesSent.byPerson[sp]?.[period] ?? 0,
          converted: view.quotesConverted.byPerson[sp]?.[period] ?? 0,
          conversionRate: view.conversionRate.byPerson[sp]?.[period] ?? 0,
          convertedDollars: view.convertedDollars.byPerson[sp]?.[period] ?? 0,
          avgSale: view.avgSale.byPerson[sp]?.[period] ?? 0,
        }))
        .filter((r) => r.sent > 0 || r.converted > 0 || r.convertedDollars > 0)
        .sort((a, b) => b.sent - a.sent || b.convertedDollars - a.convertedDollars)
    : [];

  const chartData = view
    ? periods.map((p) => ({ month: p, revenue: view.revenueProduced[p] ?? 0, converted: view.convertedDollars.total[p] ?? 0 }))
    : [];

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar
          mode={mode}
          setMode={changeMode}
          weekAvailable={weekAvailable}
          periods={periods}
          period={period}
          setPeriod={setPeriod}
          live={live}
        />

        <main className="px-6 lg:px-8 py-8 max-w-[1500px] mx-auto">
          {error && (
            <div className="mb-6 bg-coral-soft border border-coral/30 text-coral-dark rounded-xl2 px-4 py-3 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-ink-muted">Loading…</div>
          ) : view && period ? (
            <div className="space-y-8">
              {/* Finance */}
              <section>
                <SectionLabel>Finance</SectionLabel>
                <div className="grid grid-cols-1">
                  <KpiCard label="Payments Collected" value={fmtCurrency(v(view.revenueProduced))} icon={<IconRevenue />} accent="#4FB286" trend={series(view.revenueProduced)} />
                </div>
              </section>

              {/* Marketing */}
              <section>
                <SectionLabel>Marketing</SectionLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <KpiCard label="New Leads" value={fmtNum(v(view.newLeads))} icon={<IconLeads />} accent="#5B8DEF" trend={series(view.newLeads)} />
                  <KpiCard label="New Requests" value={fmtNum(v(view.newRequests))} icon={<IconRequests />} accent="#8B7FD6" trend={series(view.newRequests)} />
                  <KpiCard label="Quotes Sent" value={fmtNum(v(view.quotesSent.total))} icon={<IconSent />} accent="#F5A623" trend={series(view.quotesSent.total)} />
                  <KpiCard label="Quotes Converted" value={fmtNum(v(view.quotesConverted.total))} icon={<IconConverted />} accent="#4FB286" trend={series(view.quotesConverted.total)} />
                </div>
              </section>

              {/* Sales — radial gauges */}
              <section id="analytics" className="scroll-mt-24">
                <SectionLabel>Sales Performance</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <RadialGauge
                    label="Conversion Rate"
                    centerValue={`${v(view.conversionRate.total).toFixed(1)}%`}
                    pct={Math.min(v(view.conversionRate.total), 100)}
                    color="#5B8DEF"
                  />
                  <RadialGauge
                    label="Quotes Converted $"
                    centerValue={fmtCompact(v(view.convertedDollars.total))}
                    pct={peakPct(view.convertedDollars.total)}
                    color="#FF6B4A"
                  />
                  <RadialGauge
                    label="Average Sale Value"
                    centerValue={fmtCompact(v(view.avgSale.total))}
                    pct={peakPct(view.avgSale.total)}
                    color="#4FB286"
                  />
                </div>
              </section>

              {/* Trend — full width */}
              <section id="trend" className="rounded-xl2 bg-surface border border-line shadow-card p-6 scroll-mt-24">
                <h2 className="text-sm font-bold text-ink mb-5">{mode === 'week' ? 'Weekly Trend' : 'Revenue Trend'}</h2>
                <RevenueChart data={chartData} activePeriod={period} />
              </section>

              {/* By Salesperson — its own full-width box */}
              <section id="salespeople" className="rounded-xl2 bg-surface border border-line shadow-card p-6 scroll-mt-24">
                <h2 className="text-sm font-bold text-ink mb-5">By Salesperson — {period}</h2>
                <SalespersonTable rows={tableRows} />
              </section>

              <p className="text-center text-xs text-ink-muted pt-2">
                {data?._source === 'jobber'
                  ? `Synced from Jobber${data._syncedAt ? ` · ${new Date(data._syncedAt).toLocaleString()}` : ''}`
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

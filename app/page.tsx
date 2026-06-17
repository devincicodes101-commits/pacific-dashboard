'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import KpiCard from '@/components/KpiCard';
import RadialGauge from '@/components/RadialGauge';
import SalespersonTable from '@/components/SalespersonTable';
import RevenueChart from '@/components/RevenueChart';
import DepartmentCard from '@/components/DepartmentCard';
import { supabase } from '@/lib/supabase';
import {
  IconRevenue, IconLeads, IconRequests,
  IconSent, IconConverted,
} from '@/components/icons';

interface MonthMap { [m: string]: number }
interface Grouped { total: MonthMap; byPerson: Record<string, MonthMap> }
interface DeptMetrics { revenue: MonthMap; jobsCompleted: MonthMap; avgTicket: MonthMap }

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
  departments?: {
    installations?: DeptMetrics;
    service?: DeptMetrics;
    maintenance?: DeptMetrics;
  };
}

interface DashboardData extends ViewBlock {
  months: string[];
  weeks?: string[];
  weekly?: ViewBlock;
  currentMonth?: string;
  currentWeek?: string;
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
    fetch('/api/kpis', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.months?.length) setPeriod((prev) => prev || d.currentMonth || d.months[d.months.length - 1]);
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

  // Full period list shown in the header (e.g. all 12 months), and the
  // "to-date" slice that actually has content (chart/sparklines stop there).
  const periods: string[] = (mode === 'week' ? data?.weeks : data?.months) ?? [];
  const view: ViewBlock | null = data ? (mode === 'week' && data.weekly ? data.weekly : data) : null;
  const weekAvailable = !!data?.weeks?.length && !!data?.weekly;

  const currentPeriod = (mode === 'week' ? data?.currentWeek : data?.currentMonth) ?? (periods.length ? periods[periods.length - 1] : '');
  const cutoff = periods.indexOf(currentPeriod);
  const dataPeriods = cutoff >= 0 ? periods.slice(0, cutoff + 1) : periods;

  const changeMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    const ps = (m === 'week' ? data?.weeks : data?.months) ?? [];
    const cur = (m === 'week' ? data?.currentWeek : data?.currentMonth);
    setPeriod(cur && ps.includes(cur) ? cur : (ps[ps.length - 1] ?? ''));
  };

  const v = (m: MonthMap | undefined) => (m && period ? m[period] ?? 0 : 0);
  const series = (m: MonthMap | undefined) => (m ? dataPeriods.map((p) => m[p] ?? 0) : []);
  const peakPct = (m: MonthMap | undefined) => {
    if (!m || !dataPeriods.length) return 0;
    const max = Math.max(...dataPeriods.map((p) => m[p] ?? 0), 1);
    return ((m[period] ?? 0) / max) * 100;
  };
  // % change vs the previous period (for the trend chip on KPI cards).
  const deltaPct = (m: MonthMap | undefined) => {
    if (!m) return null;
    const i = dataPeriods.indexOf(period);
    if (i <= 0) return null;
    const cur = m[period] ?? 0;
    const prev = m[dataPeriods[i - 1]] ?? 0;
    if (!prev) return null;
    return Math.round(((cur - prev) / prev) * 1000) / 10;
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
    ? dataPeriods.map((p) => ({ month: p, revenue: view.revenueProduced[p] ?? 0, converted: view.convertedDollars.total[p] ?? 0 }))
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
          activeCount={dataPeriods.length}
          period={period}
          setPeriod={setPeriod}
          live={live}
        />

        <main className="px-8 lg:px-10 py-9 max-w-[1500px] mx-auto">
          {error && (
            <div className="mb-6 bg-gold-soft border border-gold/30 text-ink rounded-xl2 px-4 py-3 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64 text-ink-muted">Loading…</div>
          ) : view && period ? (
            <div className="space-y-10">
              {/* Finance */}
              <section>
                <SectionLabel>Finance</SectionLabel>
                <div className="grid grid-cols-1">
                  <KpiCard label="Payments Collected" value={fmtCurrency(v(view.revenueProduced))} icon={<IconRevenue />} accent="#C8A97E" trend={series(view.revenueProduced)} delta={deltaPct(view.revenueProduced)} />
                </div>
              </section>

              {/* Marketing */}
              <section>
                <SectionLabel>Marketing</SectionLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <KpiCard label="New Leads" value={fmtNum(v(view.newLeads))} icon={<IconLeads />} accent="#8A8F98" trend={series(view.newLeads)} delta={deltaPct(view.newLeads)} />
                  <KpiCard label="New Requests" value={fmtNum(v(view.newRequests))} icon={<IconRequests />} accent="#9A8F86" trend={series(view.newRequests)} delta={deltaPct(view.newRequests)} />
                  <KpiCard label="Quotes Sent" value={fmtNum(v(view.quotesSent.total))} icon={<IconSent />} accent="#C8A97E" trend={series(view.quotesSent.total)} delta={deltaPct(view.quotesSent.total)} />
                  <KpiCard label="Quotes Converted" value={fmtNum(v(view.quotesConverted.total))} icon={<IconConverted />} accent="#7E9A7E" trend={series(view.quotesConverted.total)} delta={deltaPct(view.quotesConverted.total)} />
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
                    color="#C8A97E"
                  />
                  <RadialGauge
                    label="Quotes Converted $"
                    centerValue={fmtCompact(v(view.convertedDollars.total))}
                    pct={peakPct(view.convertedDollars.total)}
                    color="#8A8F98"
                  />
                  <RadialGauge
                    label="Average Sale Value"
                    centerValue={fmtCompact(v(view.avgSale.total))}
                    pct={peakPct(view.avgSale.total)}
                    color="#7E9A7E"
                  />
                </div>
              </section>

              {/* Departments — Installations / Service from one-off jobs (job-type custom field) */}
              <section id="departments" className="scroll-mt-24">
                <SectionLabel>Departments</SectionLabel>
                <p className="text-xs text-ink-muted -mt-3 mb-4">Live from Jobber — updates automatically as jobs are completed.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <DepartmentCard
                    name="HVAC Installations"
                    icon={<IconInstall />}
                    accent="#C8A97E"
                    revenue={v(view.departments?.installations?.revenue)}
                    jobs={v(view.departments?.installations?.jobsCompleted)}
                    avgTicket={v(view.departments?.installations?.avgTicket)}
                    note="Per spec: jobs created from Jun 16 onward & tagged with Type of Job — counted when completed (no backfill)."
                  />
                  <DepartmentCard
                    name="HVAC Service"
                    icon={<IconService />}
                    accent="#8A8F98"
                    revenue={v(view.departments?.service?.revenue)}
                    jobs={v(view.departments?.service?.jobsCompleted)}
                    avgTicket={v(view.departments?.service?.avgTicket)}
                    note="Per spec: jobs created from Jun 16 onward & tagged with Type of Job — counted when completed (no backfill)."
                  />
                  <DepartmentCard
                    name="HVAC Maintenance"
                    icon={<IconMaintenance />}
                    accent="#7E9A7E"
                    revenue={v(view.departments?.maintenance?.revenue)}
                    jobs={v(view.departments?.maintenance?.jobsCompleted)}
                    avgTicket={v(view.departments?.maintenance?.avgTicket)}
                  />
                </div>
              </section>

              {/* Trend — full width */}
              <section id="trend" className="rounded-xl2 bg-surface border border-line shadow-card p-7 scroll-mt-24">
                <h2 className="text-[15px] font-semibold text-ink tracking-tight mb-5">{mode === 'week' ? 'Weekly Trend' : 'Revenue Trend'}</h2>
                <RevenueChart data={chartData} activePeriod={period} />
              </section>

              {/* By Salesperson — its own full-width box */}
              <section id="salespeople" className="rounded-xl2 bg-surface border border-line shadow-card p-7 scroll-mt-24">
                <h2 className="text-[15px] font-semibold text-ink tracking-tight mb-5">By Salesperson — {period}</h2>
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

const deptIconBase = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const IconInstall = () => (<svg {...deptIconBase}><path d="M3 9.5 12 4l9 5.5" /><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /><path d="M9 20v-6h6v6" /></svg>);
const IconService = () => (<svg {...deptIconBase}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 2.4-2.4Z" /></svg>);
const IconMaintenance = () => (<svg {...deptIconBase}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v4h-4" /></svg>);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-1 h-3.5 rounded-full bg-gold" />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{children}</h2>
    </div>
  );
}

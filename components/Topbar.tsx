'use client';

type Mode = 'month' | 'week';

interface TopbarProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  weekAvailable: boolean;
  periods: string[];
  activeCount: number; // how many leading periods have data (rest are future, greyed)
  period: string;
  setPeriod: (p: string) => void;
  live: boolean;
}

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function Topbar({ mode, setMode, weekAvailable, periods, activeCount, period, setPeriod, live }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-line">
      <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-ink-muted">Dashboard / Overview</p>
          <h1 className="text-lg font-bold text-ink leading-tight">Sales &amp; Marketing</h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* Month / Week toggle */}
          <div className="flex rounded-xl border border-line bg-canvas p-0.5 gap-0.5">
            <button
              onClick={() => setMode('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${mode === 'month' ? 'bg-ink text-white shadow-soft' : 'text-ink-soft hover:text-ink'}`}
            >
              Month
            </button>
            <button
              onClick={() => weekAvailable && setMode('week')}
              disabled={!weekAvailable}
              title={weekAvailable ? '' : 'Re-run the sync to enable weekly'}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                mode === 'week' ? 'bg-ink text-white shadow-soft' : weekAvailable ? 'text-ink-soft hover:text-ink' : 'text-ink-muted/50 cursor-not-allowed'
              }`}
            >
              Week
            </button>
          </div>

          {/* Period selector — segmented for months, dropdown for weeks */}
          {periods.length ? (
            mode === 'week' ? (
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm font-medium text-ink focus:outline-none focus:border-gold/40 cursor-pointer"
              >
                {periods.map((p, i) => (
                  <option key={p} value={p} disabled={i >= activeCount}>Week of {p}{i >= activeCount ? ' —' : ''}</option>
                ))}
              </select>
            ) : (
              <div className="hidden md:flex rounded-xl border border-line bg-canvas p-0.5 gap-0.5">
                {periods.map((p, i) => {
                  const disabled = i >= activeCount;
                  return (
                    <button
                      key={p}
                      onClick={() => !disabled && setPeriod(p)}
                      disabled={disabled}
                      className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        period === p ? 'bg-gold text-white shadow-soft' : disabled ? 'text-ink-muted/40 cursor-not-allowed' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )
          ) : null}

          {/* Search */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-ink-muted w-44 focus-within:border-gold/40 transition-colors">
            <IconSearch />
            <input
              placeholder="Search…"
              className="bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none w-full"
            />
          </div>

          {/* Live status */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft px-1">
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-gold' : 'bg-ink-muted'}`} />
            <span className="hidden sm:inline">{live ? 'Live' : 'Auto'}</span>
          </div>

          {/* Bell */}
          <button className="relative w-9 h-9 rounded-xl border border-line bg-canvas flex items-center justify-center text-ink-soft hover:text-ink transition-colors">
            <IconBell />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold" />
          </button>

          {/* Profile */}
          <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-white text-sm font-bold">
            PH
          </div>
        </div>
      </div>
    </header>
  );
}

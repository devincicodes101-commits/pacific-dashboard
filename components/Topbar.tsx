'use client';

interface TopbarProps {
  months: string[];
  month: string;
  setMonth: (m: string) => void;
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
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Topbar({ months, month, setMonth, live }: TopbarProps) {
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
          {/* Month selector */}
          {months.length ? (
            <div className="hidden md:flex rounded-xl border border-line bg-canvas p-0.5 gap-0.5">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    month === m ? 'bg-coral text-white shadow-soft' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : null}

          {/* Search */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-ink-muted w-52 focus-within:border-coral/40 transition-colors">
            <IconSearch />
            <input
              placeholder="Search…"
              className="bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none w-full"
            />
          </div>

          {/* Language selector */}
          <button className="hidden sm:flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
            <span>EN</span>
            <span className="text-ink-muted"><IconChevron /></span>
          </button>

          {/* Live status */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft px-1">
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-tint-sage' : 'bg-ink-muted'}`} />
            <span className="hidden sm:inline">{live ? 'Live' : 'Auto'}</span>
          </div>

          {/* Bell */}
          <button className="relative w-9 h-9 rounded-xl border border-line bg-canvas flex items-center justify-center text-ink-soft hover:text-ink transition-colors">
            <IconBell />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-coral" />
          </button>

          {/* Profile */}
          <div className="w-9 h-9 rounded-xl bg-coral flex items-center justify-center text-white text-sm font-bold">
            PH
          </div>
        </div>
      </div>
    </header>
  );
}

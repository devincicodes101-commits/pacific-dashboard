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

export default function Topbar({ months, month, setMonth, live }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-midnight/80 backdrop-blur-md border-b border-plum-border">
      <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted">Dashboard / Overview</p>
          <h1 className="text-lg font-semibold text-white leading-tight">Sales &amp; Marketing</h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* Month selector */}
          {months.length ? (
            <div className="hidden md:flex rounded-xl border border-plum-border bg-plum-light/50 overflow-hidden">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    month === m ? 'bg-neon-cyan text-[#0B071E]' : 'text-muted hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : null}

          {/* Search */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-plum-border bg-plum-light/50 px-3 py-2 text-muted w-52">
            <IconSearch />
            <input
              placeholder="Search…"
              className="bg-transparent text-sm text-white placeholder:text-muted/70 focus:outline-none w-full"
            />
          </div>

          {/* Live + icons */}
          <div className="flex items-center gap-1.5 text-xs text-muted px-2">
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-neon-green' : 'bg-muted/50'}`} />
            <span className="hidden sm:inline">{live ? 'Live' : 'Auto'}</span>
          </div>
          <button className="w-9 h-9 rounded-xl border border-plum-border bg-plum-light/50 flex items-center justify-center text-muted hover:text-white transition-colors">
            <IconBell />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-magenta to-[#7551ff] flex items-center justify-center text-white text-sm font-semibold">
            PH
          </div>
        </div>
      </div>
    </header>
  );
}

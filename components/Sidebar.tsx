'use client';

import { useState } from 'react';

const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const IconGrid = () => (<svg {...base}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
const IconChart = () => (<svg {...base}><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>);
const IconUsers = () => (<svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>);
const IconDoc = () => (<svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconGrid />, target: 'top' },
  { key: 'analytics', label: 'Analytics', icon: <IconChart />, target: 'analytics' },
  { key: 'salespeople', label: 'Salespeople', icon: <IconUsers />, target: 'salespeople' },
  { key: 'reports', label: 'Reports', icon: <IconDoc />, target: 'trend' },
];

const SOURCES = ['Jobber Sync', 'QuickBooks Sync'];

export default function Sidebar() {
  const [active, setActive] = useState('dashboard');

  const go = (key: string, target: string) => {
    setActive(key);
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-surface border-r border-line px-5 py-7">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-white font-bold text-sm">
          P
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink tracking-tight">Pacific</p>
          <p className="text-[11px] text-ink-muted">Heat Pumps</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key, item.target)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? 'bg-gold-soft text-ink font-semibold' : 'text-ink-soft hover:text-ink hover:bg-canvas font-medium'
              }`}
            >
              <span className={isActive ? 'text-gold' : 'text-ink-muted'}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Data sources */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted mt-10 mb-3 px-3">Data Sources</p>
      <ul className="flex flex-col gap-1">
        {SOURCES.map((s) => (
          <li key={s} className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-soft cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {s}
          </li>
        ))}
      </ul>

      {/* Footer status */}
      <div className="mt-auto rounded-xl2 border border-line bg-canvas p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-50 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <p className="text-xs text-ink font-semibold">Live sync active</p>
        </div>
        <p className="text-[11px] text-ink-muted leading-snug">Data refreshes automatically from Jobber &amp; QuickBooks.</p>
      </div>
    </aside>
  );
}

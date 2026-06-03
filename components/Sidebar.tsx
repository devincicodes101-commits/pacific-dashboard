'use client';

import { useState } from 'react';

const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const IconGrid = () => (<svg {...base}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
const IconChart = () => (<svg {...base}><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>);
const IconUsers = () => (<svg {...base}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>);
const IconDoc = () => (<svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
const IconCog = () => (<svg {...base}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconGrid /> },
  { key: 'analytics', label: 'Analytics', icon: <IconChart /> },
  { key: 'salespeople', label: 'Salespeople', icon: <IconUsers /> },
  { key: 'reports', label: 'Reports', icon: <IconDoc /> },
  { key: 'settings', label: 'Settings', icon: <IconCog /> },
];

const PROJECTS = ['Jobber Sync', 'QuickBooks Sync'];

export default function Sidebar() {
  const [active, setActive] = useState('dashboard');

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-plum/40 border-r border-plum-border px-5 py-6">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-[#3b82f6] flex items-center justify-center text-[#0B071E] font-extrabold text-sm">
          P
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Pacific</p>
          <p className="text-[11px] text-muted">Heat Pumps</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive ? 'bg-plum-light text-white border border-plum-border' : 'text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span className={isActive ? 'text-neon-cyan' : ''}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Secondary list */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted/70 mt-8 mb-3 px-3">Data Sources</p>
      <ul className="flex flex-col gap-1">
        {PROJECTS.map((p) => (
          <li key={p} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted hover:text-white transition-colors cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            {p}
          </li>
        ))}
      </ul>

      {/* Footer status */}
      <div className="mt-auto rounded-xl border border-plum-border bg-plum-light/50 p-4">
        <p className="text-xs text-white font-medium mb-1">Live sync active</p>
        <p className="text-[11px] text-muted leading-snug">Data refreshes automatically from Jobber &amp; QuickBooks.</p>
      </div>
    </aside>
  );
}

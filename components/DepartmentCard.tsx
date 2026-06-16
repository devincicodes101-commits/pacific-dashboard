import { ReactNode } from 'react';

interface DepartmentCardProps {
  name: string;
  icon?: ReactNode;
  revenue: number;
  jobs: number;
  avgTicket: number;
  accent?: string;
  pending?: boolean;     // not yet wired (e.g. Maintenance)
  pendingNote?: string;
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat('en-CA').format(Math.round(n));

function Row({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-ink-soft">{label}</span>
      <span className={`text-[15px] font-semibold tabular-nums ${dim ? 'text-ink-muted' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

export default function DepartmentCard({ name, icon, revenue, jobs, avgTicket, accent = '#C8A97E', pending, pendingNote }: DepartmentCardProps) {
  return (
    <div className="rounded-xl2 bg-surface border border-line shadow-card transition-shadow hover:shadow-lift p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-ink tracking-tight">{name}</h3>
        {pending ? (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted bg-canvas border border-line rounded-full px-2 py-1">
            {pendingNote || 'Coming soon'}
          </span>
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}1F`, color: accent }}>
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-3.5">
        <Row label="Revenue" value={pending ? '—' : fmtCurrency(revenue)} dim={pending} />
        <Row label="Jobs Completed" value={pending ? '—' : fmtNum(jobs)} dim={pending} />
        <Row label="Avg Ticket" value={pending ? '—' : fmtCurrency(avgTicket)} dim={pending} />
      </div>
    </div>
  );
}

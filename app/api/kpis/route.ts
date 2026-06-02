import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 0;

// Empty shape returned before the first Jobber sync lands.
const EMPTY = {
  months: [] as string[],
  revenueProduced: {}, cashCollected: {}, newLeads: {}, newRequests: {},
  quotesSent: { total: {}, byPerson: {} },
  quotesConverted: { total: {}, byPerson: {} },
  conversionRate: { total: {}, byPerson: {} },
  convertedDollars: { total: {}, byPerson: {} },
  avgSale: { total: {}, byPerson: {} },
};

export async function GET() {
  try {
    // Data comes ONLY from Jobber/QuickBooks via n8n → Supabase. No spreadsheet.
    if (!supabaseAdmin) return NextResponse.json({ ...EMPTY, _source: 'none' });

    const { data: rows } = await supabaseAdmin
      .from('kpi_snapshots')
      .select('data, created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (rows && rows.length > 0) {
      return NextResponse.json({ ...rows[0].data, _source: 'jobber', _syncedAt: rows[0].created_at });
    }

    return NextResponse.json({ ...EMPTY, _source: 'none' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

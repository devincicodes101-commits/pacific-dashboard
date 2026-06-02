import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getDashboardData } from '@/lib/sheets';

export const revalidate = 0;

export async function GET() {
  try {
    // Try Supabase first — latest snapshot from n8n
    if (supabaseAdmin) {
      const { data: rows } = await supabaseAdmin
        .from('kpi_snapshots')
        .select('data, created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (rows && rows.length > 0) {
        return NextResponse.json({ ...rows[0].data, _source: 'supabase', _syncedAt: rows[0].created_at });
      }
    }

    // Fallback — read from Google Sheets until n8n is connected
    const data = await getDashboardData();
    return NextResponse.json({ ...data, _source: 'sheets' });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

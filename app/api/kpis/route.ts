import { NextRequest, NextResponse } from 'next/server';
import { getQuotes, getRequests, getClients } from '@/lib/sheets';

export const revalidate = 3600; // cache 1 hour

function inRange(dateStr: string, from: string, to: string) {
  const d = dateStr.slice(0, 10);
  return d >= from && d <= to;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const from = searchParams.get('from') || '2025-01-01';
  const to = searchParams.get('to') || new Date().toISOString().slice(0, 10);

  try {
    const [quotes, requests, clients] = await Promise.all([
      getQuotes(),
      getRequests(),
      getClients(),
    ]);

    const filteredQuotes = quotes.filter(q => inRange(q.createdAt, from, to));
    const filteredRequests = requests.filter(r => inRange(r.createdAt, from, to));
    const filteredClients = clients.filter(c => inRange(c.createdAt, from, to));

    const SENT_STATUSES = ['SENT', 'AWAITING_RESPONSE', 'APPROVED', 'CONVERTED', 'DRAFT'];
    const CONVERTED_STATUSES = ['APPROVED', 'CONVERTED'];

    const sent = filteredQuotes.filter(q => SENT_STATUSES.includes(q.status));
    const converted = filteredQuotes.filter(q => CONVERTED_STATUSES.includes(q.status));

    const conversionRate = sent.length > 0 ? (converted.length / sent.length) * 100 : 0;
    const convertedDollars = converted.reduce((sum, q) => sum + parseFloat(q.total || '0'), 0);
    const avgSale = converted.length > 0 ? convertedDollars / converted.length : 0;

    // by salesperson
    const salespeople = [...new Set(filteredQuotes.map(q => q.salesperson).filter(Boolean))];
    const bySalesperson = salespeople.map(sp => {
      const spSent = sent.filter(q => q.salesperson === sp);
      const spConverted = converted.filter(q => q.salesperson === sp);
      const spDollars = spConverted.reduce((s, q) => s + parseFloat(q.total || '0'), 0);
      return {
        name: sp,
        sent: spSent.length,
        converted: spConverted.length,
        conversionRate: spSent.length > 0 ? (spConverted.length / spSent.length) * 100 : 0,
        convertedDollars: spDollars,
        avgSale: spConverted.length > 0 ? spDollars / spConverted.length : 0,
      };
    });

    return NextResponse.json({
      period: { from, to },
      newLeads: filteredClients.length,
      newRequests: filteredRequests.length,
      quotesSent: sent.length,
      quotesConverted: converted.length,
      conversionRate: Math.round(conversionRate * 10) / 10,
      convertedDollars,
      avgSale,
      bySalesperson,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

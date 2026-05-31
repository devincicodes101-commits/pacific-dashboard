import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/sheets';

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

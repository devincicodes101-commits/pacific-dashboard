import { google } from 'googleapis';

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

async function readTab(tab: string): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID!,
      range: `${tab}!A1:Z10000`,
    });
    return (res.data.values || []) as string[][];
  } catch {
    // Tab doesn't exist yet — sync hasn't run
    return [];
  }
}

function parseRows<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj as T;
  });
}

export interface RawQuote {
  id: string;
  quoteNumber: string;
  status: string;
  createdAt: string;
  total: string;
  clientName: string;
  salesperson: string;
}

export interface RawRequest {
  id: string;
  createdAt: string;
  clientName: string;
}

export interface RawClient {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export async function getQuotes(): Promise<RawQuote[]> {
  return parseRows<RawQuote>(await readTab('raw_quotes'));
}

export async function getRequests(): Promise<RawRequest[]> {
  return parseRows<RawRequest>(await readTab('raw_requests'));
}

export async function getClients(): Promise<RawClient[]> {
  return parseRows<RawClient>(await readTab('raw_clients'));
}

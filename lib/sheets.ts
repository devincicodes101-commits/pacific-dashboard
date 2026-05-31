import { google } from 'googleapis';

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

export async function getSheetRows(): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID!,
      range: 'Sheet1!A1:AJ200',
    });
    return (res.data.values || []) as string[][];
  } catch {
    return [];
  }
}

function parseNum(val: string | undefined): number {
  if (!val) return 0;
  const n = parseFloat(val.replace(/[$,%\s]/g, '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

// Find column indices for monthly totals from the header row
function findMonthCols(headerRow: string[]): Record<string, number> {
  const patterns: [string, RegExp][] = [
    ['Jan', /total\s*jan/i],
    ['Feb', /total\s*feb/i],
    ['Mar', /total\s*mar/i],
    ['Apr', /total\s*apr/i],
    ['May', /total\s*may/i],
    ['Jun', /total\s*jun/i],
  ];
  const cols: Record<string, number> = {};
  headerRow.forEach((cell, i) => {
    for (const [key, pattern] of patterns) {
      if (pattern.test(cell)) cols[key] = i;
    }
  });
  return cols;
}

function findRow(rows: string[][], name: string): string[] | undefined {
  return rows.find(r => (r[0] || '').toLowerCase().includes(name.toLowerCase()));
}

function extractMonths(row: string[] | undefined, monthCols: Record<string, number>): Record<string, number> {
  if (!row) return {};
  const result: Record<string, number> = {};
  for (const [month, col] of Object.entries(monthCols)) {
    result[month] = parseNum(row[col]);
  }
  return result;
}

export interface DashboardData {
  months: string[];
  revenueProduced: Record<string, number>;
  cashCollected: Record<string, number>;
  newLeads: Record<string, number>;
  newRequests: Record<string, number>;
  quotesSent: {
    total: Record<string, number>;
    byPerson: Record<string, Record<string, number>>;
  };
  quotesConverted: {
    total: Record<string, number>;
    byPerson: Record<string, Record<string, number>>;
  };
  conversionRate: {
    total: Record<string, number>;
    byPerson: Record<string, Record<string, number>>;
  };
  convertedDollars: {
    total: Record<string, number>;
    byPerson: Record<string, Record<string, number>>;
  };
  avgSale: {
    total: Record<string, number>;
    byPerson: Record<string, Record<string, number>>;
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const rows = await getSheetRows();
  if (rows.length < 2) return emptyData();

  // Header row is row index 1 (second row)
  const headerRow = rows[1] || [];
  const monthCols = findMonthCols(headerRow);
  const months = Object.keys(monthCols);

  const salespeople = ['Ross', 'Matt', 'Cody', 'Office'];

  function byPerson(prefix: string) {
    const result: Record<string, Record<string, number>> = {};
    for (const sp of salespeople) {
      const row = findRow(rows, `${prefix} ${sp}`);
      result[sp] = extractMonths(row, monthCols);
    }
    return result;
  }

  return {
    months,
    revenueProduced: extractMonths(findRow(rows, 'Revenue Produced'), monthCols),
    cashCollected: extractMonths(findRow(rows, 'Cash Collected'), monthCols),
    newLeads: extractMonths(findRow(rows, 'New leads'), monthCols),
    newRequests: extractMonths(findRow(rows, 'New Requests'), monthCols),
    quotesSent: {
      total: extractMonths(findRow(rows, 'Total Quotes Sent'), monthCols),
      byPerson: byPerson('Quotes Sent'),
    },
    quotesConverted: {
      total: extractMonths(findRow(rows, 'Total Quotes Converted'), monthCols),
      byPerson: byPerson('Quotes Converted'),
    },
    conversionRate: {
      total: extractMonths(findRow(rows, 'Total Quote Conversion Rate'), monthCols),
      byPerson: {
        Ross: extractMonths(findRow(rows, 'Quote Conversion Rate Ross'), monthCols),
        Matt: extractMonths(findRow(rows, 'Quote Conversion Rate Matt'), monthCols),
        Cody: extractMonths(findRow(rows, 'Quote Conversion Rate Cody'), monthCols),
        Office: extractMonths(findRow(rows, 'Quote Conversion Rate Office'), monthCols),
      },
    },
    convertedDollars: {
      total: extractMonths(findRow(rows, 'Total Quotes Converted Dollars'), monthCols),
      byPerson: byPerson('Quotes Converted Dollars'),
    },
    avgSale: {
      total: extractMonths(findRow(rows, 'Average Sale Total'), monthCols),
      byPerson: byPerson('Average Sale'),
    },
  };
}

function emptyData(): DashboardData {
  const empty = { total: {}, byPerson: {} };
  return {
    months: [],
    revenueProduced: {}, cashCollected: {}, newLeads: {}, newRequests: {},
    quotesSent: empty, quotesConverted: empty, conversionRate: empty,
    convertedDollars: empty, avgSale: empty,
  };
}

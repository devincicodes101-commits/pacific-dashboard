import 'dotenv/config';
import { google } from 'googleapis';

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
}

async function clearAndWrite(spreadsheetId, sheetName, rows) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${sheetName}!A1:Z10000`
  });

  if (rows.length === 0) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows }
  });

  console.log(`[sheets] wrote ${rows.length - 1} rows to ${sheetName}`);
}

export async function writeQuotes(quotes) {
  const header = ['ID', 'Quote #', 'Status', 'Created At', 'Total', 'Client', 'Salesperson'];
  const rows = [header, ...quotes.map(q => [
    q.id,
    q.quoteNumber,
    q.status,
    q.createdAt,
    q.amounts?.total ?? '',
    q.client?.name ?? '',
    q.assignedTo?.name ?? ''
  ])];
  await clearAndWrite(process.env.SPREADSHEET_ID, 'quotes', rows);
}

export async function writeRequests(requests) {
  const header = ['ID', 'Created At', 'Client'];
  const rows = [header, ...requests.map(r => [
    r.id,
    r.createdAt,
    r.client?.name ?? ''
  ])];
  await clearAndWrite(process.env.SPREADSHEET_ID, 'requests', rows);
}

export async function writeClients(clients) {
  const header = ['ID', 'First Name', 'Last Name', 'Created At'];
  const rows = [header, ...clients.map(c => [
    c.id,
    c.firstName,
    c.lastName,
    c.createdAt
  ])];
  await clearAndWrite(process.env.SPREADSHEET_ID, 'clients', rows);
}

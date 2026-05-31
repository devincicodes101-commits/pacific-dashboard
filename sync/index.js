import { fetchQuotes, fetchRequests, fetchClients } from './jobber.js';
import { writeQuotes, writeRequests, writeClients } from './sheets.js';

async function run() {
  console.log('[sync] starting at', new Date().toISOString());

  console.log('[sync] fetching Jobber quotes...');
  const quotes = await fetchQuotes();
  console.log(`[sync] got ${quotes.length} quotes`);

  console.log('[sync] fetching Jobber requests...');
  const requests = await fetchRequests();
  console.log(`[sync] got ${requests.length} requests`);

  console.log('[sync] fetching Jobber clients...');
  const clients = await fetchClients();
  console.log(`[sync] got ${clients.length} clients`);

  console.log('[sync] writing to Google Sheets...');
  await writeQuotes(quotes);
  await writeRequests(requests);
  await writeClients(clients);

  console.log('[sync] done at', new Date().toISOString());
}

run().catch(err => {
  console.error('[sync] fatal error:', err.message);
  process.exit(1);
});

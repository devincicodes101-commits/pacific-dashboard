import 'dotenv/config';

const GQL_URL = 'https://api.getjobber.com/api/graphql';
const GQL_VERSION = '2026-03-10';

async function refreshJobberToken() {
  const res = await fetch('https://api.getjobber.com/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.JOBBER_CLIENT_ID,
      client_secret: process.env.JOBBER_CLIENT_SECRET,
      refresh_token: process.env.JOBBER_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  process.env.JOBBER_ACCESS_TOKEN = data.access_token;
  if (data.refresh_token) process.env.JOBBER_REFRESH_TOKEN = data.refresh_token;
  return data.access_token;
}

async function gql(query, variables = {}, retry = false) {
  const token = process.env.JOBBER_ACCESS_TOKEN;
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-JOBBER-GRAPHQL-VERSION': GQL_VERSION
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (!retry && json.message === 'Access token expired') {
    await refreshJobberToken();
    return gql(query, variables, true);
  }
  return json;
}

async function paginate(query, getPage) {
  const results = [];
  let cursor = null;
  do {
    const res = await gql(query, cursor ? { cursor } : {});
    const page = getPage(res);
    results.push(...(page.nodes || []));
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return results;
}

// ── Fetch all quotes ──
export async function fetchQuotes() {
  const query = `
    query Quotes($cursor: String) {
      quotes(first: 100, after: $cursor) {
        nodes {
          id
          quoteNumber
          status
          createdAt
          amounts { total }
          client { id name }
          assignedTo { id name }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
  return paginate(query, r => r.data.quotes);
}

// ── Fetch all requests ──
export async function fetchRequests() {
  const query = `
    query Requests($cursor: String) {
      requests(first: 100, after: $cursor) {
        nodes {
          id
          createdAt
          client { id name }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
  return paginate(query, r => r.data.requests);
}

// ── Fetch all clients (leads) ──
export async function fetchClients() {
  const query = `
    query Clients($cursor: String) {
      clients(first: 100, after: $cursor) {
        nodes {
          id
          firstName
          lastName
          createdAt
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
  return paginate(query, r => r.data.clients);
}

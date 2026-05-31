import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = 3333;

app.get('/connect', (req, res) => {
  const url = new URL('https://api.getjobber.com/api/oauth/authorize');
  url.searchParams.set('client_id', process.env.JOBBER_CLIENT_ID);
  url.searchParams.set('redirect_uri', `http://localhost:${PORT}/callback`);
  url.searchParams.set('response_type', 'code');
  res.redirect(url.toString());
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send('No code received');

  const tokenRes = await fetch('https://api.getjobber.com/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.JOBBER_CLIENT_ID,
      client_secret: process.env.JOBBER_CLIENT_SECRET,
      code,
      redirect_uri: `http://localhost:${PORT}/callback`,
      grant_type: 'authorization_code'
    })
  });

  const tokens = await tokenRes.json();
  if (!tokens.access_token) return res.json({ error: 'Token exchange failed', details: tokens });

  res.send(`
    <h2>Connected to Jobber!</h2>
    <p>Copy these into your .env file:</p>
    <pre>
JOBBER_ACCESS_TOKEN=${tokens.access_token}
JOBBER_REFRESH_TOKEN=${tokens.refresh_token}
    </pre>
    <p>You can close this tab and stop the auth server.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`\nAuth server running at http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/connect to authorize Jobber\n`);
});

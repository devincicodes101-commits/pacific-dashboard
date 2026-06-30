export const metadata = {
  title: 'Privacy Policy — Pacific Dashboard',
  description: 'Privacy Policy for the Pacific Heat Pumps internal finance dashboard.',
};

const UPDATED = 'June 30, 2026';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-ink-muted mb-10">Last updated: {UPDATED}</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-ink-soft">
          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">1. Overview</h2>
            <p>
              The Pacific Dashboard (&quot;the Service&quot;) is a private, internal business-intelligence
              tool that consolidates operational and financial data for Pacific Heat Pumps. The
              Service is not offered to the general public and is used only by authorized staff and
              their service provider. This policy explains what data the Service accesses, how it is
              used, and how it is protected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">2. Data We Access</h2>
            <p className="mb-2">
              To display performance metrics, the Service reads business data from connected
              accounts, which may include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Jobs, quotes, requests, invoices, visits, line items and timesheets (from Jobber)</li>
              <li>Accounting data such as invoices, payments, balances, payables and taxes (from QuickBooks Online)</li>
              <li>Aggregated figures derived from the above (revenue, hours, conversion rates, etc.)</li>
            </ul>
            <p className="mt-2">
              The Service reads this data for reporting only. It does not create, modify, or delete
              records in any connected account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">3. How We Use Data</h2>
            <p>
              Data is used solely to calculate and display key performance indicators on the
              dashboard for internal management purposes. We do not sell, rent, or share business
              data with third parties for marketing or advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">4. Data Storage &amp; Processing</h2>
            <p>
              Synced data is stored in a secured database (Supabase) and served through a hosting
              provider (Vercel). Access is restricted to authorized users. Data is transmitted over
              encrypted (HTTPS) connections.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">5. Third-Party Services</h2>
            <p>
              The Service connects to third-party platforms — including Jobber and Intuit
              QuickBooks Online — using their official APIs and OAuth authorization. Your use of
              those platforms remains governed by their respective privacy policies and terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">6. Data Retention &amp; Revocation</h2>
            <p>
              Synced data is retained only as long as needed for reporting. Account owners may
              revoke the Service&apos;s access at any time from their Jobber or QuickBooks
              connection settings, after which no further data is synced.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">7. Contact</h2>
            <p>
              For any questions about this policy or to request data removal, contact{' '}
              <a className="text-gold underline" href="mailto:catalyst@theredstone.ai">
                catalyst@theredstone.ai
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

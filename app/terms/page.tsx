export const metadata = {
  title: 'Terms of Use / EULA — Pacific Dashboard',
  description: 'End-User License Agreement and Terms of Use for the Pacific Heat Pumps internal finance dashboard.',
};

const UPDATED = 'June 30, 2026';

export default function Terms() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Terms of Use &amp; End-User License Agreement</h1>
        <p className="text-sm text-ink-muted mb-10">Last updated: {UPDATED}</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-ink-soft">
          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">1. Acceptance</h2>
            <p>
              By accessing or using the Pacific Dashboard (&quot;the Service&quot;), you agree to
              these Terms of Use and End-User License Agreement (&quot;Agreement&quot;). The Service
              is a private, internal tool intended only for authorized users of Pacific Heat Pumps
              and its service provider. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">2. License</h2>
            <p>
              Subject to this Agreement, you are granted a limited, non-exclusive, non-transferable,
              revocable license to access the Service for internal business reporting only. You may
              not resell, sublicense, or make the Service available to any unauthorized third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">3. Connected Accounts</h2>
            <p>
              The Service connects to third-party platforms (such as Jobber and Intuit QuickBooks
              Online) using your authorization. You confirm that you are authorized to grant access
              to those accounts. The Service reads data for reporting only and does not modify your
              records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">4. Acceptable Use</h2>
            <p>
              You agree not to misuse the Service, attempt to gain unauthorized access, interfere
              with its operation, or use it to violate any applicable law or the terms of any
              connected platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">5. Data Accuracy Disclaimer</h2>
            <p>
              Figures shown are derived from connected systems and are provided for informational
              purposes. While we aim for accuracy, the Service is provided &quot;as is&quot; without
              warranty of any kind. Figures should be verified against source systems before being
              relied upon for financial, legal, or tax decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, the providers of the Service shall not be
              liable for any indirect, incidental, or consequential damages arising from the use of,
              or inability to use, the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">7. Termination</h2>
            <p>
              Access may be suspended or terminated at any time. You may stop using the Service and
              revoke its access to any connected account at any time through that platform&apos;s
              connection settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink mb-2">8. Contact</h2>
            <p>
              Questions about this Agreement can be directed to{' '}
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

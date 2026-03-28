export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">
            Privacy Policy
          </div>

          <h1 className="mt-4 text-4xl font-light md:text-6xl">
            Privacy Policy
          </h1>

          <div className="mt-2 text-lg text-white/60">
            The Next Holiday Classic
          </div>

          <p className="mt-6 text-white/70">
            Last Updated: January 1, 2026
          </p>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-8">

          {/* 1 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">1. Information We Collect</h2>

            <div className="mt-4 text-white/70 space-y-3">
              <p className="text-white/60">Information you provide directly:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full name and email address</li>
                <li>Song title, genre, lyrics, and description</li>
                <li>Audio files uploaded</li>
                <li>Rule acceptance confirmation</li>
              </ul>

              <p className="text-white/60 mt-4">Information collected automatically:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and general location</li>
                <li>Browser, OS, and device info</li>
                <li>Pages visited and time spent</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>
          </section>

          {/* 2 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">2. How We Use Your Information</h2>

            <div className="mt-4 text-white/70 space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Process song submissions</li>
                <li>Verify voters and record votes</li>
                <li>Communicate updates and results</li>
                <li>Prevent fraud and abuse</li>
                <li>Improve website experience</li>
                <li>Comply with legal obligations</li>
              </ul>

              <p className="mt-3">
                We do not sell your personal data or use it for targeted ads.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">
              3. Legal Basis (EEA / UK Users)
            </h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>Contract performance</li>
              <li>Legitimate interests</li>
              <li>Consent</li>
              <li>Legal obligations</li>
            </ul>
          </section>

          {/* 4 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">4. Data Sharing</h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>Service providers (e.g. Supabase)</li>
              <li>Judges and internal staff</li>
              <li>Public winner announcements</li>
              <li>Legal requirements</li>
              <li>Business transfers</li>
            </ul>

            <p className="mt-3 text-white/70">
              We never sell or share your personal data for marketing.
            </p>
          </section>

          {/* 5 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">5. Data Retention</h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>Submissions: up to 2 years</li>
              <li>Votes: up to 1 year</li>
              <li>Winners: up to 7 years</li>
            </ul>
          </section>

          {/* 6 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">6. Data Security</h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>HTTPS encryption</li>
              <li>Secure database (Supabase)</li>
              <li>Email OTP authentication</li>
              <li>Restricted access</li>
            </ul>

            <p className="mt-3 text-white/70">
              No system is 100% secure, but we follow best practices.
            </p>
          </section>

          {/* 7 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">7. Cookies</h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>Essential cookies (login/session)</li>
              <li>Analytics cookies (usage insights)</li>
            </ul>

            <p className="mt-3 text-white/70">
              No advertising or cross-site tracking cookies are used.
            </p>
          </section>

          {/* 8 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">8. Your Rights</h2>

            <ul className="mt-4 text-white/70 list-disc pl-6 space-y-1">
              <li>Access your data</li>
              <li>Correct data</li>
              <li>Delete data</li>
              <li>Object or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>

            <p className="mt-3 text-white/70">
              Contact: info@thenextholidayclassic.com
            </p>
          </section>

          {/* 9 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">9. Children's Privacy</h2>

            <p className="mt-4 text-white/70">
              Our services are for users 18+. We do not knowingly collect data from minors.
            </p>
          </section>

          {/* 10 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">10. International Transfers</h2>

            <p className="mt-4 text-white/70">
              Data may be processed in the United States with proper safeguards.
            </p>
          </section>

          {/* 11 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">11. Third-Party Links</h2>

            <p className="mt-4 text-white/70">
              We are not responsible for third-party privacy practices.
            </p>
          </section>

          {/* 12 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">12. Changes</h2>

            <p className="mt-4 text-white/70">
              We may update this policy. Continued use means acceptance.
            </p>
          </section>

          {/* 13 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">13. Governing Law</h2>

            <p className="mt-4 text-white/70">
              Governed by the laws of Ohio, USA.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
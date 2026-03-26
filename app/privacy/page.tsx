export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Privacy Policy</div>
          <h1 className="mt-4 text-4xl font-light md:text-6xl">Privacy Policy</h1>
          <div className="mt-2 text-lg text-white/60">The Next Holiday Classic</div>
          <p className="mt-6 text-white/70">Effective date: 6/1/2026</p>
        </div>

        <div className="mt-12 space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Overview</h2>
            <p className="mt-3 text-white/70">This Privacy Policy explains how The Next Holiday Classic collects, uses, stores, and protects personal information from songwriters, listeners, voters, judges, and site visitors.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Information We Collect</h2>
            <p className="mt-3 text-white/70">We may collect your name, email address, song title, lyrics, uploaded audio files, voting activity, and technical data such as device and browser information.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">How We Use Information</h2>
            <p className="mt-3 text-white/70">Information is used to operate the contest, manage submissions, process voting, communicate with users, and improve the platform experience.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Voting Integrity</h2>
            <p className="mt-3 text-white/70">Email verification and activity monitoring may be used to maintain fair voting and prevent abuse.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Data Sharing</h2>
            <p className="mt-3 text-white/70">We do not sell personal data. Information may be shared with service providers who help operate the platform.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Security</h2>
            <p className="mt-3 text-white/70">We take reasonable measures to protect your data, though no system is completely secure.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Contact</h2>
            <p className="mt-3 text-white/70">Contact us at: info@thenextholidayclassic.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}

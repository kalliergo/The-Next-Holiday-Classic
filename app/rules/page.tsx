export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Official Rules</div>
          <h1 className="mt-4 text-4xl font-light md:text-6xl">The Next Holiday Classic</h1>
        </div>

        <div className="mt-12 space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Eligibility</h2>
            <p className="mt-3 text-white/70">Open to songwriters worldwide.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Song Requirements</h2>
            <p className="mt-3 text-white/70">Entries must be original holiday-themed songs and must comply with submission requirements published by The Next Holiday Classic.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Voting</h2>
            <p className="mt-3 text-white/70">Each listener may vote for up to 3 songs per round. Contest administration reserves the right to limit or disqualify fraudulent voting behavior.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-light">Prizes</h2>
            <p className="mt-3 text-white/70">First Prize: $10,000 • Second Prize: $2,500 • Third Prize: $1,000</p>
          </section>
        </div>
      </div>
    </div>
  );
}

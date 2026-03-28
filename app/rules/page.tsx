function RuleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
      <h2 className="text-2xl font-light text-white md:text-3xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-white/70">{children}</p>
    </section>
  );
}

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Official Rules</div>
          <h1 className="mt-4 text-4xl font-light md:text-6xl">The Next Holiday Classic</h1>
          <p className="mt-6 text-white/70">Please review the official contest terms before entering or voting.</p>
        </div>

        <div className="mt-12 space-y-8">
          <RuleSection title="Eligibility">
            Open to songwriters worldwide, subject to all local laws and regulations.
          </RuleSection>
          <RuleSection title="Song Requirements">
            Entries must be original holiday-themed songs submitted in accordance with the current contest guidelines.
          </RuleSection>
          <RuleSection title="Voting">
            Each listener may vote for up to 3 songs per round. All voting is subject to platform verification and fraud prevention measures.
          </RuleSection>
          <RuleSection title="Prizes">
            First Prize: $10,000 � Second Prize: $2,500 � Third Prize: $1,000.
          </RuleSection>
          <RuleSection title="Rights & Permissions">
            By submitting, entrants confirm they have the necessary rights to enter the song and participate in contest promotion and review.
          </RuleSection>
        </div>
      </div>
    </div>
  );
}
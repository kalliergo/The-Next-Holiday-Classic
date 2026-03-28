export default function RadioPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Podcast & Radio</div>
        <h1 className="mt-4 text-4xl font-light md:text-6xl">The Next Holiday Classic Show</h1>
        <p className="mt-6 text-white/70">Listen to featured songs, weekly highlights, and exclusive commentary.</p>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          <audio controls className="w-full">
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
          </audio>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            "This Week’s Episode",
            "Holiday Spotlight",
            "Featured Songs",
          ].map((item) => (
            <div key={item} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-light text-white">{item}</div>
              <p className="mt-3 text-sm leading-7 text-white/60">Hosted by Jason McCoy and featuring all 10 semi finalists songs for the week, with backstories and additional Holiday Classic spotlights.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
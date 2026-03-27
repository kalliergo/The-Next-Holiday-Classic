export default function RadioPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs uppercase tracking-[0.35em] text-[#d6b56a]">Podcast & Radio</div>
        <h1 className="mt-4 text-4xl font-light md:text-6xl">The Next Holiday Classic Show</h1>
        <p className="mt-6 text-white/70">Listen to featured songs, weekly highlights, and exclusive commentary.</p>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <audio controls className="w-full">
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}

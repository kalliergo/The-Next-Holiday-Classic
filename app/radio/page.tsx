export default function RadioPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] px-6 py-16 text-white font-sans">
      <div className="mx-auto max-w-6xl">
        
        {/* Page Header */}
        <div className="text-center mb-16 mt-8">
          <div className="text-xs uppercase tracking-[0.3em] text-[#d6b56a] font-semibold mb-6">
            The Next Holiday Classic
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-light mb-6 tracking-wide">
            5-Week National Holiday Song Contest
          </h1>
          <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] text-white/80">
            Radio Program Overview
          </h2>
        </div>

        {/* Top Two Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Program Format Card */}
          <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
              Program Format
            </h3>
            <ul className="space-y-4 text-[15px] text-white/80 font-light">
              <li>• 44:00 content runtime (hour-clock compliant)</li>
              <li>• Weekly episodic format (5 weeks total)</li>
              <li>• 10–15 featured original holiday songs (edited for radio length)</li>
              <li>• Host + rotating music industry judge</li>
              <li>• Listener voting call-to-action</li>
            </ul>
          </div>

          {/* Radio Show Demo Card */}
          <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
              Radio Show Demo
            </h3>
            <h4 className="text-2xl font-light mb-4 text-white">Audio Player</h4>
            <p className="text-[15px] text-white/70 font-light mb-8 leading-relaxed">
              Demo player for sample radio show audio, promos, or preview edits.
            </p>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 flex items-center justify-center">
              <audio controls className="w-full h-12 outline-none">
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>

        {/* Episode Structure Section */}
        <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10 mb-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
            Episode Structure
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Semifinals */}
            <div className="rounded-[1.5rem] border border-white/5 bg-black/40 p-6 md:p-8">
              <h4 className="text-lg font-medium text-white mb-6">Weeks 1–2–3 Semifinals</h4>
              <ul className="space-y-4 text-[14px] text-white/70 font-light leading-relaxed">
                <li>• Segment 1 – Show open + semifinalist previews</li>
                <li>• Segment 2 – Additional semifinalists</li>
                <li>• Mid-show break – Station ad inventory</li>
                <li>• Segment 3 – More featured songs and a Holiday Hit from the past showcase</li>
                <li>• Segment 4 – Semifinals/Finals recap + voting reminder + close</li>
              </ul>
            </div>

            {/* Finals */}
            <div className="rounded-[1.5rem] border border-white/5 bg-black/40 p-6 md:p-8">
              <h4 className="text-lg font-medium text-white mb-6">Week 4 Finals</h4>
              <ul className="space-y-4 text-[14px] text-white/70 font-light leading-relaxed">
                <li>• Segment 1 – Show open + semifinalist previews</li>
                <li>• Segment 2 – Additional semifinalists</li>
                <li>• Mid-show break – Station ad inventory</li>
                <li>• Segment 3 – More featured songs and a Holiday Hit from the past showcase</li>
                <li>• Segment 4 – Finals recap + voting reminder + close</li>
              </ul>
            </div>

            {/* Winners Show */}
            <div className="rounded-[1.5rem] border border-white/5 bg-black/40 p-6 md:p-8">
              <h4 className="text-lg font-medium text-white mb-6">Week 5 Winners Show</h4>
              <ul className="space-y-4 text-[14px] text-white/70 font-light leading-relaxed">
                <li>• Segment 1 – Show open + finalist recaps</li>
                <li>• Segment 2 – Additional finalist recaps</li>
                <li>• Mid-show break – Station ad inventory</li>
                <li>• Segment 3 – More finalist review and a Holiday Hit from the past showcase</li>
                <li>• Segment 4 – Judges' final comments + winners announcement + full-length play of winning song</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Why It Works For Radio */}
          <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
              Why It Works For Radio
            </h3>
            
            <div className="space-y-8 text-[15px] font-light text-white/80">
              <div>
                <p className="mb-4">Holiday music drives:</p>
                <ul className="space-y-3">
                  <li>• Emotional connection</li>
                  <li>• Repeat listening</li>
                  <li>• Family-friendly engagement</li>
                  <li>• High seasonal tune-in</li>
                </ul>
              </div>

              <div>
                <p className="mb-4">The built-in voting mechanic encourages:</p>
                <ul className="space-y-3">
                  <li>• Website visits</li>
                  <li>• Social engagement</li>
                  <li>• Listener participation</li>
                  <li>• Cross-platform promotion</li>
                </ul>
              </div>

              <div>
                <p className="mb-4">Stations can:</p>
                <ul className="space-y-3">
                  <li>• Insert local sponsor reads</li>
                  <li>• Promote local voting activity</li>
                  <li>• Highlight regional artists (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-6">
            
            {/* Target Format Fit */}
            <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
                Target Format Fit
              </h3>
              <ul className="space-y-4 text-[15px] font-light text-white/80">
                <li>• AC / Hot AC</li>
                <li>• Christian AC</li>
                <li>• Country</li>
                <li>• Adult Contemporary</li>
                <li>• Seasonal holiday flip formats</li>
              </ul>
            </div>

            {/* Distribution Model */}
            <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-8 md:p-10 flex-grow">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-8">
                Distribution Model
              </h3>
              
              <div className="space-y-8 text-[15px] font-light text-white/80">
                <div>
                  <p className="mb-4">Available as:</p>
                  <ul className="space-y-3">
                    <li>• Barter split</li>
                    <li>• Cash license</li>
                    <li>• Hybrid model</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4">Digital simulcast aligns with:</p>
                  <ul className="space-y-3">
                    <li>• Spotify</li>
                    <li>• Apple Podcasts</li>
                    <li>• Amazon Music</li>
                    <li>• iHeartRadio</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Positioning Footer Card */}
        <div className="rounded-[2rem] border border-[#2a2723] bg-[#13110e] p-12 text-center mb-16">
          <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b56a] font-semibold mb-6">
            Positioning
          </h3>
          <p className="text-2xl md:text-3xl font-light text-white">
            "A Global Search for the Next Christmas Hit Song."
          </p>
        </div>

      </div>
    </div>
  );
}
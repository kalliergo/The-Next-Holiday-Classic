import Link from "next/link";

export default function Navbar() {
  return (
    <>
      {/* --- TOP NAVBAR (Sticky) --- */}
      <div className="sticky top-0 z-50 mx-auto max-w-7xl px-3 pt-3 sm:px-4 lg:px-8">
        <header className="mx-auto flex items-center justify-between gap-3 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(22,20,18,0.82),rgba(12,11,10,0.72))] px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 sm:px-4 md:px-6 lg:gap-6">
          
          {/* Brand Logo (Visible on ALL screens) */}
          <div className="shrink-0 text-[10px] tracking-[0.22em] sm:text-sm sm:tracking-[0.26em]">
            <Link href="/" className="text-white/88 transition-colors hover:text-[#d6b56a]">
              THE NEXT <br className="sm:hidden" /> HOLIDAY CLASSIC
            </Link>
          </div>

          {/* Desktop Navigation (Hidden on mobile) */}
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm text-white/80 md:flex lg:gap-3">
            <Link 
              href="/#criteria"
              className="rounded-full border border-white/12 px-4 py-2 transition-all duration-300 hover:border-[#d6b56a] hover:bg-white/5 hover:text-white"
            >
              Judging Criteria
            </Link>
            <Link 
              href="/#listen"
              className="rounded-full border border-white/12 px-4 py-2 transition-all duration-300 hover:border-[#d6b56a] hover:bg-white/5 hover:text-white"
            >
              Semifinalists
            </Link>
            <Link 
              href="/#podcast"
              className="rounded-full border border-white/12 px-4 py-2 transition-all duration-300 hover:border-[#d6b56a] hover:bg-white/5 hover:text-white"
            >
              Podcast
            </Link>
            <Link 
              href="/#judges"
              className="rounded-full border border-white/12 px-4 py-2 transition-all duration-300 hover:border-[#d6b56a] hover:bg-white/5 hover:text-white"
            >
              Judges
            </Link>
            <Link 
              href="/rules"
              className="rounded-full border border-white/12 px-4 py-2 transition-all duration-300 hover:border-[#d6b56a] hover:bg-white/5 hover:text-white"
            >
              Rules
            </Link>
          </nav>

          {/* Desktop CTA Button (Hidden on mobile, replaced by bottom bar "Enter") */}
          <Link 
            href="/submit"
            className="hidden shrink-0 rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-4 py-2 text-xs font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(214,181,106,0.4)] md:inline-flex sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Submit a Song
          </Link>

        </header>
      </div>

      {/* --- MOBILE BOTTOM BAR (Fixed) --- */}
      <div className="fixed bottom-3 left-3 right-3 z-50 animate-[mobileBarRise_0.35s_ease-out] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(22,20,18,0.96),rgba(12,11,10,0.96))] px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-2 text-center text-[11px] text-white/75">
          <Link 
            href="/rules" 
            className="flex items-center justify-center rounded-xl px-1 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            Rules
          </Link>
          <Link 
            href="/#listen" 
            className="flex items-center justify-center rounded-xl px-1 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            Listen
          </Link>
          <Link 
            href="/#podcast" 
            className="flex items-center justify-center rounded-xl px-1 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            Podcast
          </Link>
          <Link 
            href="/#judges" 
            className="flex items-center justify-center rounded-xl px-1 py-2 transition-colors hover:bg-white/5 hover:text-white"
          >
            Judges
          </Link>
          <Link 
            href="/submit" 
            className="flex items-center justify-center rounded-xl bg-[#d6b56a] px-1 py-2 font-medium text-black transition-transform hover:scale-105"
          >
            Enter
          </Link>
        </div>
      </div>
    </>
  );
}
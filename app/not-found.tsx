import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen px-6 py-16 flex items-center justify-center selection:bg-[#d6b56a] selection:text-black bg-[radial-gradient(circle_at_top,_rgba(207,169,80,0.22),_transparent_35%),linear-gradient(180deg,#0f0d0b_0%,#0b0a09_100%)]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        
        {/* Eyebrow / Label */}
        <div className="mb-6 text-[10px] font-semibold uppercase tracking-[0.5em] text-[#d6b56a] md:text-xs">
          System Error
        </div>

        {/* Massive Crisp 404 */}
        <h1 className="mb-6 text-[8rem] font-thin leading-none tracking-tighter text-white md:text-[14rem]">
          404
        </h1>

        {/* Sharp Decorative Line (Instead of shadows/borders for depth) */}
        <div className="mb-8 h-[1px] w-16 bg-[#d6b56a]/50 transition-all duration-500 hover:w-32 hover:bg-[#d6b56a]"></div>

        {/* Subtitle & Description */}
        <h2 className="mb-4 text-2xl font-light tracking-wide text-white md:text-3xl">
          Page Not Found
        </h2>
        <p className="mb-12 max-w-md text-sm font-light leading-relaxed text-white/50 md:text-base">
          The destination you are looking for no longer exists, has been moved, or is temporarily unavailable.
        </p>

        {/* Refined Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-[#d6b56a]/40 bg-transparent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d6b56a] transition-colors duration-300 hover:border-[#d6b56a] hover:bg-[#d6b56a] hover:text-[#0a0a0a]"
        >
          Return Home
        </Link>
        
      </div>
    </div>
  );
}
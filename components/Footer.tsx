import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0b0a09] pt-16 pb-8 sm:pt-24 sm:pb-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        
        {/* Top Section: Brand, Links, CTA */}
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          
          {/* Brand & Description */}
          <div className="flex flex-col items-start">
            <Link href="/" className="text-sm tracking-[0.26em] text-white/88 hover:text-white transition-colors">
              THE NEXT HOLIDAY CLASSIC
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              A global search for the next holiday standard. Listen to the weekly semifinalists, cast your votes, and help us discover a new timeless hit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:ml-auto">
            <div className="flex flex-col gap-3">
              <div className="text-xs uppercase tracking-[0.22em] text-[#d6b56a] mb-2">Explore</div>
              <Link href="/#listen" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Semifinalists</Link>
              <Link href="/#podcast" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Podcast</Link>
              <Link href="/#judges" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Judges</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="text-xs uppercase tracking-[0.22em] text-[#d6b56a] mb-2">Legal</div>
              <Link href="/rules" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Official Rules</Link>
              <Link href="/privacy" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-white/70 hover:text-[#d6b56a] transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="text-xs uppercase tracking-[0.22em] text-[#d6b56a] mb-4">Are you a songwriter?</div>
            <Link
              href="/submit"
              className="rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition-transform hover:scale-105"
            >
              Submit a Song
            </Link>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {currentYear} The Next Holiday Classic. All rights reserved.
          </p>
          
          {/* Optional: Add social icons here if needed */}
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-[#d6b56a] transition-colors" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
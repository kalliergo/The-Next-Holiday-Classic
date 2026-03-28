import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a09] py-16 text-white sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 sm:px-6">
        
        {/* Top: Brand */}
        <Link href="/" className="text-center text-sm tracking-[0.26em] text-[#d6b56a] transition-colors hover:text-[#f7e7b0]">
          THE NEXT HOLIDAY CLASSIC
        </Link>

        {/* Middle: Pill Navigation Links */}
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          <Link 
            href="/" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Home
          </Link>
          <Link 
            href="/submit" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Submit a Song
          </Link>
          <Link 
            href="/#podcast" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Radio Show
          </Link>
          <Link 
            href="/rules" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Rules
          </Link>
          <Link 
            href="/privacy" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/contact" 
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-[#d6b56a] hover:text-white"
          >
            Contact
          </Link>
        </nav>

        {/* Bottom: Copyright & Legal */}
        <div className="mt-16 flex flex-col items-center gap-2 text-center text-[13px] text-white/40">
          <p>
            &copy; {currentYear} The Next Holiday Classic&trade;. All rights reserved.
          </p>
          <p>
            Governed by the laws of Ohio, USA. <span className="mx-1.5 hidden sm:inline">&bull;</span><br className="sm:hidden" /> Contest open to eligible participants worldwide where permitted by law.
          </p>
          <p className="mt-1">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">&bull;</span>
            <Link href="/rules" className="hover:text-white transition-colors">Rules</Link>
            <span className="mx-2">&bull;</span>
            <a href="mailto:info@thenextholidayclassic.com" className="hover:text-white transition-colors">info@thenextholidayclassic.com</a>
          </p>
        </div>

      </div>
    </footer>
  );
}
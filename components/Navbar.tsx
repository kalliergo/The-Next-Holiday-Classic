'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scrolling to apply smooth transition effects
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      // Close mobile menu smoothly if the user starts scrolling
      if (scrolled && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Semifinalists', href: '/#listen' },
    { name: 'Podcast', href: '/#podcast' },
    { name: 'Judges', href: '/#judges' },
    { name: 'Radio', href: '/radio' },
    { name: 'Rules', href: '/rules' },
    { name: 'Privacy', href: '/privacy' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled ? 'pt-2 pb-2 bg-black/20 backdrop-blur-md' : 'pt-4 bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative">
        <header 
          className={`relative z-50 flex items-center justify-between gap-3 rounded-full border border-white/12 px-4 py-3 transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'bg-[linear-gradient(180deg,rgba(22,20,18,0.95),rgba(12,11,10,0.9))] shadow-[0_8px_30px_rgb(0,0,0,0.3)] backdrop-blur-xl' 
              : 'bg-[linear-gradient(180deg,rgba(22,20,18,0.82),rgba(12,11,10,0.72))] backdrop-blur-xl'
          }`}
        >
          
          {/* Left Side: Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-white/88 hover:text-white transition-transform active:scale-95 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative h-6 w-6">
                <svg 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                  }`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>

            <Link href="/" className="hidden sm:block text-[10px] lg:text-sm tracking-[0.15em] lg:tracking-[0.26em] text-white/88 font-medium whitespace-nowrap hover:text-white transition-colors">
              THE NEXT HOLIDAY CLASSIC
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-3 text-sm text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full border border-transparent px-3 lg:px-4 py-2 hover:border-[#d6b56a] transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side: CTA Button */}
          <Link
            href="/submit"
            className="whitespace-nowrap rounded-full bg-[linear-gradient(180deg,#f7e7b0,#d6b56a)] px-4 py-2 text-xs font-medium text-black sm:px-5 sm:py-2.5 sm:text-sm transition-transform hover:scale-105 shadow-md"
          >
            Submit a Song
          </Link>
        </header>

        {/* Smooth Mobile Dropdown Menu */}
        <div 
          className={`absolute left-4 right-4 z-40 md:hidden origin-top transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'top-[4.5rem]' : 'top-[5.5rem]'
          } ${
            isMobileMenuOpen 
              ? 'visible translate-y-0 scale-100 opacity-100' 
              : 'invisible -translate-y-4 scale-95 opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-white/12 bg-[#0c0b0a]/95 p-4 backdrop-blur-xl shadow-2xl">
            <Link 
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mb-4 sm:hidden border-b border-white/10 pb-4 text-center text-[10px] tracking-[0.2em] text-white/88 hover:text-white transition-colors"
            >
              THE NEXT HOLIDAY CLASSIC
            </Link>
            
            <nav className="flex flex-col gap-1 text-sm text-white/80">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
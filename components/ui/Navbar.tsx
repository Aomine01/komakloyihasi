'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Asosiy', href: '/' },
  { label: 'Statistika', href: '/statistika' },
  { label: "Ko'makchilar", href: '/loyihalar' },
  { label: 'FAQ', href: '/faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl shadow-ambient border-b border-outline-variant/15'
          : 'bg-surface-container-low/50 backdrop-blur-xl'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-black font-headline tracking-tight text-primary cursor-pointer">
            Ko‘mak
          </Link>
        </div>

        {/* Navigation Links (Web) */}
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-full flex items-center px-2 transition-all font-medium border-b-2
                  ${isActive ? 'text-primary border-primary bg-primary/5' : 'text-on-surface-variant border-transparent hover:text-primary hover:bg-surface-container-high'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Action */}
        <div className="hidden md:flex items-center">
          <Link
            href="/aloqa"
            className="bg-gradient-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:opacity-90 scale-95 active:scale-90 duration-200 transition-all shadow-md"
          >
            Bog‘lanish
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-primary p-2 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-surface-lowest shadow-ambient border-t border-outline-variant/15 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-left font-headline font-medium transition-colors
                      ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-low'}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/aloqa"
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-gradient-primary text-on-primary px-6 py-3 rounded-lg font-medium text-center shadow-md hover:opacity-90"
              >
                Bog‘lanish
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

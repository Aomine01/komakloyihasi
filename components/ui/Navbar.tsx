'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
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
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Determine if the current page has a dark hero section and we are not scrolled
  const isDarkHeader = pathname === '/loyihalar' && !scrolled;

  const textColorClass = isDarkHeader ? 'text-white/80 hover:text-white' : 'text-on-surface-variant hover:text-primary';
  const activeTextColorClass = isDarkHeader ? 'text-white' : 'text-primary';
  const logoColorClass = isDarkHeader ? 'text-white' : 'text-primary';
  const indicatorColorClass = isDarkHeader ? 'bg-white' : 'bg-primary';
  const hamburgerClass = isDarkHeader ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-surface-container-high';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled
            ? 'bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_4px_24px_rgba(19,27,46,0.07)] border-b border-outline-variant/20'
            : 'bg-transparent backdrop-blur-sm'
          }`}
      >
        <div className="relative flex justify-between items-center max-w-7xl mx-auto px-6 h-20 md:h-24">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center group relative w-[180px] h-[52px] md:w-[240px] md:h-[68px] lg:w-[300px] lg:h-[80px]">
              <Image
                src={isDarkHeader ? "/Group 211.svg" : "/Group 202.svg"}
                alt="Ko'mak Logo"
                fill
                priority
                className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 h-full absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-full flex items-center px-4 text-sm font-semibold font-headline tracking-tight transition-colors duration-200 ${isActive ? activeTextColorClass : textColorClass
                    }`}
                >
                  {link.label}
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full ${indicatorColorClass}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Hover bg */}
                  <span className={`absolute inset-0 rounded-lg transition-colors duration-200 ${isActive ? (isDarkHeader ? 'bg-white/10' : 'bg-primary/6') : (isDarkHeader ? 'hover:bg-white/5' : 'hover:bg-surface-container-high')
                    }`} aria-hidden />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="https://t.me/komakmentor"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${isDarkHeader
                  ? 'bg-white text-primary hover:bg-white/90'
                  : 'bg-gradient-primary text-on-primary hover:opacity-90'
                }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat_bubble
              </span>
              Bog&apos;lanish
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-xl transition-colors ${hamburgerClass}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <motion.span
              key={mobileOpen ? 'close' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-3xl block"
            >
              {mobileOpen ? 'close' : 'menu'}
            </motion.span>
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden bg-surface-container-lowest/95 backdrop-blur-2xl
                         border-t border-outline-variant/15 md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-headline font-semibold transition-colors ${isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-3 pt-3 border-t border-outline-variant/15">
                  <Link
                    href="https://t.me/komakmentor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-primary
                               text-on-primary px-5 py-3.5 rounded-xl font-semibold text-sm
                               shadow-md hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      chat_bubble
                    </span>
                    Bog&apos;lanish
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay when mobile open */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}


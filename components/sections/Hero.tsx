'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.14, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Returns true on connections / hardware that can't handle video well */
function isWeakDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Low CPU cores (≤ 2)
  if (navigator.hardwareConcurrency <= 2) return true;
  // Slow network connection
  const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') return true;
  return false;
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipVideo] = useState(() => isWeakDevice());

  // Detect reduced motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Lazy-load and play video only when visible & allowed
  useEffect(() => {
    if (prefersReducedMotion || skipVideo) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src && !video.querySelector('source')?.getAttribute('data-loaded')) {
            const source = video.querySelector('source');
            if (source) {
              source.setAttribute('data-loaded', 'true');
              video.load();
            }
          }
          video.play().catch(() => {/* autoplay blocked — poster stays visible */});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [prefersReducedMotion, skipVideo]);

  // Video speed + scroll-driven zoom (throttled via rAF)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || skipVideo) return;

    const handleCanPlay = () => {
      video.playbackRate = 0.8;
      setVideoLoaded(true);
    };
    video.addEventListener('canplay', handleCanPlay);

    // Throttle scroll with requestAnimationFrame to avoid jank on weak CPUs
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        if (video) {
          const progress = Math.min(window.scrollY / window.innerHeight, 1);
          video.style.transform = `scale(${1 + progress * 0.18})`;
        }
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [skipVideo]);


  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >

      {/* ── Poster fallback — shown instantly (permanent on weak devices) ── */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          videoLoaded && !prefersReducedMotion && !skipVideo ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: "url('/hero-poster.png')" }}
        aria-hidden="true"
      />

      {/* ── Video background — skipped on weak devices / reduced motion ── */}
      {!prefersReducedMotion && !skipVideo && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (!video.duration) return;
            const timeLeft = video.duration - video.currentTime;
            // Fade out 1.5 seconds before the video ends to hide the sharp cut
            if (timeLeft <= 1.5) {
              video.style.opacity = '0';
            } else {
              video.style.opacity = '1';
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transformOrigin: 'center center' }}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* ── Overlay — rich deep-teal gradient matching the reference ── */}
      <div className="absolute inset-0 bg-[#004f45]/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#002f29]/70 via-[#003b33]/80 to-[#001f1a]/95" />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center pt-24">

        {/* Main heading */}
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-headline font-black text-white leading-[1.06] tracking-tight mb-7"
          style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
        >
          Ko&apos;mak — orzularga
          <br className="hidden sm:block" />
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #a8f0e8 0%, #5dd9c9 40%, #fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {' '}qanot beramiz!
          </span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-white/80 leading-relaxed max-w-2xl mb-12"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
        >
          Chekka va olis hududlarda o&apos;quv markazi ochish yoki rivojlantirish
          uchun imtiyozli ssuda ajratuvchi loyiha.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <a
            href="https://yoshlarfondi.uz/services/6"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex justify-center items-center gap-2.5
                       bg-white text-[#00685f] px-8 py-4 rounded-2xl font-bold text-base
                       hover:bg-white/92 active:scale-[0.97] transition-all duration-200
                       shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_40px_rgba(0,0,0,0.35)]
                       hover:-translate-y-1 w-full sm:w-auto"
          >
            Loyihaga qo&apos;shilish
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </a>
          <a
            href="#about"
            className="inline-flex justify-center items-center gap-2
                       bg-white/[0.12] text-white border border-white/[0.28] backdrop-blur-md
                       px-8 py-4 rounded-2xl font-bold text-base
                       hover:bg-white/[0.22] hover:border-white/50 active:scale-[0.97]
                       transition-all duration-200 hover:-translate-y-1 w-full sm:w-auto"
          >
            Batafsil ma&apos;lumot
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        type="button"
        aria-label="Pastga aylantiring"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   opacity-50 hover:opacity-90 transition-opacity duration-300 cursor-pointer group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="h-14 w-px bg-white/30 overflow-hidden relative">
          <motion.div
            className="absolute left-0 w-full bg-white/90"
            style={{ height: '45%' }}
            animate={{ top: ['-45%', '115%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span className="text-[10px] text-white/60 group-hover:text-white/90 tracking-[0.22em] uppercase font-semibold transition-all duration-300">
          Pastga
        </span>
      </motion.button>
    </section>
  );
}

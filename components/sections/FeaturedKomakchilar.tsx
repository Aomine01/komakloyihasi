'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Person {
  name: string;
  slug: string;
  featured: boolean;
  description: string | null;
  images: string[];
  imagePath: string;
}

interface FeaturedPerson extends Person {
  viloyatName: string;
  lavozim: string;
  location: string;
}

function extractField(desc: string, key: string): string {
  const lines = desc.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(key + ':')) {
      return trimmed.substring(key.length + 1).trim();
    }
  }
  return '';
}

function getFeaturedPeople(): FeaturedPerson[] {
  // Import dynamically to avoid blocking the main thread on mount
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const komakchilarData = require('@/komakchilar-data.json');
  const result: FeaturedPerson[] = [];
  for (const viloyat of komakchilarData.viloyatlar) {
    for (const person of viloyat.people) {
      if (person.featured && person.description && person.images.length > 0) {
        const lavozim = extractField(person.description, 'LAVOZIM');
        const location = extractField(person.description, 'ЯШАШ_ЖОЙИ') ||
                         extractField(person.description, 'ТУҒИЛГАН_ЖОЙ') ||
                         viloyat.name;
        result.push({
          ...person,
          viloyatName: viloyat.name.replace(/ viloyati$/i, ''),
          lavozim: lavozim || "O'quv markazi asoschisi",
          location,
        });
      }
    }
  }
  return result;
}

function createSmartSequence(people: FeaturedPerson[], gap: number = 3): FeaturedPerson[] {
  const pool = [...people];
  const sequence: FeaturedPerson[] = [];
  const recentIndices: number[] = [];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const targetLength = pool.length * 2;

  for (let step = 0; step < targetLength; step++) {
    const candidates = pool.filter((_, idx) => !recentIndices.includes(idx));

    if (candidates.length === 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      sequence.push(pick);
    } else {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const pickIdx = pool.indexOf(pick);
      sequence.push(pick);
      recentIndices.push(pickIdx);
      if (recentIndices.length > gap) {
        recentIndices.shift();
      }
    }
  }

  return sequence;
}

// ── Lightbox ────────────────────────────────────────────────────────────────
interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function Lightbox({ src, alt, onClose }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const STEP = 0.5;

  const zoomIn  = () => setZoom(z => Math.min(z + STEP, MAX_ZOOM));
  const zoomOut = () => setZoom(z => Math.max(z - STEP, MIN_ZOOM));
  const resetZoom = () => setZoom(1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <span className="text-white/70 text-sm font-medium truncate max-w-[60%]">{alt}</span>
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
            title="Kichiklashtirish ( - )">
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
          <button onClick={resetZoom}
            className="px-3 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs font-bold transition-colors min-w-[52px]"
            title="Asl o'lcham ( 0 )">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-colors"
            title="Kattalashtirish ( + )">
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button onClick={onClose}
            className="ml-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Yopish (Esc)">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-auto flex items-center justify-center w-full h-full px-4 pt-16 pb-16">
        <motion.div animate={{ scale: zoom }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{ transformOrigin: 'center center' }} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" draggable={false} />
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-[11px] select-none">
        <span>+/- zoom</span><span>·</span><span>0 — asl o&apos;lcham</span><span>·</span><span>Esc — yopish</span>
      </div>
    </motion.div>
  );
}

// ── Blurred Image ───────────────────────────────────────────────────────────
function CarouselBlurredImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img src={src} alt="" aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" />
      <Image src={src} alt={alt} fill
        className="object-contain relative z-10 drop-shadow-md"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority} />
    </div>
  );
}

// ── Image Slider (within a person) ─────────────────────────────────────────
function PersonImageSlider({ images, imagePath, currentIndex, onChange, onOpenLightbox, personName, allPeopleTotal, peopleCurrent }:
  { images: string[]; imagePath: string; currentIndex: number; onChange: (i: number) => void;
    onOpenLightbox: (src: string, alt: string) => void; personName: string; allPeopleTotal: number; peopleCurrent: number }) {

  const total = images.length;
  const src = `${imagePath}${images[currentIndex]}`;

  return (
    <div className="relative w-full h-full">
      <CarouselBlurredImage src={src} alt={`${personName} — rasm ${currentIndex + 1}`} />

      {/* Gradient overlay for mobile name */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />

      {/* Mobile name overlay */}
      <div className="absolute bottom-4 left-4 right-4 lg:hidden z-20">
        <p className="text-white/70 text-xs sm:text-sm font-medium mb-0.5">{personName}</p>
        <p className="text-white/50 text-[10px]">{peopleCurrent} / {allPeopleTotal}</p>
      </div>

      {/* Zoom button */}
      <button
        onClick={() => onOpenLightbox(src, personName)}
        className="absolute top-3 right-3 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full
                   bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
                   md:opacity-0 md:group-hover:opacity-100 md:bg-black/30 md:hover:bg-black/50
                   transition-all duration-200 hover:scale-105 shadow-lg"
        aria-label="Rasmni kattalashtirish"
      >
        <span className="material-symbols-outlined text-lg md:text-xl">zoom_in</span>
      </button>

      {/* Image count badge + navigation */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onChange((currentIndex - 1 + total) % total); }}
            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
                       hover:bg-black/60 transition-colors"
            aria-label="Oldingi rasm"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold
                          px-2 md:px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px] md:text-[13px]">photo_library</span>
            {currentIndex + 1}/{total}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onChange((currentIndex + 1) % total); }}
            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center
                       hover:bg-black/60 transition-colors"
            aria-label="Keyingi rasm"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}

      {/* Single image count badge (no nav needed) */}
      {total <= 1 && (
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] md:text-xs font-semibold
                        px-2 md:px-2.5 py-1 rounded-full flex items-center gap-1 z-20">
          <span className="material-symbols-outlined text-[11px] md:text-[13px]">photo_library</span>
          {total} ta
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function FeaturedKomakchilar() {
  const [current, setCurrent] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Detect weak device — skip expensive shuffle
  const isWeak = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    if (navigator.hardwareConcurrency <= 2) return true;
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    return !!(conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g');
  }, []);

  // Defer the heavy JSON parse + shuffle to after mount
  const [sequence, setSequence] = useState<FeaturedPerson[]>([]);
  const [allPeople, setAllPeople] = useState<FeaturedPerson[]>([]);

  useEffect(() => {
    // Use setTimeout to push off the main thread during initial paint
    const id = setTimeout(() => {
      const people = getFeaturedPeople();
      setAllPeople(people);
      if (people.length <= 1 || isWeak) {
        setSequence(people);
      } else {
        const gap = Math.min(3, Math.floor(people.length / 2));
        setSequence(createSmartSequence(people, gap));
      }
    }, 0);
    return () => clearTimeout(id);
  }, [isWeak]);

  const total = sequence.length;
  const person = total > 0 ? sequence[current] : null;
  const hasMultipleImages = person ? person.images.length > 1 : false;

  useEffect(() => {
    setImageIndex(0);
  }, [current]);

  const nextPerson = useCallback(() => {
    setDirection(1);
    setCurrent(i => (i + 1) % total);
  }, [total]);

  const prevPerson = useCallback(() => {
    setDirection(-1);
    setCurrent(i => (i - 1 + total) % total);
  }, [total]);

  const nextImage = useCallback(() => {
    if (!person) return;
    setImageIndex(i => (i + 1) % person.images.length);
  }, [person]);

  const prevImage = useCallback(() => {
    if (!person) return;
    setImageIndex(i => (i - 1 + person.images.length) % person.images.length);
  }, [person]);

  const isEffectivelyPaused = isPaused || !!lightboxSrc;

  useEffect(() => {
    if (isEffectivelyPaused || total <= 1) return;
    timerRef.current = setInterval(nextPerson, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEffectivelyPaused, nextPerson, total]);

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };
  const closeLightbox = () => setLightboxSrc(null);

  // Loading state — show skeleton while deferred data loads
  if (total === 0) {
    return (
      <section className="py-14 sm:py-16 md:py-24 px-4 md:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-1/3 bg-surface-container-high rounded-xl animate-pulse mb-4" />
          <div className="h-[480px] bg-surface-container-high rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  // Slide transitions — instant on reduced-motion devices
  const slideVariants = prefersReducedMotion
    ? {
        enter: () => ({ opacity: 0 }),
        center: { opacity: 1 },
        exit: () => ({ opacity: 0 }),
      }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
      };

  const slideTransition = prefersReducedMotion
    ? { duration: 0.15 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <>
      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      <section className="py-14 sm:py-16 md:py-24 px-4 md:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-10 md:mb-14"
          >
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-6 h-[3px] rounded-full bg-primary flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary/80">Ko&apos;makchilar</span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-2 sm:mb-3">
              Loyiha ishtirokchilari bilan tanishing
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Ko&apos;mak loyihasi doirasida ssuda olgan va o&apos;z hududlarida o&apos;quv markazlari tashkil etgan yosh tadbirkorlar
            </p>
          </motion.div>

          {/* Carousel */}
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${current}-${person!.slug}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden
                           shadow-[0_16px_48px_-12px_rgba(19,27,46,0.1)] border border-outline-variant/15"
              >
                {/* Image Side — shows current person's current image */}
                <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[480px] xl:min-h-[520px] overflow-hidden group">
                  <PersonImageSlider
                    images={person!.images}
                    imagePath={person!.imagePath}
                    currentIndex={imageIndex}
                    onChange={setImageIndex}
                    onOpenLightbox={openLightbox}
                    personName={person!.name}
                    allPeopleTotal={allPeople.length}
                    peopleCurrent={(current % allPeople.length) + 1}
                  />
                </div>

                {/* Content Side */}
                <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between gap-4 sm:gap-5">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        <span className="material-symbols-outlined text-[11px] sm:text-[13px]">location_on</span>
                        {person!.viloyatName}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        <span className="material-symbols-outlined text-[11px] sm:text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Tavsif
                      </span>
                    </div>

                    {/* Name & Position — desktop */}
                    <div className="hidden lg:block">
                      <h3 className="font-headline text-2xl xl:text-3xl font-extrabold text-on-surface leading-tight mb-1.5">
                        {person!.name}
                      </h3>
                      <p className="text-primary font-medium text-base xl:text-lg">{person!.lavozim}</p>
                    </div>
                    <div className="lg:hidden">
                      <p className="text-primary font-medium text-sm sm:text-base">{person!.lavozim}</p>
                    </div>

                    {/* Location */}
                    {person!.location && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] sm:text-[16px]">home_pin</span>
                        {person!.location}
                      </div>
                    )}


                    {/* Loan Info Card */}
                    <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/10">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px]">payments</span>
                        <span className="font-bold text-primary text-xs sm:text-sm">Moliyalashtirish</span>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Ssuda miqdori</p>
                        <p className="font-headline font-extrabold text-xl sm:text-2xl text-on-surface">130 000 000 so&apos;m</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA and navigation */}
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <Link
                      href="/loyihalar"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-on-primary px-5 sm:px-6 py-3 sm:py-3.5
                                 rounded-xl font-bold hover:opacity-90 transition-all text-xs sm:text-sm shadow-md hover:shadow-lg
                                 hover:-translate-y-0.5 duration-200 w-full"
                    >
                      Barcha ko&apos;makchilarni ko&apos;rish
                      <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
                    </Link>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Small prev/next: navigate IMAGES within person (if multiple), else PEOPLE */}
                        {hasMultipleImages ? (
                          <>
                            <button onClick={prevImage}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                         flex items-center justify-center transition-colors text-on-surface"
                              aria-label="Oldingi rasm">
                              <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
                            </button>
                            <button onClick={nextImage}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                         flex items-center justify-center transition-colors text-on-surface"
                              aria-label="Keyingi rasm">
                              <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={prevPerson}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                         flex items-center justify-center transition-colors text-on-surface"
                              aria-label="Oldingi">
                              <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
                            </button>
                            <button onClick={nextPerson}
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                         flex items-center justify-center transition-colors text-on-surface"
                              aria-label="Keyingi">
                              <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Progress dots — person position */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {Array.from({ length: Math.min(8, total) }).map((_, i) => (
                          <button key={i}
                            onClick={() => {
                              const idx = current - (current % 8) + i;
                              if (idx < total) {
                                setDirection(idx > current ? 1 : -1);
                                setCurrent(idx);
                              }
                            }}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                              i === current % 8
                                ? 'w-4 sm:w-6 bg-primary'
                                : 'w-1.5 sm:w-2 bg-on-surface/20 hover:bg-on-surface/40'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Counter */}
                      <div className="flex items-center gap-1.5">
                        {lightboxSrc ? (
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                            <span className="material-symbols-outlined text-[11px] sm:text-[13px]">pause</span>
                            <span className="hidden sm:inline">Pauza</span>
                          </span>
                        ) : (
                          <span className="text-[11px] sm:text-sm text-on-surface-variant font-medium tabular-nums">
                            {(current % allPeople.length) + 1} / {allPeople.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Side arrows — large screens only, navigate PEOPLE */}
            <button onClick={prevPerson}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 xl:w-12 xl:h-12 rounded-full
                         bg-surface-container-lowest shadow-lg border border-outline-variant/20
                         items-center justify-center text-on-surface hover:bg-surface-container transition-colors z-10"
              aria-label="Oldingi">
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
            <button onClick={nextPerson}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 xl:w-12 xl:h-12 rounded-full
                         bg-surface-container-lowest shadow-lg border border-outline-variant/20
                         items-center justify-center text-on-surface hover:bg-surface-container transition-colors z-10"
              aria-label="Keyingi">
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>

            {/* Autoplay progress bar */}
            {!isEffectivelyPaused && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-outline-variant/10 rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
                <motion.div key={`progress-${current}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-primary/40 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

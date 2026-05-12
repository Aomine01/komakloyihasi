'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import komakchilarData from '@/komakchilar-data.json';

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

// ── Lightbox component ──────────────────────────────────────────────────────
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

  // Keyboard shortcuts
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
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <span className="text-white/70 text-sm font-medium truncate max-w-[60%]">{alt}</span>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30
                       flex items-center justify-center text-white transition-colors"
            title="Kichiklashtirish ( - )"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>

          <button
            onClick={resetZoom}
            className="px-3 h-9 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white text-xs font-bold transition-colors min-w-[52px]"
            title="Asl o'lcham ( 0 )"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30
                       flex items-center justify-center text-white transition-colors"
            title="Kattalashtirish ( + )"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="ml-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center text-white transition-colors"
            title="Yopish (Esc)"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative overflow-auto flex items-center justify-center w-full h-full px-4 pt-16 pb-16">
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{ transformOrigin: 'center center' }}
          className="relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-[11px] select-none">
        <span>+/- zoom</span>
        <span>·</span>
        <span>0 — asl o&apos;lcham</span>
        <span>·</span>
        <span>Esc — yopish</span>
      </div>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function FeaturedKomakchilar() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allPeople = useRef(getFeaturedPeople()).current;

  const sequence = useMemo(() => {
    if (allPeople.length <= 1) return allPeople;
    const gap = Math.min(3, Math.floor(allPeople.length / 2));
    return createSmartSequence(allPeople, gap);
  }, [allPeople]);

  const total = sequence.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(i => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(i => (i - 1 + total) % total);
  }, [total]);

  // Autoplay — pauses when lightbox is open OR hovered
  const isEffectivelyPaused = isPaused || !!lightboxSrc;

  useEffect(() => {
    if (isEffectivelyPaused || total <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEffectivelyPaused, next, total]);

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };
  const closeLightbox = () => setLightboxSrc(null);

  if (total === 0) return null;

  const person = sequence[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <>
      {/* ── Lightbox ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>people</span>
              <span>Ko&apos;makchilar</span>
            </div>
            <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-3">
              Loyiha ishtirokchilari bilan tanishing
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto">
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
                key={`${current}-${person.slug}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container-lowest rounded-3xl overflow-hidden
                           shadow-[0_16px_48px_-12px_rgba(19,27,46,0.1)] border border-outline-variant/15"
              >
                {/* Image Side */}
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] overflow-hidden group">
                  <Image
                    src={`${person.imagePath}${person.images[0]}`}
                    alt={person.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={current === 0}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />

                  {/* Mobile name overlay */}
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden z-10">
                    <p className="text-white/80 text-sm font-medium">{person.viloyatName}</p>
                    <h3 className="text-white text-2xl font-extrabold font-headline leading-tight">{person.name}</h3>
                  </div>

                  {/* ── Zoom button — visible on hover ── */}
                  <button
                    onClick={() => openLightbox(`${person.imagePath}${person.images[0]}`, person.name)}
                    className="absolute inset-0 flex items-center justify-center
                               bg-black/0 hover:bg-black/25 transition-all duration-300 group/zoom z-10"
                    aria-label="Rasmni kattalashtirish"
                  >
                    <span
                      className="flex items-center gap-2 bg-white/90 text-gray-800 text-xs font-bold
                                 px-4 py-2.5 rounded-full shadow-lg
                                 opacity-0 group-hover/zoom:opacity-100 translate-y-2 group-hover/zoom:translate-y-0
                                 transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      Kattalashtirish
                    </span>
                  </button>

                  {/* Image count badge */}
                  {person.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold
                                    px-2.5 py-1 rounded-full flex items-center gap-1 z-20">
                      <span className="material-symbols-outlined text-[13px]">photo_library</span>
                      {person.images.length} ta rasm
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[13px]">location_on</span>
                        {person.viloyatName}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        Tavsif mavjud
                      </span>
                    </div>

                    {/* Name & Position */}
                    <div className="hidden lg:block">
                      <h3 className="font-headline text-2xl xl:text-3xl font-extrabold text-on-surface leading-tight mb-2">
                        {person.name}
                      </h3>
                      <p className="text-primary font-medium text-lg">{person.lavozim}</p>
                    </div>
                    <div className="lg:hidden">
                      <p className="text-primary font-medium">{person.lavozim}</p>
                    </div>

                    {/* Location */}
                    {person.location && (
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">home_pin</span>
                        {person.location}
                      </div>
                    )}

                    {/* Loan Info Card */}
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                        <span className="font-bold text-primary text-sm">Moliyalashtirish</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Ssuda miqdori</p>
                        <p className="font-headline font-extrabold text-2xl text-on-surface">130 000 000 so&apos;m</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA and navigation */}
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/loyihalar"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-on-primary px-6 py-3.5
                                 rounded-xl font-bold hover:opacity-90 transition-all text-sm shadow-md hover:shadow-lg
                                 hover:-translate-y-0.5 duration-200 w-full"
                    >
                      Barcha ko&apos;makchilarni ko&apos;rish
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prev}
                          className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                     flex items-center justify-center transition-colors text-on-surface"
                          aria-label="Oldingi"
                        >
                          <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        <button
                          onClick={next}
                          className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest
                                     flex items-center justify-center transition-colors text-on-surface"
                          aria-label="Keyingi"
                        >
                          <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                      </div>

                      {/* Progress dots */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: Math.min(8, total) }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i === current % 8
                                ? 'w-6 bg-primary'
                                : 'w-2 bg-on-surface/20'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Timer paused badge */}
                      <div className="flex items-center gap-1.5">
                        {lightboxSrc ? (
                          <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                            <span className="material-symbols-outlined text-[13px]">pause</span>
                            Pauza
                          </span>
                        ) : (
                          <span className="text-sm text-on-surface-variant font-medium tabular-nums">
                            {(current % allPeople.length) + 1} / {allPeople.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Large screen side arrows */}
            <button
              onClick={prev}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full
                         bg-surface-container-lowest shadow-lg border border-outline-variant/20
                         items-center justify-center text-on-surface hover:bg-surface-container transition-colors z-10"
              aria-label="Oldingi"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
            <button
              onClick={next}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full
                         bg-surface-container-lowest shadow-lg border border-outline-variant/20
                         items-center justify-center text-on-surface hover:bg-surface-container transition-colors z-10"
              aria-label="Keyingi"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>

            {/* Autoplay progress bar */}
            {!isEffectivelyPaused && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-outline-variant/10 rounded-b-3xl overflow-hidden">
                <motion.div
                  key={`progress-${current}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-primary/40 rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

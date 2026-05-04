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

/**
 * Creates a smart random sequence where:
 * - People are shuffled randomly
 * - No person appears again until at least `gap` other people have been shown
 * - The sequence is infinite (wraps around)
 */
function createSmartSequence(people: FeaturedPerson[], gap: number = 3): FeaturedPerson[] {
  const pool = [...people];
  const sequence: FeaturedPerson[] = [];
  const recentIndices: number[] = []; // tracks indices of recently used people from pool

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Build a sequence that's 2x the pool length for smooth looping
  const targetLength = pool.length * 2;

  for (let step = 0; step < targetLength; step++) {
    // Find candidates not in recent window
    const candidates = pool.filter((_, idx) => !recentIndices.includes(idx));

    if (candidates.length === 0) {
      // If all are in recent (shouldn't happen if gap < pool.length), just pick randomly
      const pick = pool[Math.floor(Math.random() * pool.length)];
      sequence.push(pick);
    } else {
      // Pick a random candidate from eligible ones
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const pickIdx = pool.indexOf(pick);
      sequence.push(pick);

      // Track recent
      recentIndices.push(pickIdx);
      if (recentIndices.length > gap) {
        recentIndices.shift();
      }
    }
  }

  return sequence;
}

export default function FeaturedKomakchilar() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allPeople = useRef(getFeaturedPeople()).current;

  // Create a smart randomized sequence on mount
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

  // Autoplay
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next, total]);

  if (total === 0) return null;

  const person = sequence[current];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
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
              <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                <Image
                  src={`${person.imagePath}${person.images[0]}`}
                  alt={person.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={current === 0}
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />

                {/* Mobile name overlay */}
                <div className="absolute bottom-4 left-4 right-4 lg:hidden z-10">
                  <p className="text-white/80 text-sm font-medium">{person.viloyatName}</p>
                  <h3 className="text-white text-2xl font-extrabold font-headline leading-tight">{person.name}</h3>
                </div>

                {/* Image count badge */}
                {person.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold
                                  px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
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

                    {/* Counter */}
                    <span className="text-sm text-on-surface-variant font-medium tabular-nums">
                      {(current % allPeople.length) + 1} / {allPeople.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Large screen side navigation arrows */}
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

          {/* Autoplay progress indicator */}
          {!isPaused && (
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
  );
}

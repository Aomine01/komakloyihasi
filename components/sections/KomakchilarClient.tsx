'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Person {
  name: string;
  slug: string;
  featured: boolean;
  description: string | null;
  images: string[];
  imagePath: string;
  pdfUrl?: string | null;
}

interface Viloyat {
  name: string;
  slug: string;
  people: Person[];
}

interface KomakchilarData {
  viloyatlar: Viloyat[];
}

interface Props {
  data: KomakchilarData;
}

// ─── Parsing Helper ──────────────────────────────────────────────────────────

interface ParsedTavsif {
  ismFamiliya?: string;
  lavozim?: string;
  tugilganSana?: string;
  tugilganJoy?: string;
  yashashJoyi?: string;
  talim?: string[];
  faoliyat?: string[];
  ssudaMiqdori?: string;
  ssudaSanasi?: string;
  ssudaMaqsadi?: string;
  kelajakMaqsadi?: string;
  rasmlar?: Record<string, string>;
}

function parseTavsif(desc: string | null): ParsedTavsif | null {
  if (!desc || !desc.includes('ISM_FAMILIYA:')) return null;

  const parsed: ParsedTavsif = { talim: [], faoliyat: [], rasmlar: {} };
  let currentArrayField: 'talim' | 'faoliyat' | 'rasmlar' | null = null;

  const lines = desc.split('\n');
  for (const line of lines) {
    const tline = line.trim();
    if (!tline) continue;

    if (tline.startsWith('ТАЪЛИМ:')) { currentArrayField = 'talim'; continue; }
    if (tline.startsWith('ФАОЛИЯТ:')) { currentArrayField = 'faoliyat'; continue; }
    if (tline.startsWith('РАСМЛАР:')) { currentArrayField = 'rasmlar'; continue; }

    if (tline.startsWith('-') && currentArrayField) {
      const content = tline.substring(1).trim();
      if (currentArrayField === 'talim') parsed.talim!.push(content);
      else if (currentArrayField === 'faoliyat') parsed.faoliyat!.push(content);
      else if (currentArrayField === 'rasmlar') {
        const parts = content.split(':');
        if (parts.length >= 2) {
          parsed.rasmlar![parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      }
      continue;
    }

    const parts = tline.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      if (key === 'ISM_FAMILIYA') parsed.ismFamiliya = value;
      else if (key === 'LAVOZIM') parsed.lavozim = value;
      else if (key === 'TУГИЛГАН_САНА' || key === 'ТУҒИЛГАН_САНА') parsed.tugilganSana = value;
      else if (key === 'ТУҒИЛГАН_ЖОЙ') parsed.tugilganJoy = value;
      else if (key === 'ЯШАШ_ЖОЙИ') parsed.yashashJoyi = value;
      else if (key === 'SSUDA_MIQDORI') parsed.ssudaMiqdori = value;
      else if (key === 'SSUDA_SANASI') parsed.ssudaSanasi = value;
      else if (key === 'SSUDA_MAQSADI') parsed.ssudaMaqsadi = value;
      else if (key === 'КЕЛАЖАК_МАҚСАДИ') parsed.kelajakMaqsadi = value;
    }
  }

  return parsed;
}

// ─── Blurred Image ───────────────────────────────────────────────────────────

function BlurredImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
      />
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain relative z-10 drop-shadow-sm"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading={priority ? undefined : 'lazy'}
        priority={priority}
      />
    </div>
  );
}

// ─── Image Carousel ──────────────────────────────────────────────────────────

function ImageCarousel({ person, labels }: { person: Person; labels?: Record<string, string> }) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = person.images.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container rounded-2xl group cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          setIsFullscreen(true);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <BlurredImage
              src={`${person.imagePath}${person.images[current]}`}
              alt={`${person.name} — rasm ${current + 1}`}
              priority={current === 0}
            />
            {labels && labels[person.images[current]] && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 pb-9 text-center text-white/90 text-sm font-medium z-10">
                {labels[person.images[current]]}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows — always visible on mobile, hover on desktop */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full
                         bg-on-surface/60 text-white flex items-center justify-center
                         md:opacity-0 md:group-hover:opacity-100 transition-all duration-200
                         hover:bg-on-surface/80 z-20 shadow-lg backdrop-blur-sm"
              aria-label="Oldingi"
            >
              <span className="material-symbols-outlined text-xl md:text-base">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full
                         bg-on-surface/60 text-white flex items-center justify-center
                         md:opacity-0 md:group-hover:opacity-100 transition-all duration-200
                         hover:bg-on-surface/80 z-20 shadow-lg backdrop-blur-sm"
              aria-label="Keyingi"
            >
              <span className="material-symbols-outlined text-xl md:text-base">chevron_right</span>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {person.images.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`p-1 rounded-full transition-all ${
                    i === current ? 'bg-white w-5' : 'bg-white/50 w-2'
                  } h-2`}
                />
              ))}
              {total > 8 && (
                <span className="text-white/70 text-[10px] ml-1 self-center">+{total - 8}</span>
              )}
            </div>
          </>
        )}

        {/* Image count badge */}
        {total > 1 && (
          <div className="absolute top-3 right-3 bg-on-surface/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 z-20">
            <span className="material-symbols-outlined text-[13px]">photo_library</span>
            {current + 1}/{total}
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8" onClick={() => setIsFullscreen(false)}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
              className="absolute top-3 right-3 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
              aria-label="Yopish"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`${person.imagePath}${person.images[current]}`}
                alt={`${person.name} — rasm ${current + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
              {labels && labels[person.images[current]] && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center text-white text-lg font-medium">
                  {labels[person.images[current]]}
                </div>
              )}
            </motion.div>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
                  aria-label="Oldingi"
                >
                  <span className="material-symbols-outlined text-3xl">chevron_left</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-50"
                  aria-label="Keyingi"
                >
                  <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                  {current + 1} / {total}
                </div>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Collapsible List ────────────────────────────────────────────────────────

function CollapsibleList({ items, icon, title, color }: { items: string[]; icon: string; title: string; color: string }) {
  const [collapsed, setCollapsed] = useState(true);
  const INITIAL = 3;
  const showToggle = items.length > INITIAL;
  const displayed = collapsed ? items.slice(0, INITIAL) : items;

  return (
    <div>
      <h4 className="font-bold text-on-surface mb-2.5 flex items-center gap-2">
        <span className={`material-symbols-outlined text-primary text-[18px]`}>{icon}</span>
        {title}
      </h4>
      <ul className="space-y-2">
        {displayed.map((item, i) => (
          <li key={i} className="text-[13px] text-on-surface-variant pl-4 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full">
            {item}
          </li>
        ))}
      </ul>
      {showToggle && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline underline-offset-2"
        >
          <span className="material-symbols-outlined text-base">
            {collapsed ? 'expand_more' : 'expand_less'}
          </span>
          {collapsed ? `Yana ${items.length - INITIAL} ta` : 'Yopish'}
        </button>
      )}
    </div>
  );
}

// ─── Featured Card ───────────────────────────────────────────────────────────

function FeaturedCard({ person, viloyatName }: { person: Person; viloyatName: string }) {
  const [expanded, setExpanded] = useState(false);
  const desc = person.description ?? '';
  const parsed = parseTavsif(desc);

  if (parsed) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_12px_40px_-8px_rgba(19,27,46,0.08)]
                   border border-primary/15 hover:shadow-[0_20px_50px_-8px_rgba(19,27,46,0.12)] transition-shadow duration-300"
      >
        <div className="flex flex-col xl:flex-row">
          {/* Image */}
          <div className="xl:w-[45%] shrink-0">
            <div className="xl:h-full xl:min-h-[500px] relative">
              <ImageCarousel person={person} labels={parsed.rasmlar} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-5">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Tavsif mavjud
              </span>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[11px] sm:text-[13px]">location_on</span>
                {viloyatName}
              </span>
            </div>

            {/* Name */}
            <h3 className="font-headline text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface leading-tight">
              {parsed.ismFamiliya || person.name}
            </h3>

            {/* Toggle — show only on mobile */}
            <div className="md:hidden mt-1">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-primary/20
                           text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {expanded ? 'expand_less' : 'expand_more'}
                </span>
                {expanded ? "Yopish" : "Batafsil ko'rish"}
              </button>
            </div>

            {/* Collapsible details — collapsed on mobile, always open on desktop */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
                ${expanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}
                md:max-h-none md:opacity-100`}
            >
              {/* Position */}
              {parsed.lavozim && (
                <p className="text-primary font-medium text-base sm:text-lg">{parsed.lavozim}</p>
              )}

              {/* Personal info — compact row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-[13px] text-on-surface-variant mb-4">
                {parsed.tugilganSana && (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] sm:text-[16px]">calendar_today</span> {parsed.tugilganSana}</span>
                )}
                {parsed.tugilganJoy && (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] sm:text-[16px]">home_pin</span> {parsed.tugilganJoy}</span>
                )}
                {parsed.yashashJoyi && (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] sm:text-[16px]">location_city</span> {parsed.yashashJoyi}</span>
                )}
              </div>

              {/* Loan amount card */}
              <div className="bg-primary/5 rounded-2xl p-4 sm:p-5 border border-primary/10 mb-4">
                <h4 className="font-bold text-primary mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">payments</span>
                  Moliyalashtirish
                </h4>
                <div className="mb-2 sm:mb-3">
                  <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Ssuda miqdori</p>
                  <p className="font-headline font-extrabold text-xl sm:text-2xl text-on-surface">{parsed.ssudaMiqdori || "130 000 000 so'm"}</p>
                </div>
                {parsed.ssudaSanasi && (
                  <div className="mb-2">
                    <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Berilgan sana</p>
                    <p className="font-semibold text-on-surface text-sm">{parsed.ssudaSanasi}</p>
                  </div>
                )}
                {parsed.ssudaMaqsadi && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-0.5">Maqsad</p>
                    <p className="text-[13px] text-on-surface leading-relaxed">{parsed.ssudaMaqsadi}</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-outline-variant/30" />

              {/* Ta'lim & Faoliyat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-5">
                  {parsed.talim && parsed.talim.length > 0 && (
                    <CollapsibleList items={parsed.talim} icon="school" title="Ta'lim" color="primary" />
                  )}
                  {parsed.faoliyat && parsed.faoliyat.length > 0 && (
                    <CollapsibleList items={parsed.faoliyat} icon="work" title="Faoliyat" color="primary" />
                  )}
                </div>
              </div>

              {/* Kelajak maqsadi */}
              {parsed.kelajakMaqsadi && (
                <div className="bg-surface-container-low rounded-2xl p-4 sm:p-6 relative overflow-hidden mt-4">
                  <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl sm:text-7xl text-on-surface/5" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary mb-1.5 sm:mb-2">Kelajak maqsadi</p>
                  <p className="text-xs sm:text-sm text-on-surface-variant italic relative z-10 leading-relaxed">"{parsed.kelajakMaqsadi}"</p>
                </div>
              )}

              {/* PDF link */}
              {person.pdfUrl && (
                <div className="pt-3 border-t border-outline-variant/30 mt-4">
                  <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors shadow-sm text-sm">
                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    Taqdimotni ko'rish (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  const isLong = desc.length > 300;
  const displayDesc = expanded ? desc : desc.slice(0, 300);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_12px_40px_-8px_rgba(19,27,46,0.08)]
                 border border-primary/15 hover:shadow-[0_20px_50px_-8px_rgba(19,27,46,0.12)] transition-shadow duration-300"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[45%] shrink-0">
          <div className="lg:h-full lg:min-h-[400px] relative">
            <ImageCarousel person={person} />
          </div>
        </div>

        <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Tavsif mavjud
            </span>
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[11px] sm:text-[13px]">location_on</span>
              {viloyatName}
            </span>
          </div>

          <h3 className="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface mb-3 sm:mb-4 leading-tight">
            {person.name}
          </h3>

          <div className="text-on-surface-variant text-sm sm:text-[15px] leading-relaxed flex-grow">
            <p className="whitespace-pre-line">
              {displayDesc}
              {isLong && !expanded && '...'}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline underline-offset-4"
              >
                <span className="material-symbols-outlined text-base">
                  {expanded ? 'expand_less' : 'expand_more'}
                </span>
                {expanded ? "Yopish" : "Ko'proq o'qish"}
              </button>
            )}
          </div>

          {person.pdfUrl && (
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors shadow-sm text-sm">
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                Taqdimotni ko'rish (PDF)
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Regular Card ────────────────────────────────────────────────────────────

function RegularCard({ person, viloyatName }: { person: Person; viloyatName: string }) {
  const parsed = parseTavsif(person.description);
  const loanAmount = parsed?.ssudaMiqdori;
  const location = parsed?.yashashJoyi || parsed?.tugilganJoy;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4 }}
      className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_24px_-4px_rgba(19,27,46,0.06)]
                 hover:shadow-[0_16px_36px_-4px_rgba(19,27,46,0.1)] transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full"
    >
      <ImageCarousel person={person} />
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow gap-1.5">
        {/* Viloyat badge */}
        <span className="self-start inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
          <span className="material-symbols-outlined text-[11px] sm:text-[13px]">location_on</span>
          {viloyatName}
        </span>

        {/* Name */}
        <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface leading-tight">
          {person.name}
        </h3>

        {/* Loan amount + location — from parsed data */}
        {loanAmount && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm mt-1">
            <span className="font-headline font-bold text-primary">{loanAmount}</span>
            {location && (
              <>
                <span className="text-outline-variant/60">·</span>
                <span className="text-on-surface-variant text-xs">{location}</span>
              </>
            )}
          </div>
        )}

        {/* PDF link — subtle */}
        {person.pdfUrl && (
          <div className="mt-auto pt-3">
            <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary font-medium transition-colors">
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              Taqdimotni ko'rish
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function KomakchilarClient({ data }: Props) {
  const [activeViloyat, setActiveViloyat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabBarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const totalPeople = data.viloyatlar.reduce((sum, v) => sum + v.people.length, 0);
  const totalFeatured = data.viloyatlar.reduce((sum, v) => sum + v.people.filter(p => p.featured).length, 0);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Helper: check if a person matches the search query (by name or ISM_FAMILIYA)
  const personMatchesSearch = useCallback((p: Person, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    // Match against the folder/slug name
    if (p.name.toLowerCase().includes(q)) return true;
    // Match against ISM_FAMILIYA from parsed description
    if (p.description) {
      const match = p.description.match(/ISM_FAMILIYA:\s*(.+)/i);
      if (match && match[1].trim().toLowerCase().includes(q)) return true;
    }
    return false;
  }, []);

  // Combined filter: viloyat + search
  const filteredViloyatlar = useMemo(() => {
    return data.viloyatlar
      .filter(v => !activeViloyat || v.slug === activeViloyat)
      .map(v => ({
        ...v,
        people: v.people.filter(p => personMatchesSearch(p, debouncedSearch)),
      }))
      .filter(v => v.people.length > 0);
  }, [data.viloyatlar, activeViloyat, debouncedSearch, personMatchesSearch]);

  // Filtered counts per viloyat (for search-aware pill badges)
  const filteredCountsBySlug = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of data.viloyatlar) {
      counts[v.slug] = v.people.filter(p => personMatchesSearch(p, debouncedSearch)).length;
    }
    return counts;
  }, [data.viloyatlar, debouncedSearch, personMatchesSearch]);

  const totalFilteredPeople = useMemo(
    () => filteredViloyatlar.reduce((sum, v) => sum + v.people.length, 0),
    [filteredViloyatlar]
  );

  const hasFilters = activeViloyat || debouncedSearch;

  const clearAll = useCallback(() => {
    setActiveViloyat(null);
    setSearchQuery('');
    setDebouncedSearch('');
    searchRef.current?.focus();
  }, []);

  // Scroll active tab into view
  useEffect(() => {
    if (activeViloyat && tabBarRef.current) {
      const activeBtn = tabBarRef.current.querySelector(`[data-viloyat="${activeViloyat}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeViloyat]);

  const handleTabClick = (slug: string | null) => {
    setActiveViloyat(slug);
    // Don't clear search when switching viloyat tabs — allow combined filtering
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 lg:pt-32 pb-10 sm:pb-16 lg:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004f45] via-[#00685f] to-[#008378]" />
        {/* Decorative circles — desktop only */}
        <div className="hidden md:block absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #84d5c5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="hidden md:block absolute bottom-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6bd8cb 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge — hidden on mobile to save space */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm
                         text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-8"
            >
              <span className="material-symbols-outlined text-[12px] sm:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
              Ko&apos;mak loyihasi ishtirokchilari
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white
                         leading-[1.1] sm:leading-[1.05] tracking-tight mb-3 sm:mb-5"
            >
              Ko&apos;makchilar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-white/75 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-6 sm:mb-10"
            >
              Ko&apos;mak loyihasi doirasida ssuda olgan va o&apos;quv markazlarini tashkil etgan
              yosh tadbirkorlar bilan tanishing.
            </motion.p>
          </div>

          {/* Stats — compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="flex flex-wrap gap-2 sm:gap-3"
          >
            {[
              { icon: 'people', value: debouncedSearch ? totalFilteredPeople : totalPeople, label: "Ko'makchi" },
              { icon: 'star', value: totalFeatured, label: "Tavsif bilan" },
              { icon: 'location_on', value: data.viloyatlar.length, label: 'Viloyat' },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 sm:gap-2.5 bg-white/10 border border-white/15
                           backdrop-blur-sm rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2.5"
              >
                <span
                  className="material-symbols-outlined text-white/80 text-sm sm:text-lg lg:text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {stat.icon}
                </span>
                <div>
                  <p className="text-white font-headline font-bold text-sm sm:text-base lg:text-xl leading-none">{stat.value}</p>
                  <p className="text-white/55 text-[8px] sm:text-[10px] lg:text-xs mt-0 hidden sm:block">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR: Search + Viloyat Pills ─────────────────── */}
      <div className="sticky top-20 md:top-24 z-30 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">

          {/* Search input */}
          <div className="relative mb-2 sm:mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg pointer-events-none select-none">
              search
            </span>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ism yoki familiya bo'yicha qidirish..."
              autoComplete="off"
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20
                         text-on-surface text-sm placeholder:text-on-surface-variant/50 outline-none
                         focus:bg-surface-container-low focus:border-primary/30 focus:ring-2 focus:ring-primary/5
                         transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
                             text-on-surface-variant/50 hover:text-on-surface-variant rounded-full hover:bg-surface-container-highest transition-all"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Pills row with nav arrows */}
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => {
                const el = tabBarRef.current;
                if (!el) return;
                el.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-8 h-8 rounded-full
                         bg-surface-container-lowest shadow border border-outline-variant/20
                         flex items-center justify-center text-on-surface hover:bg-surface-container
                         transition-colors"
              aria-label="Oldingi viloyatlar"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

          <div ref={tabBarRef} className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide px-3 sm:px-4">
            {/* All tab */}
            <button
              onClick={() => handleTabClick(null)}
              className={`shrink-0 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full
                         font-medium text-xs sm:text-sm transition-all duration-200 ${
                activeViloyat === null
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] sm:text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>apps</span>
              Barchasi
              <span className={`text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                activeViloyat === null ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
              }`}>
                {debouncedSearch ? Object.values(filteredCountsBySlug).reduce((a, b) => a + b, 0) : totalPeople}
              </span>
            </button>

            {[...data.viloyatlar].sort((a, b) => {
              if (a.slug === 'qoraqalpogiston') return -1;
              if (b.slug === 'qoraqalpogiston') return 1;
              if (a.slug === 'toshkent-shahri') return 1;
              if (b.slug === 'toshkent-shahri') return -1;
              return a.name.localeCompare(b.name);
            }).map(v => {
              const isQoraqalpogiston = v.slug === 'qoraqalpogiston';
              const displayName = isQoraqalpogiston
                ? "Qoraqalpog'iston Respublikasi"
                : v.name.replace(/ viloyati$/i, '');

              return (
                <React.Fragment key={v.slug}>
                  <button
                    data-viloyat={v.slug}
                    onClick={() => handleTabClick(v.slug)}
                    className={`shrink-0 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full
                               font-medium text-xs sm:text-sm transition-all duration-200 ${
                      activeViloyat === v.slug
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {isQoraqalpogiston && <span className="material-symbols-outlined text-[13px] sm:text-[15px] text-primary sm:mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>}
                    {displayName}
                    <span className={`text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeViloyat === v.slug ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {debouncedSearch ? (filteredCountsBySlug[v.slug] ?? 0) : v.people.length}
                    </span>
                  </button>
                  {isQoraqalpogiston && (
                    <div className="w-px h-5 sm:h-6 bg-outline-variant/40 self-center mx-0.5 sm:mx-1 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

            {/* Right arrow */}
            <button
              onClick={() => {
                const el = tabBarRef.current;
                if (!el) return;
                el.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-8 h-8 rounded-full
                         bg-surface-container-lowest shadow border border-outline-variant/20
                         flex items-center justify-center text-on-surface hover:bg-surface-container
                         transition-colors"
              aria-label="Keyingi viloyatlar"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 pt-1.5 overflow-hidden"
              >
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider shrink-0">Faol filtr:</span>
                {activeViloyat && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {data.viloyatlar.find(v => v.slug === activeViloyat)?.name.replace(/ viloyati$/i, '')}
                    <button onClick={() => setActiveViloyat(null)} className="hover:text-primary/70 ml-0.5">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                )}
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    "{debouncedSearch}"
                    <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); }} className="hover:text-secondary/70 ml-0.5">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAll}
                  className="ml-auto text-[11px] text-on-surface-variant hover:text-primary font-medium transition-colors shrink-0"
                >
                  Tozalash
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── CONTENT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeViloyat}-${debouncedSearch}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="text-on-surface-variant text-xs sm:text-sm flex items-center gap-2"
            >
              <span className="font-bold text-on-surface text-sm sm:text-base">{totalFilteredPeople}</span>
              ta o&apos;quv markaz
              {activeViloyat && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  {data.viloyatlar.find(v => v.slug === activeViloyat)?.name.replace(/ viloyati$/i, '')}
                </span>
              )}
              {debouncedSearch && (
                <span className="text-on-surface-variant">
                  — &quot;{debouncedSearch}&quot; bo&apos;yicha
                </span>
              )}
            </motion.p>
          </AnimatePresence>

          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant
                         hover:text-primary transition-colors bg-surface-container-high
                         hover:bg-primary/10 px-2.5 py-1.5 rounded-full shrink-0"
            >
              <span className="material-symbols-outlined text-sm">filter_alt_off</span>
              <span className="hidden sm:inline">Tozalash</span>
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {totalFilteredPeople === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl bg-surface-container-low py-16 sm:py-24 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-4 sm:mb-6">
                <span className="material-symbols-outlined text-outline text-3xl sm:text-4xl">
                  {debouncedSearch ? 'search_off' : 'school'}
                </span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-semibold text-on-surface mb-2">
                {debouncedSearch ? 'Natija topilmadi' : 'Ma\'lumot yo\'q'}
              </h3>
              <p className="text-on-surface-variant text-sm max-w-sm px-4">
                {debouncedSearch
                  ? `"${debouncedSearch}" so\u2018zi bo\u2018yicha hech narsa topilmadi.`
                  : "Bu hududda hozircha ko\u2018makchilar ro\u2018yxatga olinmagan."}
              </p>
              {hasFilters && (
                <button onClick={clearAll} className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Barcha ko&apos;makchilarga qaytish
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeViloyat ?? 'all'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {filteredViloyatlar.map(viloyat => {
                const featured = viloyat.people.filter(p => p.featured);
                const regular = viloyat.people.filter(p => !p.featured);

                return (
                  <section
                    key={viloyat.slug}
                    id={`viloyat-${viloyat.slug}`}
                    ref={el => { sectionRefs.current[viloyat.slug] = el; }}
                    className="mb-12 sm:mb-16 last:mb-0"
                  >
                    {/* Section heading */}
                    <div className="flex items-center gap-3 mb-5 sm:mb-8">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-base sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          location_on
                        </span>
                      </div>
                      <div>
                        <h2 className="font-headline text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-on-surface">
                          {viloyat.name}
                        </h2>
                        <p className="text-on-surface-variant text-xs sm:text-sm">
                          {viloyat.people.length} ta ko&apos;makchi
                        </p>
                      </div>
                    </div>

                    {/* Featured cards */}
                    {featured.length > 0 && (
                      <div className="flex flex-col gap-6 sm:gap-8 mb-6 sm:mb-8">
                        {featured.map(person => (
                          <FeaturedCard
                            key={person.slug}
                            person={person}
                            viloyatName={viloyat.name.replace(/ viloyati$/i, '')}
                          />
                        ))}
                      </div>
                    )}

                    {/* Regular cards */}
                    {regular.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {regular.map(person => (
                          <RegularCard
                            key={person.slug}
                            person={person}
                            viloyatName={viloyat.name.replace(/ viloyati$/i, '')}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── BOTTOM STATS BAND ───────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#004f45] to-[#00685f] mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 sm:py-14">
          <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-6 sm:mb-10">
            Loyiha natijalari · 2025–2026
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {[
              {
                icon: 'people',
                value: totalPeople,
                label: "Jami ko'makchilar",
                desc: "Ssuda olgan yosh tadbirkorlar",
              },
              {
                icon: 'description',
                value: totalFeatured,
                label: "Tavsifga ega",
                desc: "To'liq ma'lumotnomalari mavjud",
              },
              {
                icon: 'location_on',
                value: data.viloyatlar.length,
                label: "Qamrab olingan viloyatlar",
                desc: "O'zbekistonning barcha hududlari",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-lg sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="font-headline text-2xl sm:text-4xl font-extrabold text-white leading-none mb-0.5 sm:mb-1">
                    {item.value}
                  </p>
                  <p className="font-semibold text-white/90 text-xs sm:text-sm mb-0.5">{item.label}</p>
                  <p className="text-white/55 text-[10px] sm:text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

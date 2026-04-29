'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    
    // Check array headers
    if (tline.startsWith('ТАЪЛИМ:')) { currentArrayField = 'talim'; continue; }
    if (tline.startsWith('ФАОЛИЯТ:')) { currentArrayField = 'faoliyat'; continue; }
    if (tline.startsWith('РАСМЛАР:')) { currentArrayField = 'rasmlar'; continue; }
    
    // Check array items
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
    
    // Check key-value pairs
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

// ─── Image Carousel ──────────────────────────────────────────────────────────

function ImageCarousel({ person, labels }: { person: Person; labels?: Record<string, string> }) {
  const [current, setCurrent] = useState(0);
  const total = person.images.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);

  // Touch swipe support
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
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container rounded-2xl group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          <Image
            src={`${person.imagePath}${person.images[current]}`}
            alt={`${person.name} — rasm ${current + 1}`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {labels && labels[person.images[current]] && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 pb-9 text-center text-white/90 text-sm font-medium z-10">
              {labels[person.images[current]]}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-on-surface/50 text-white
                       flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-on-surface/70 z-10"
            aria-label="Oldingi"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-on-surface/50 text-white
                       flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-on-surface/70 z-10"
            aria-label="Keyingi"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {person.images.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/50'
                }`}
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
        <div className="absolute top-3 right-3 bg-on-surface/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
          <span className="material-symbols-outlined text-[13px]">photo_library</span>
          {current + 1}/{total}
        </div>
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
          <div className="xl:w-[45%] shrink-0">
            <div className="xl:h-full xl:min-h-[500px] relative">
              <ImageCarousel person={person} labels={parsed.rasmlar} />
            </div>
          </div>
          
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                   <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   Tavsif mavjud
                 </span>
                 <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                   <span className="material-symbols-outlined text-[13px]">location_on</span>
                   {viloyatName}
                 </span>
               </div>
               <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight mb-2">
                 {parsed.ismFamiliya || person.name}
               </h3>
               {parsed.lavozim && (
                 <p className="text-primary font-medium text-lg">{parsed.lavozim}</p>
               )}
               
               <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[13px] text-on-surface-variant">
                 {parsed.tugilganSana && (
                   <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Tug'ilgan sana: {parsed.tugilganSana}</span>
                 )}
                 {parsed.tugilganJoy && (
                   <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">home_pin</span> Tug'ilgan joy: {parsed.tugilganJoy}</span>
                 )}
                 {parsed.yashashJoyi && (
                   <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_city</span> Yashash joyi: {parsed.yashashJoyi}</span>
                 )}
               </div>
             </div>
             
             <div className="h-px bg-outline-variant/30" />
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 {parsed.talim && parsed.talim.length > 0 && (
                   <div>
                     <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">school</span> Ta'lim</h4>
                     <ul className="space-y-2.5">
                       {parsed.talim.map((item, i) => (
                         <li key={i} className="text-[13px] text-on-surface-variant pl-4 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full">{item}</li>
                       ))}
                     </ul>
                   </div>
                 )}
                 
                 {parsed.faoliyat && parsed.faoliyat.length > 0 && (
                   <div>
                     <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[18px]">work</span> Faoliyat</h4>
                     <ul className="space-y-2.5">
                       {parsed.faoliyat.map((item, i) => (
                         <li key={i} className="text-[13px] text-on-surface-variant pl-4 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full">{item}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
               
               <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col">
                  <h4 className="font-bold text-primary mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">payments</span> Moliyalashtirish</h4>
                  
                  <div className="mb-4">
                    <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Ssuda miqdori</p>
                    <p className="font-headline font-extrabold text-2xl text-on-surface">{parsed.ssudaMiqdori || "130 000 000 so'm"}</p>
                  </div>
                  {parsed.ssudaSanasi && (
                    <div className="mb-4">
                      <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Berilgan sana</p>
                      <p className="font-semibold text-on-surface text-sm">{parsed.ssudaSanasi}</p>
                    </div>
                  )}
                  {parsed.ssudaMaqsadi && (
                    <div>
                      <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Maqsad</p>
                      <p className="text-[13px] text-on-surface leading-relaxed">{parsed.ssudaMaqsadi}</p>
                    </div>
                  )}
               </div>
             </div>
             
             {parsed.kelajakMaqsadi && (
               <div className="mt-auto pt-2">
                 <div className="bg-surface-container-low rounded-2xl p-6 relative overflow-hidden">
                   <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-7xl text-on-surface/5" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">Kelajak maqsadi</p>
                   <p className="text-sm text-on-surface-variant italic relative z-10 leading-relaxed">"{parsed.kelajakMaqsadi}"</p>
                 </div>
               </div>
             )}
             
             {person.pdfUrl && (
               <div className="mt-4 pt-4 border-t border-outline-variant/30">
                 <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors shadow-sm">
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
        {/* Image carousel — left side on desktop */}
        <div className="lg:w-[45%] shrink-0">
          <div className="lg:h-full lg:min-h-[400px] relative">
            <ImageCarousel person={person} />
          </div>
        </div>

        {/* Content — right side */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col">
          {/* Featured badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              Tavsif mavjud
            </span>
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              {viloyatName}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mb-4 leading-tight">
            {person.name}
          </h3>

          {/* Description */}
          <div className="text-on-surface-variant text-[15px] leading-relaxed flex-grow">
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
              <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors shadow-sm">
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
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-headline text-lg sm:text-xl font-bold text-on-surface mb-3">
          {person.name}
        </h3>
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            {viloyatName}
          </span>
        </div>
        
        {person.pdfUrl && (
          <div className="mt-auto pt-4 border-t border-outline-variant/20">
            <a href={person.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-highest hover:bg-primary/10 hover:text-primary text-on-surface font-semibold text-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabBarRef = useRef<HTMLDivElement>(null);

  const totalPeople = data.viloyatlar.reduce((sum, v) => sum + v.people.length, 0);
  const totalFeatured = data.viloyatlar.reduce((sum, v) => sum + v.people.filter(p => p.featured).length, 0);

  const filteredViloyatlar = activeViloyat
    ? data.viloyatlar.filter(v => v.slug === activeViloyat)
    : data.viloyatlar;

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
    // Scroll to top of content
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004f45] via-[#00685f] to-[#008378]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #84d5c5 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6bd8cb 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm
                         text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                school
              </span>
              Ko&apos;mak loyihasi ishtirokchilari
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold text-white
                         leading-[1.05] tracking-tight mb-5"
            >
              Ko&apos;makchilar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-white/70 text-lg leading-relaxed max-w-xl mb-10"
            >
              Ko&apos;mak loyihasi doirasida ssuda olgan va o&apos;quv markazlarini tashkil etgan
              yosh tadbirkorlar bilan tanishing.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-4 flex flex-wrap gap-3"
          >
            {[
              { icon: 'people', value: totalPeople, label: "Ko'makchi" },
              { icon: 'star', value: totalFeatured, label: "Tavsif bilan" },
              { icon: 'location_on', value: data.viloyatlar.length, label: 'Viloyat' },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 border border-white/15
                           backdrop-blur-sm rounded-2xl px-5 py-3"
              >
                <span
                  className="material-symbols-outlined text-white/80 text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {stat.icon}
                </span>
                <div>
                  <p className="text-white font-headline font-bold text-xl leading-none">{stat.value}</p>
                  <p className="text-white/55 text-xs mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER TAB BAR ──────────────────────────────────── */}
      <div className="sticky top-20 md:top-24 z-30 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/15 shadow-[0_4px_20px_rgba(19,27,46,0.04)]">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2.5">
            Viloyat tanlang
          </p>
          <div ref={tabBarRef} className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar">
            {/* All tab */}
            <button
              onClick={() => handleTabClick(null)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                         font-medium text-sm transition-all duration-200 ${
                activeViloyat === null
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>apps</span>
              Barchasi
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                activeViloyat === null ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
              }`}>
                {totalPeople}
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
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                               font-medium text-sm transition-all duration-200 ${
                      activeViloyat === v.slug
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {isQoraqalpogiston && <span className="material-symbols-outlined text-[15px] text-primary mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>}
                    {displayName}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeViloyat === v.slug ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                    }`}>
                      {v.people.length}
                    </span>
                  </button>
                  {isQoraqalpogiston && (
                    <div className="w-px h-6 bg-outline-variant/40 self-center mx-1 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
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
                  className="mb-16 last:mb-0"
                >
                  {/* Section heading */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          location_on
                        </span>
                      </div>
                      <div>
                        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
                          {viloyat.name}
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                          {viloyat.people.length} ta ko&apos;makchi
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-outline-variant/20 hidden sm:block" />
                  </div>

                  {/* Featured cards — full width */}
                  {featured.length > 0 && (
                    <div className="flex flex-col gap-8 mb-8">
                      {featured.map(person => (
                        <FeaturedCard
                          key={person.slug}
                          person={person}
                          viloyatName={viloyat.name.replace(/ viloyati$/i, '')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Regular cards — grid */}
                  {regular.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regular.map(person => (
                        <RegularCard
                          key={person.slug}
                          person={person}
                          viloyatName={viloyat.name.replace(/ viloyati$/i, '')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Empty viloyat */}
                  {viloyat.people.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-surface-container-low py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-outline text-3xl">info</span>
                      </div>
                      <h3 className="font-headline text-lg font-semibold text-on-surface mb-1">
                        Ma&apos;lumot yo&apos;q
                      </h3>
                      <p className="text-on-surface-variant text-sm">
                        Bu viloyatda hozircha ko&apos;makchilar ro&apos;yxatga olinmagan.
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── BOTTOM STATS BAND ───────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#004f45] to-[#00685f] mt-8">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-10">
            Loyiha natijalari · 2025–2026
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-white text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="font-headline text-4xl font-extrabold text-white leading-none mb-1">
                    {item.value}
                  </p>
                  <p className="font-semibold text-white/90 text-sm mb-0.5">{item.label}</p>
                  <p className="text-white/55 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
